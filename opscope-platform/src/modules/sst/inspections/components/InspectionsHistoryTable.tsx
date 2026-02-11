"use client";

import { DataTable } from "@/components/ui/DataTable";
import type { InspectionRunSummary, InspectionStatus } from "../data/sstInspectionsProvider";

interface InspectionsHistoryTableProps {
  runs: InspectionRunSummary[];
  loading?: boolean;
  onDetails: (run: InspectionRunSummary) => void;
  projectMap: Record<string, string>;
  worksiteMap: Record<string, string>;
}

function statusBadge(status: InspectionStatus) {
  if (status === "NON_CONFORMING") return "badge badge-danger";
  if (status === "ATTENTION") return "badge badge-warning";
  return "badge badge-success";
}

export function InspectionsHistoryTable({ runs, loading, onDetails, projectMap, worksiteMap }: InspectionsHistoryTableProps) {
  return (
    <DataTable
      loading={loading}
      rows={runs}
      emptyMessage="Sem inspecoes"
      columns={[
        {
          key: "startedAt",
          label: "Data",
          render: (row) => new Date(row.startedAt).toLocaleDateString("pt-BR")
        },
        { key: "templateName", label: "Template" },
        { key: "projectId", label: "Projeto", render: (row) => projectMap[row.projectId] ?? row.projectId },
        { key: "worksiteId", label: "Local", render: (row) => (row.worksiteId ? worksiteMap[row.worksiteId] ?? row.worksiteId : "-") },
        { key: "score", label: "Score" },
        {
          key: "status",
          label: "Status",
          render: (row) => <span className={statusBadge(row.status)}>{row.status}</span>
        },
        { key: "failCount", label: "FAILs" },
        { key: "criticalFailCount", label: "Criticos" }
      ]}
      actions={(row) => (
        <button className="text-xs text-primary" onClick={() => onDetails(row)}>
          Detalhes
        </button>
      )}
    />
  );
}
