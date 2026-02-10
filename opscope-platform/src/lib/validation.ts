import { z } from "zod";

export const itemSchema = z.object({
  type: z.enum(["FERRAMENTA", "EPI", "EPC", "CONSUMIVEL"]),
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  unit: z.enum(["UN", "PAR", "CX"]),
  internalCode: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  status: z.enum(["ATIVO", "INATIVO"]).default("ATIVO"),
  caNumber: z.string().optional().nullable(),
  caValidUntil: z.string().optional().nullable(),
  itemValidUntil: z.string().optional().nullable(),
  sizes: z.array(z.string()).optional().nullable()
});

export const movementSchema = z.object({
  type: z.enum([
    "ENTRADA",
    "SAIDA",
    "TRANSFERENCIA",
    "AJUSTE",
    "DEVOLUCAO",
    "PERDA_BAIXA",
    "RESERVA",
    "LIBERACAO_RESERVA"
  ]),
  itemId: z.string().uuid(),
  quantity: z.number().positive(),
  projectId: z.string().uuid(),
  worksiteId: z.string().uuid().optional().nullable(),
  sourceProjectId: z.string().uuid().optional().nullable(),
  sourceWorksiteId: z.string().uuid().optional().nullable(),
  destinationProjectId: z.string().uuid().optional().nullable(),
  destinationWorksiteId: z.string().uuid().optional().nullable(),
  collaboratorId: z.string().uuid().optional().nullable(),
  activityId: z.string().uuid().optional().nullable(),
  reason: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  invoiceNumber: z.string().optional().nullable(),
  batchCode: z.string().optional().nullable(),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        type: z.string().optional().nullable()
      })
    )
    .optional()
    .nullable()
});

export const kitSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  roleName: z.string().optional().nullable(),
  items: z
    .array(
      z.object({
        itemId: z.string().uuid(),
        quantity: z.number().min(1),
        required: z.boolean().default(true)
      })
    )
    .min(1)
});

export const projectSchema = z.object({
  name: z.string().min(2),
  code: z.string().optional().nullable(),
  description: z.string().optional().nullable()
});

export const worksiteSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(2),
  address: z.string().optional().nullable()
});

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["ADMIN", "GESTOR", "ALMOXARIFE", "TECNICO_SST", "SUPERVISOR", "COLABORADOR"]),
  password: z.string().min(6)
});

export const trainingSchema = z.object({
  name: z.string().min(2),
  nr: z.string().optional().nullable(),
  hours: z.number().min(1),
  validityDays: z.number().min(1),
  mandatoryRoles: z.array(z.string()).optional().nullable(),
  projectId: z.string().uuid().optional().nullable()
});

export const trainingRecordSchema = z.object({
  trainingId: z.string().uuid(),
  userId: z.string().uuid(),
  date: z.string(),
  validUntil: z.string(),
  status: z.enum(["VALIDO", "VENCIDO", "PENDENTE"]).default("VALIDO"),
  certificateUrl: z.string().url().optional().nullable()
});

export const inspectionTemplateSchema = z.object({
  type: z.string().min(2),
  title: z.string().min(2),
  periodicityDays: z.number().min(1),
  projectId: z.string().uuid().optional().nullable(),
  worksiteId: z.string().uuid().optional().nullable(),
  questions: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      required: z.boolean().default(false)
    })
  )
});

export const inspectionExecutionSchema = z.object({
  templateId: z.string().uuid(),
  projectId: z.string().uuid(),
  worksiteId: z.string().uuid().optional().nullable(),
  performedAt: z.string(),
  status: z.enum(["OK", "NAO_CONFORME"]),
  answers: z.array(z.object({ id: z.string(), answer: z.string() })),
  photos: z.array(z.string().url()).optional().nullable(),
  geo: z.object({ lat: z.number(), lng: z.number() }).optional().nullable()
});

export const nonConformitySchema = z.object({
  originType: z.enum(["INSPECAO", "OBSERVACAO", "INCIDENTE"]),
  inspectionId: z.string().uuid().optional().nullable(),
  incidentId: z.string().uuid().optional().nullable(),
  severity: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]),
  description: z.string().min(3),
  evidenceUrls: z.array(z.string().url()).optional().nullable(),
  responsibleId: z.string().uuid(),
  dueDate: z.string(),
  status: z.enum(["ABERTA", "EM_ANDAMENTO", "RESOLVIDA", "CANCELADA"]).default("ABERTA")
});

export const incidentSchema = z.object({
  projectId: z.string().uuid(),
  worksiteId: z.string().uuid().optional().nullable(),
  date: z.string(),
  severity: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]),
  description: z.string().min(3),
  category: z.string().min(2),
  involvedUserIds: z.array(z.string().uuid()).optional().nullable(),
  photos: z.array(z.string().url()).optional().nullable(),
  fiveWhys: z.array(z.string()).optional().nullable()
});

export const aprSchema = z.object({
  projectId: z.string().uuid(),
  worksiteId: z.string().uuid().optional().nullable(),
  activity: z.string().min(2),
  hazards: z.array(z.string()).min(1),
  risks: z.array(z.string()).min(1),
  controls: z.array(z.string()).min(1),
  approvedById: z.string().uuid().optional().nullable(),
  status: z.enum(["RASCUNHO", "EM_ANALISE", "APROVADA"]).default("RASCUNHO")
});

export const permitSchema = z.object({
  aprId: z.string().uuid(),
  type: z.enum(["ALTURA", "QUENTE", "ESPACO_CONFINADO", "ELETRICA"]),
  requirements: z.array(z.string()).min(1),
  approvedById: z.string().uuid().optional().nullable(),
  validFrom: z.string(),
  validTo: z.string(),
  status: z.enum(["ABERTA", "APROVADA", "ENCERRADA"]).default("ABERTA")
});
