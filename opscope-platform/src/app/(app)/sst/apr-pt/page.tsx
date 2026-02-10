"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { ModalForm } from "@/components/ui/ModalForm";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";

interface Apr {
  id: string;
  activity: string;
  status: string;
  project: { name: string };
}

interface ProjectOption {
  id: string;
  name: string;
}

export default function AprPtPage() {
  const { token } = useAuth();
  const { push } = useToast();
  const [rows, setRows] = useState<Apr[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [openApr, setOpenApr] = useState(false);
  const [openPermit, setOpenPermit] = useState(false);
  const [formApr, setFormApr] = useState({
    projectId: "",
    activity: "",
    hazards: "queda,ruido",
    risks: "lesao",
    controls: "treinamento,epi"
  });
  const [formPermit, setFormPermit] = useState({
    aprId: "",
    type: "ALTURA",
    requirements: "EPI,APR",
    validFrom: new Date().toISOString().slice(0, 10),
    validTo: new Date().toISOString().slice(0, 10)
  });

  const load = () => {
    setLoading(true);
    Promise.all([
      apiFetch("/api/sst/aprs?pageSize=50", token),
      apiFetch("/api/core/projects?pageSize=50", token)
    ])
      .then(([aprResponse, projectResponse]) => {
        setRows(aprResponse.data.items);
        setProjects(projectResponse.data.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreateApr = async () => {
    try {
      await apiFetch("/api/sst/aprs", token, {
        method: "POST",
        body: JSON.stringify({
          projectId: formApr.projectId,
          activity: formApr.activity,
          hazards: formApr.hazards.split(",").map((item) => item.trim()),
          risks: formApr.risks.split(",").map((item) => item.trim()),
          controls: formApr.controls.split(",").map((item) => item.trim())
        })
      });
      push("APR criada", "success");
      setOpenApr(false);
      setFormApr({ projectId: "", activity: "", hazards: "", risks: "", controls: "" });
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao criar", "error");
    }
  };

  const handleCreatePermit = async () => {
    try {
      await apiFetch("/api/sst/permits", token, {
        method: "POST",
        body: JSON.stringify({
          aprId: formPermit.aprId,
          type: formPermit.type,
          requirements: formPermit.requirements.split(",").map((item) => item.trim()),
          validFrom: new Date(formPermit.validFrom).toISOString(),
          validTo: new Date(formPermit.validTo).toISOString()
        })
      });
      push("PT criada", "success");
      setOpenPermit(false);
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao criar", "error");
    }
  };

  return (
    <div className="space-y-6">
      <Header title="APR / Permissao de Trabalho" subtitle="Analise preliminar de riscos e PT" />
      <div className="flex flex-wrap gap-3">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={() => setOpenApr(true)}>
          Nova APR
        </button>
        <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setOpenPermit(true)}>
          Nova PT
        </button>
      </div>

      <DataTable
        loading={loading}
        rows={rows}
        emptyMessage="Sem APRs"
        columns={[
          { key: "activity", label: "Atividade" },
          { key: "project", label: "Projeto", render: (row) => row.project.name },
          { key: "status", label: "Status" }
        ]}
      />

      <ModalForm
        open={openApr}
        title="Nova APR"
        onClose={() => setOpenApr(false)}
        footer={
          <>
            <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setOpenApr(false)}>
              Cancelar
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={handleCreateApr}>
              Salvar
            </button>
          </>
        }
      >
        <div className="grid gap-4">
          <div>
            <label className="text-xs uppercase text-muted">Projeto</label>
            <select
              className="select mt-2"
              value={formApr.projectId}
              onChange={(e) => setFormApr({ ...formApr, projectId: e.target.value })}
            >
              <option value="">Selecione</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Atividade</label>
            <input
              className="input mt-2"
              value={formApr.activity}
              onChange={(e) => setFormApr({ ...formApr, activity: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Perigos (separe por virgula)</label>
            <input
              className="input mt-2"
              value={formApr.hazards}
              onChange={(e) => setFormApr({ ...formApr, hazards: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Riscos (separe por virgula)</label>
            <input
              className="input mt-2"
              value={formApr.risks}
              onChange={(e) => setFormApr({ ...formApr, risks: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Controles (separe por virgula)</label>
            <input
              className="input mt-2"
              value={formApr.controls}
              onChange={(e) => setFormApr({ ...formApr, controls: e.target.value })}
            />
          </div>
        </div>
      </ModalForm>

      <ModalForm
        open={openPermit}
        title="Nova Permissao de Trabalho"
        onClose={() => setOpenPermit(false)}
        footer={
          <>
            <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setOpenPermit(false)}>
              Cancelar
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={handleCreatePermit}>
              Salvar
            </button>
          </>
        }
      >
        <div className="grid gap-4">
          <div>
            <label className="text-xs uppercase text-muted">APR</label>
            <select
              className="select mt-2"
              value={formPermit.aprId}
              onChange={(e) => setFormPermit({ ...formPermit, aprId: e.target.value })}
            >
              <option value="">Selecione</option>
              {rows.map((apr) => (
                <option key={apr.id} value={apr.id}>
                  {apr.activity}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Tipo</label>
            <select
              className="select mt-2"
              value={formPermit.type}
              onChange={(e) => setFormPermit({ ...formPermit, type: e.target.value })}
            >
              {"ALTURA,QUENTE,ESPACO_CONFINADO,ELETRICA".split(",").map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Requisitos (separe por virgula)</label>
            <input
              className="input mt-2"
              value={formPermit.requirements}
              onChange={(e) => setFormPermit({ ...formPermit, requirements: e.target.value })}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase text-muted">Valido de</label>
              <input
                className="input mt-2"
                type="date"
                value={formPermit.validFrom}
                onChange={(e) => setFormPermit({ ...formPermit, validFrom: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Valido ate</label>
              <input
                className="input mt-2"
                type="date"
                value={formPermit.validTo}
                onChange={(e) => setFormPermit({ ...formPermit, validTo: e.target.value })}
              />
            </div>
          </div>
        </div>
      </ModalForm>
    </div>
  );
}
