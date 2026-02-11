"use client";

import { DataTable } from "@/components/ui/DataTable";
import type { ChecklistTemplate } from "../data/sstInspectionsProvider";

interface TemplatesTableProps {
  templates: ChecklistTemplate[];
  loading?: boolean;
  onEdit: (template: ChecklistTemplate) => void;
  onDuplicate: (template: ChecklistTemplate) => void;
  onToggleActive: (template: ChecklistTemplate) => void;
  onExecute?: (template: ChecklistTemplate) => void;
}

function formatType(value: string) {
  return value.replace(/_/g, " ");
}

export function TemplatesTable({ templates, loading, onEdit, onDuplicate, onToggleActive, onExecute }: TemplatesTableProps) {
  return (
    <DataTable
      loading={loading}
      rows={templates}
      emptyMessage="Sem templates"
      columns={[
        { key: "name", label: "Template" },
        { key: "type", label: "Tipo", render: (row) => formatType(row.type) },
        { key: "periodicityDays", label: "Periodicidade", render: (row) => (row.periodicityDays ? `${row.periodicityDays}d` : "Por operacao") },
        { key: "questions", label: "Perguntas", render: (row) => row.questions.length },
        {
          key: "isActive",
          label: "Status",
          render: (row) => (
            <span className={row.isActive ? "badge badge-success" : "badge badge-warning"}>
              {row.isActive ? "Ativo" : "Inativo"}
            </span>
          )
        }
      ]}
      actions={(row) => (
        <div className="flex flex-wrap gap-2">
          {onExecute ? (
            <button className="text-xs text-primary" onClick={() => onExecute(row)}>
              Executar
            </button>
          ) : null}
          <button className="text-xs text-primary" onClick={() => onEdit(row)}>
            Editar
          </button>
          <button className="text-xs text-primary" onClick={() => onDuplicate(row)}>
            Duplicar
          </button>
          <button className="text-xs text-primary" onClick={() => onToggleActive(row)}>
            {row.isActive ? "Desativar" : "Ativar"}
          </button>
        </div>
      )}
    />
  );
}
