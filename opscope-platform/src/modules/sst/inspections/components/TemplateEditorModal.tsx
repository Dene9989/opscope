"use client";

import { useEffect, useState } from "react";
import { ModalForm } from "@/components/ui/ModalForm";
import { useToast } from "@/components/ui/Toast";
import {
  ChecklistType,
  Severity,
  TemplateQuestionInput,
  UpsertTemplateInput,
  ChecklistTemplate
} from "../data/sstInspectionsProvider";

interface ProjectOption {
  id: string;
  name: string;
}

interface TemplateEditorModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: UpsertTemplateInput) => Promise<void> | void;
  initial?: ChecklistTemplate | null;
  projects?: ProjectOption[];
}

const emptyQuestion = (): TemplateQuestionInput => ({
  text: "",
  helpText: "",
  severity: Severity.MED,
  requiresPhotoOnFail: false,
  autoCreateNc: true
});

function formatEnum(value: string) {
  return value.replace(/_/g, " ");
}

export function TemplateEditorModal({ open, onClose, onSave, initial, projects }: TemplateEditorModalProps) {
  const { push } = useToast();
  const [form, setForm] = useState<UpsertTemplateInput>({
    name: "",
    type: ChecklistType.WORK_AT_HEIGHT,
    periodicityDays: 1,
    isActive: true,
    projectId: "",
    questions: [emptyQuestion()]
  });

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        id: initial.id,
        name: initial.name,
        type: initial.type,
        periodicityDays: initial.periodicityDays ?? null,
        isActive: initial.isActive,
        projectId: initial.projectId ?? "",
        questions: initial.questions
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((question) => ({
            id: question.id,
            order: question.order,
            text: question.text,
            helpText: question.helpText ?? "",
            severity: question.severity,
            requiresPhotoOnFail: question.requiresPhotoOnFail,
            autoCreateNc: question.autoCreateNc
          }))
      });
      return;
    }
    setForm({
      name: "",
      type: ChecklistType.WORK_AT_HEIGHT,
      periodicityDays: 1,
      isActive: true,
      projectId: "",
      questions: [emptyQuestion()]
    });
  }, [open, initial]);

  const updateQuestion = (index: number, patch: Partial<TemplateQuestionInput>) => {
    setForm((current) => {
      const questions = [...current.questions];
      questions[index] = { ...questions[index], ...patch };
      return { ...current, questions };
    });
  };

  const moveQuestion = (index: number, direction: -1 | 1) => {
    setForm((current) => {
      const questions = [...current.questions];
      const target = index + direction;
      if (target < 0 || target >= questions.length) return current;
      const tmp = questions[index];
      questions[index] = questions[target];
      questions[target] = tmp;
      return { ...current, questions };
    });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      push("Informe o nome do template", "error");
      return;
    }
    if (!form.questions.length || form.questions.some((q) => !q.text.trim())) {
      push("Preencha todas as perguntas", "error");
      return;
    }
    await onSave({
      ...form,
      projectId: form.projectId || null,
      periodicityDays: form.periodicityDays === null ? null : Number(form.periodicityDays)
    });
  };

  return (
    <ModalForm
      open={open}
      title={initial ? "Editar template" : "Novo template"}
      onClose={onClose}
      footer={
        <>
          <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={onClose}>
            Cancelar
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={handleSave}>
            Salvar
          </button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-xs uppercase text-muted">Nome</label>
          <input
            className="input mt-2"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </div>
        <div>
          <label className="text-xs uppercase text-muted">Tipo</label>
          <select
            className="select mt-2"
            value={form.type}
            onChange={(event) => setForm({ ...form, type: event.target.value as ChecklistType })}
          >
            {Object.values(ChecklistType).map((type) => (
              <option key={type} value={type}>
                {formatEnum(type)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase text-muted">Periodicidade (dias)</label>
          <input
            className="input mt-2"
            type="number"
            value={form.periodicityDays ?? ""}
            onChange={(event) =>
              setForm({
                ...form,
                periodicityDays: event.target.value ? Number(event.target.value) : null
              })
            }
          />
        </div>
        <div>
          <label className="text-xs uppercase text-muted">Projeto (opcional)</label>
          <select
            className="select mt-2"
            value={form.projectId ?? ""}
            onChange={(event) => setForm({ ...form, projectId: event.target.value })}
          >
            <option value="">Global</option>
            {(projects || []).map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive ?? true}
            onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
          />
          <span className="text-sm text-muted">Template ativo</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Perguntas</h4>
          <button
            className="rounded-lg border border-border px-3 py-2 text-xs"
            onClick={() => setForm({ ...form, questions: [...form.questions, emptyQuestion()] })}
          >
            Adicionar pergunta
          </button>
        </div>
        {form.questions.map((question, index) => (
          <div key={`${question.id ?? index}`} className="rounded-lg border border-border p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-xs uppercase text-muted">Pergunta</label>
                <input
                  className="input mt-2"
                  value={question.text}
                  onChange={(event) => updateQuestion(index, { text: event.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs uppercase text-muted">Help text</label>
                <input
                  className="input mt-2"
                  value={question.helpText ?? ""}
                  onChange={(event) => updateQuestion(index, { helpText: event.target.value })}
                />
              </div>
              <div>
                <label className="text-xs uppercase text-muted">Severidade</label>
                <select
                  className="select mt-2"
                  value={question.severity}
                  onChange={(event) => updateQuestion(index, { severity: event.target.value as Severity })}
                >
                  {Object.values(Severity).map((severity) => (
                    <option key={severity} value={severity}>
                      {formatEnum(severity)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={question.requiresPhotoOnFail}
                    onChange={(event) => updateQuestion(index, { requiresPhotoOnFail: event.target.checked })}
                  />
                  Foto obrigatoria se FAIL
                </label>
                <label className="flex items-center gap-2 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={question.autoCreateNc}
                    onChange={(event) => updateQuestion(index, { autoCreateNc: event.target.checked })}
                  />
                  Gerar NC automatica
                </label>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="rounded-lg border border-border px-3 py-2 text-xs"
                onClick={() => moveQuestion(index, -1)}
              >
                Subir
              </button>
              <button
                className="rounded-lg border border-border px-3 py-2 text-xs"
                onClick={() => moveQuestion(index, 1)}
              >
                Descer
              </button>
              <button
                className="rounded-lg border border-border px-3 py-2 text-xs text-red-300"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    questions: current.questions.filter((_, idx) => idx !== index)
                  }))
                }
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </ModalForm>
  );
}
