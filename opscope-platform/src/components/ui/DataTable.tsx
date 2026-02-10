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
}

export function DataTable<T>({ columns, rows, loading, emptyMessage }: DataTableProps<T>) {
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
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="hover:bg-border/40">
              {columns.map((column) => (
                <td key={String(column.key)}>
                  {column.render ? column.render(row) : String((row as any)[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
