"use client";

import { useEffect, useRef, useState } from "react";
import type { Evidence } from "../data/sstInspectionsProvider";

interface EvidenceUploaderProps {
  evidences: Evidence[];
  onUpload: (file: File) => Promise<void> | void;
  disabled?: boolean;
  label?: string;
  hint?: string;
}

export function EvidenceUploader({ evidences, onUpload, disabled, label, hint }: EvidenceUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const urls: Record<string, string> = {};
    evidences.forEach((evidence) => {
      urls[evidence.id] = URL.createObjectURL(evidence.blob);
    });
    setPreviewUrls(urls);
    return () => {
      Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [evidences]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || disabled) return;
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      await onUpload(file);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      {label ? <p className="text-xs uppercase text-muted">{label}</p> : null}
      <div
        className={`flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-6 text-sm text-muted transition ${
          dragging ? "border-primary/60 bg-primary/5" : "border-border"
        } ${disabled ? "opacity-50" : "hover:border-primary/50"}`}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          onChange={(event) => handleFiles(event.target.files)}
        />
        <p>{disabled ? "Selecione uma resposta antes" : "Arraste arquivos ou clique para enviar"}</p>
        {hint ? <p className="mt-2 text-xs text-muted">{hint}</p> : null}
        <button
          type="button"
          className="mt-3 rounded-lg border border-border px-3 py-2 text-xs"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          Selecionar arquivos
        </button>
      </div>

      {evidences.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {evidences.map((evidence) => (
            <div key={evidence.id} className="rounded-lg border border-border p-3">
              {evidence.fileType.startsWith("image/") ? (
                <img
                  className="h-32 w-full rounded-md object-cover"
                  src={previewUrls[evidence.id]}
                  alt={evidence.fileName}
                />
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
      ) : null}
    </div>
  );
}
