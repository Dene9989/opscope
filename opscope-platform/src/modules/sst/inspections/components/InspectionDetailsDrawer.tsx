"use client";

import { useEffect, useState } from "react";
import type { Evidence, InspectionRunDetails, InspectionStatus } from "../data/sstInspectionsProvider";

interface InspectionDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  details: InspectionRunDetails | null;
  projectMap: Record<string, string>;
  worksiteMap: Record<string, string>;
  onGenerateNcs?: () => void;
  allowGenerateNcs?: boolean;
}

function statusBadge(status: InspectionStatus) {
  if (status === "NON_CONFORMING") return "badge badge-danger";
  if (status === "ATTENTION") return "badge badge-warning";
  return "badge badge-success";
}

function EvidenceGrid({ evidences }: { evidences: Evidence[] }) {
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const next: Record<string, string> = {};
    evidences.forEach((evidence) => {
      next[evidence.id] = URL.createObjectURL(evidence.blob);
    });
    setUrls(next);
    return () => {
      Object.values(next).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [evidences]);

  if (!evidences.length) return <p className="text-xs text-muted">Sem evidencias.</p>;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {evidences.map((evidence) => (
        <div key={evidence.id} className="rounded-lg border border-border p-3">
          {evidence.fileType.startsWith("image/") ? (
            <img className="h-32 w-full rounded-md object-cover" src={urls[evidence.id]} alt={evidence.fileName} />
          ) : (
            <div className="flex h-32 items-center justify-center rounded-md bg-surface text-xs text-muted">
              {evidence.fileType}
            </div>
          )}
          <div className="mt-2 text-xs">
            <div className="font-semibold text-white">{evidence.fileName}</div>
            <div className="text-muted">{new Date(evidence.createdAt).toLocaleString("pt-BR")}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function InspectionDetailsDrawer({
  open,
  onClose,
  details,
  projectMap,
  worksiteMap,
  onGenerateNcs,
  allowGenerateNcs
}: InspectionDetailsDrawerProps) {
  if (!open || !details) return null;

  const orderedQuestions = details.template.questions.slice().sort((a, b) => a.order - b.order);
  const answersByQuestion = new Map(details.answers.map((answer) => [answer.questionId, answer]));

  return (
    <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose}>
      <div
        className="absolute right-0 top-0 h-full w-full max-w-3xl overflow-y-auto border-l border-border bg-card p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{details.template.name}</h3>
            <p className="text-xs text-muted">
              {projectMap[details.projectId] ?? details.projectId} · {worksiteMap[details.worksiteId ?? ""] ?? "-"}
            </p>
          </div>
          <button className="text-xs text-muted" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className={statusBadge(details.status)}>{details.status}</span>
          <span className="text-sm">Score: {details.score}</span>
          <span className="text-sm text-muted">
            Iniciado em {new Date(details.startedAt).toLocaleString("pt-BR")}
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {orderedQuestions.map((question) => {
            const answer = answersByQuestion.get(question.id);
            const answerStatus = answer?.answer ?? "-";
            const evidences = answer ? details.evidencesByAnswerId[answer.id] || [] : [];
            return (
              <div key={question.id} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{question.text}</p>
                    {question.helpText ? <p className="text-xs text-muted">{question.helpText}</p> : null}
                  </div>
                  <span
                    className={
                      answerStatus === "FAIL"
                        ? "badge badge-danger"
                        : answerStatus === "NA"
                        ? "badge badge-warning"
                        : "badge badge-success"
                    }
                  >
                    {answerStatus}
                  </span>
                </div>
                {answer?.notes ? <p className="mt-2 text-xs text-muted">{answer.notes}</p> : null}
                <div className="mt-3">
                  <EvidenceGrid evidences={evidences} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold">Evidencias gerais</h4>
          <div className="mt-3">
            <EvidenceGrid evidences={details.runEvidences} />
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold">Nao conformidades</h4>
          {details.ncs && details.ncs.length ? (
            <div className="mt-3 space-y-3">
              {details.ncs.map((nc) => (
                <div key={nc.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm">{nc.title}</div>
                    <span className="badge badge-warning">{nc.severity}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted">{nc.description}</p>
                  <p className="mt-1 text-xs text-muted">Prazo: {nc.dueDate ? new Date(nc.dueDate).toLocaleDateString("pt-BR") : "-"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs text-muted">Nenhuma NC gerada.</p>
          )}

          {allowGenerateNcs && onGenerateNcs ? (
            <button
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black"
              onClick={onGenerateNcs}
            >
              Gerar NCs
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
