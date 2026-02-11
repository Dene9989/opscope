"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ModalForm } from "@/components/ui/ModalForm";
import { useToast } from "@/components/ui/Toast";
import {
  AnswerValue,
  ChecklistTemplate,
  Evidence,
  EvidenceOwnerType,
  InspectionRun,
  InspectionRunDetails,
  Severity,
  SstInspectionsProvider
} from "../data/sstInspectionsProvider";
import { requiresPhotoOnFail } from "../rules/sstInspectionRules";
import { EvidenceUploader } from "./EvidenceUploader";

interface InspectionWizardProps {
  open: boolean;
  onClose: () => void;
  template: ChecklistTemplate | null;
  projectId: string;
  worksiteId?: string;
  inspectorId: string;
  provider: SstInspectionsProvider;
  onFinished: (runId: string) => void;
}

type AnswerDraft = {
  answerId?: string;
  answer?: AnswerValue;
  notes?: string;
  evidences: Evidence[];
};

export function InspectionWizard({
  open,
  onClose,
  template,
  projectId,
  worksiteId,
  inspectorId,
  provider,
  onFinished
}: InspectionWizardProps) {
  const { push } = useToast();
  const didInitRef = useRef(false);
  const [run, setRun] = useState<InspectionRun | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerDraft>>({});
  const [runDetails, setRunDetails] = useState<InspectionRunDetails | null>(null);
  const [includeMed, setIncludeMed] = useState(false);
  const [runEvidences, setRunEvidences] = useState<Evidence[]>([]);

  const orderedQuestions = useMemo(() => {
    return template?.questions.slice().sort((a, b) => a.order - b.order) ?? [];
  }, [template]);

  useEffect(() => {
    if (!open) {
      didInitRef.current = false;
      setRun(null);
      setCurrentIndex(0);
      setAnswers({});
      setRunDetails(null);
      setIncludeMed(false);
      setRunEvidences([]);
      return;
    }

    if (!template || !projectId || !inspectorId || didInitRef.current) return;

    didInitRef.current = true;
    setLoading(true);
    provider
      .startRun({
        templateId: template.id,
        projectId,
        worksiteId,
        inspectorId
      })
      .then((newRun) => {
        setRun(newRun);
      })
      .catch((error) => {
        push(error instanceof Error ? error.message : "Erro ao iniciar inspecao", "error");
        onClose();
      })
      .finally(() => setLoading(false));
  }, [open, template, projectId, worksiteId, inspectorId, provider, push, onClose]);

  if (!open) return null;

  const totalQuestions = orderedQuestions.length;
  const isSummary = currentIndex >= totalQuestions;
  const currentQuestion = orderedQuestions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const updateAnswer = (questionId: string, patch: Partial<AnswerDraft>) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        evidences: current[questionId]?.evidences ?? [],
        ...current[questionId],
        ...patch
      }
    }));
  };

  const persistAnswer = async (questionId: string) => {
    if (!run) return null;
    const draft = answers[questionId];
    if (!draft?.answer) return null;
    const saved = await provider.saveAnswer({
      runId: run.id,
      questionId,
      answer: draft.answer,
      notes: draft.notes
    });
    updateAnswer(questionId, { answerId: saved.id });
    return saved;
  };

  const handleSelectAnswer = async (value: AnswerValue) => {
    if (!currentQuestion) return;
    updateAnswer(currentQuestion.id, { answer: value });
    if (!run) return;
    try {
      const saved = await provider.saveAnswer({
        runId: run.id,
        questionId: currentQuestion.id,
        answer: value,
        notes: currentAnswer?.notes
      });
      updateAnswer(currentQuestion.id, { answerId: saved.id });
    } catch {
      // ignore immediate save errors; will validate on next
    }
  };

  const handleUploadEvidence = async (file: File) => {
    if (!currentQuestion || !run) return;
    const draft = answers[currentQuestion.id];
    if (!draft?.answerId) {
      const saved = await persistAnswer(currentQuestion.id);
      if (!saved) {
        push("Selecione uma resposta antes de anexar", "error");
        return;
      }
    }
    const answerId = answers[currentQuestion.id]?.answerId ?? (await persistAnswer(currentQuestion.id))?.id;
    if (!answerId) return;
    const evidence = await provider.attachEvidence({
      ownerType: EvidenceOwnerType.INSPECTION_ANSWER,
      ownerId: answerId,
      file
    });
    updateAnswer(currentQuestion.id, {
      evidences: [...(answers[currentQuestion.id]?.evidences ?? []), evidence]
    });
  };

  const handleUploadRunEvidence = async (file: File) => {
    if (!run) return;
    const evidence = await provider.attachEvidence({
      ownerType: EvidenceOwnerType.INSPECTION_RUN,
      ownerId: run.id,
      file
    });
    setRunEvidences((current) => [...current, evidence]);
  };

  const goNext = async () => {
    if (!currentQuestion) return;
    if (!currentAnswer?.answer) {
      push("Selecione uma resposta", "error");
      return;
    }
    const missingPhoto = requiresPhotoOnFail(
      currentQuestion,
      currentAnswer.answer,
      currentAnswer.evidences || []
    );
    if (missingPhoto) {
      push("Foto obrigatoria para itens nao conformes", "error");
      return;
    }

    await persistAnswer(currentQuestion.id);

    if (currentIndex === totalQuestions - 1) {
      if (!run) return;
      setLoading(true);
      const finished = await provider.finishRun({ runId: run.id });
      const details = await provider.getRunDetails(finished.id);
      setRunDetails(details);
      setCurrentIndex(totalQuestions);
      setLoading(false);
      onFinished(finished.id);
      return;
    }

    setCurrentIndex((value) => value + 1);
  };

  const goBack = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((value) => Math.max(0, value - 1));
  };

  const handleGenerateNcs = async () => {
    if (!run) return;
    const includeSeverities = includeMed
      ? [Severity.HIGH, Severity.CRITICAL, Severity.MED]
      : [Severity.HIGH, Severity.CRITICAL];
    await provider.generateNcsFromRun({ runId: run.id, includeSeverities, mode: "PER_ANSWER" });
    const details = await provider.getRunDetails(run.id);
    setRunDetails(details);
    push("NCs geradas", "success");
  };

  return (
    <ModalForm
      open={open}
      title="Executar inspecao"
      onClose={onClose}
      footer={
        !isSummary ? (
          <>
            <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={goBack}>
              Voltar
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={goNext}>
              {currentIndex === totalQuestions - 1 ? "Finalizar" : "Proximo"}
            </button>
          </>
        ) : (
          <>
            <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={onClose}>
              Fechar
            </button>
          </>
        )
      }
    >
      {loading ? (
        <div className="text-sm text-muted">Carregando...</div>
      ) : null}

      {!loading && !template ? <p className="text-sm text-muted">Selecione um template.</p> : null}

      {!loading && template && !isSummary ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted">{template.name}</p>
              <h4 className="text-lg font-semibold">Pergunta {currentIndex + 1} de {totalQuestions}</h4>
            </div>
            <span className="badge badge-warning">{currentQuestion?.severity}</span>
          </div>

          {currentQuestion?.helpText ? <p className="text-xs text-muted">{currentQuestion.helpText}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button
              className={`rounded-lg border border-border px-4 py-2 text-sm ${currentAnswer?.answer === AnswerValue.OK ? "bg-primary/20 border-primary" : ""}`}
              onClick={() => handleSelectAnswer(AnswerValue.OK)}
            >
              OK
            </button>
            <button
              className={`rounded-lg border border-border px-4 py-2 text-sm ${currentAnswer?.answer === AnswerValue.FAIL ? "bg-red-500/20 border-red-400" : ""}`}
              onClick={() => handleSelectAnswer(AnswerValue.FAIL)}
            >
              FAIL
            </button>
            <button
              className={`rounded-lg border border-border px-4 py-2 text-sm ${currentAnswer?.answer === AnswerValue.NA ? "bg-yellow-500/20 border-yellow-400" : ""}`}
              onClick={() => handleSelectAnswer(AnswerValue.NA)}
            >
              NA
            </button>
          </div>

          <div>
            <label className="text-xs uppercase text-muted">Observacoes</label>
            <textarea
              className="input mt-2 h-24"
              value={currentAnswer?.notes ?? ""}
              onChange={(event) => updateAnswer(currentQuestion.id, { notes: event.target.value })}
              onBlur={() => persistAnswer(currentQuestion.id)}
            />
          </div>

          <EvidenceUploader
            evidences={currentAnswer?.evidences ?? []}
            onUpload={handleUploadEvidence}
            disabled={!currentAnswer?.answer}
            label="Evidencias"
            hint={currentQuestion?.requiresPhotoOnFail ? "Foto obrigatoria para FAIL" : undefined}
          />
        </div>
      ) : null}

      {!loading && template && isSummary ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`badge ${runDetails?.status === "NON_CONFORMING" ? "badge-danger" : runDetails?.status === "ATTENTION" ? "badge-warning" : "badge-success"}`}>
              {runDetails?.status ?? "-"}
            </span>
            <span className="text-sm">Score: {runDetails?.score ?? 0}</span>
            <span className="text-sm text-muted">
              FAILs: {runDetails?.failStats.totalFails ?? 0}
            </span>
          </div>

          <div>
            <label className="text-xs uppercase text-muted">Evidencias gerais</label>
            <EvidenceUploader
              evidences={runEvidences}
              onUpload={handleUploadRunEvidence}
              label=""
              hint="Fotos ou documentos gerais da inspecao"
            />
          </div>

          <div className="rounded-lg border border-border p-4">
            <h4 className="text-sm font-semibold">Gerar NCs</h4>
            <p className="mt-2 text-xs text-muted">
              Por padrao gera somente HIGH/CRITICAL. Marque para incluir MED.
            </p>
            <label className="mt-3 flex items-center gap-2 text-xs text-muted">
              <input type="checkbox" checked={includeMed} onChange={(event) => setIncludeMed(event.target.checked)} />
              Incluir MED
            </label>
            <button
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black"
              onClick={handleGenerateNcs}
            >
              Gerar NCs agora
            </button>
          </div>
        </div>
      ) : null}
    </ModalForm>
  );
}
