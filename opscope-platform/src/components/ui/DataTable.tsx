"use client";

import React from "react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyMessage?: string;
  rowKey?: (row: T) => string;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  loading,
  emptyMessage,
  rowKey,
  onRowClick,
  actions
}: DataTableProps<T>) {
  if (loading) {
    return <div className="card p-6 text-sm text-muted">Carregando...</div>;
  }

  if (!rows.length) {
    return <div className="card p-6 text-sm text-muted">{emptyMessage || "Sem registros."}</div>;
  }

  return (
    <div className="card overflow-hidden">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)}>{column.label}</th>
            ))}
            {actions ? <th>Acoes</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const key = rowKey ? rowKey(row) : String(index);
            return (
              <tr
                key={key}
                className={onRowClick ? "hover:bg-border/40 cursor-pointer" : "hover:bg-border/40"}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={String(column.key)}>
                    {column.render ? column.render(row) : String((row as any)[column.key])}
                  </td>
                ))}
                {actions ? (
                  <td
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    {actions(row)}
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
