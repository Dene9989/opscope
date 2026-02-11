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

const attachmentSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  type: z.string().optional().nullable()
});

export const entrySchema = z.object({
  type: z.literal("ENTRADA"),
  itemId: z.string().uuid(),
  qty: z.number().int().positive(),
  projectId: z.string().uuid(),
  worksiteId: z.string().uuid().optional().nullable(),
  batchId: z.string().uuid().optional().nullable(),
  batchCode: z.string().min(2).optional().nullable(),
  itemValidUntil: z.string().optional().nullable(),
  caValidUntil: z.string().optional().nullable(),
  unitCost: z.number().nonnegative().optional().nullable(),
  invoiceNumber: z.string().optional().nullable(),
  reason: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  attachments: z.array(attachmentSchema).optional().nullable()
});

export const deliverySchema = z.object({
  type: z.literal("ENTREGA"),
  itemId: z.string().uuid(),
  qty: z.number().int().positive(),
  projectId: z.string().uuid(),
  worksiteId: z.string().uuid().optional().nullable(),
  batchId: z.string().uuid().optional().nullable(),
  collaboratorId: z.string().uuid(),
  reservationId: z.string().uuid().optional().nullable(),
  reason: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  term: z
    .object({
      accepted: z.boolean().optional(),
      name: z.string().min(2).optional(),
      cpf: z.string().min(11).optional()
    })
    .optional()
    .nullable(),
  attachments: z.array(attachmentSchema).optional().nullable()
});

export const returnSchema = z.object({
  type: z.literal("DEVOLUCAO"),
  itemId: z.string().uuid(),
  qty: z.number().int().positive(),
  projectId: z.string().uuid(),
  worksiteId: z.string().uuid().optional().nullable(),
  relatedMovementId: z.string().uuid(),
  reason: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  attachments: z.array(attachmentSchema).optional().nullable()
});

export const transferSchema = z.object({
  type: z.literal("TRANSFERENCIA"),
  itemId: z.string().uuid(),
  qty: z.number().int().positive(),
  projectOriginId: z.string().uuid(),
  worksiteOriginId: z.string().uuid().optional().nullable(),
  projectDestinationId: z.string().uuid(),
  worksiteDestinationId: z.string().uuid().optional().nullable(),
  batchId: z.string().uuid().optional().nullable(),
  reason: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  attachments: z.array(attachmentSchema).optional().nullable()
});

export const adjustmentSchema = z.object({
  type: z.literal("AJUSTE"),
  itemId: z.string().uuid(),
  qty: z.number().int().positive(),
  direction: z.enum(["IN", "OUT"]),
  projectId: z.string().uuid(),
  worksiteId: z.string().uuid().optional().nullable(),
  batchId: z.string().uuid().optional().nullable(),
  reason: z.string().min(3),
  notes: z.string().optional().nullable(),
  attachments: z.array(attachmentSchema).optional().nullable()
});

export const writeOffSchema = z.object({
  type: z.literal("BAIXA"),
  itemId: z.string().uuid(),
  qty: z.number().int().positive(),
  projectId: z.string().uuid(),
  worksiteId: z.string().uuid().optional().nullable(),
  batchId: z.string().uuid().optional().nullable(),
  reason: z.string().min(3),
  notes: z.string().optional().nullable(),
  attachments: z.array(attachmentSchema).optional().nullable()
});

export const movementSchema = z.discriminatedUnion("type", [
  entrySchema,
  deliverySchema,
  returnSchema,
  transferSchema,
  adjustmentSchema,
  writeOffSchema
]);

export const reservationSchema = z.object({
  projectId: z.string().uuid(),
  worksiteId: z.string().uuid().optional().nullable(),
  itemId: z.string().uuid(),
  batchId: z.string().uuid().optional().nullable(),
  qty: z.number().int().positive(),
  status: z.enum(["RESERVADO", "SEPARADO", "CANCELADO", "CONSUMIDO"]).optional(),
  referenceType: z.enum(["ATIVIDADE_EXECUCAO", "OS", "MANUAL"]).optional().nullable(),
  referenceId: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
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

export const roleSchema = z.enum([
  "ADMIN",
  "GESTOR",
  "ALMOXARIFE",
  "TECNICO_SST",
  "SUPERVISOR",
  "COLABORADOR"
]);

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: roleSchema,
  password: z.string().min(6)
});

export const trainingSchema = z.object({
  name: z.string().min(2),
  nr: z.string().optional().nullable(),
  hours: z.number().min(1),
  validityDays: z.number().min(1),
  projectId: z.string().uuid().optional().nullable()
});

export const trainingRequirementSchema = z.object({
  trainingId: z.string().uuid(),
  role: roleSchema,
  projectId: z.string().uuid().optional().nullable(),
  mandatory: z.boolean().optional().default(true)
});

export const trainingRecordSchema = z.object({
  trainingId: z.string().uuid(),
  userId: z.string().uuid(),
  date: z.string(),
  validUntil: z.string(),
  status: z.enum(["VALIDO", "VENCIDO", "PENDENTE"]).default("VALIDO"),
  certificateUrl: z.string().url().optional().nullable(),
  projectId: z.string().uuid().optional().nullable()
});

export const checklistQuestionSchema = z.object({
  text: z.string().min(2),
  type: z.enum(["BOOLEAN", "TEXT", "SCORE", "SELECT"]),
  required: z.boolean().optional().default(true),
  options: z.array(z.string()).optional().nullable(),
  weight: z.number().int().optional().nullable(),
  requiresPhotoOnFail: z.boolean().optional().default(false)
});

export const checklistTemplateSchema = z.object({
  type: z.string().min(2),
  title: z.string().min(2),
  periodicityDays: z.number().min(1),
  projectId: z.string().uuid().optional().nullable(),
  worksiteId: z.string().uuid().optional().nullable(),
  active: z.boolean().optional().default(true),
  questions: z.array(checklistQuestionSchema).min(1)
});

export const inspectionRunSchema = z.object({
  templateId: z.string().uuid(),
  projectId: z.string().uuid(),
  worksiteId: z.string().uuid().optional().nullable(),
  performedAt: z.string(),
  status: z.enum(["OK", "NAO_CONFORME"]),
  answers: z.array(
    z.object({
      questionId: z.string().uuid(),
      answer: z.union([z.string(), z.number(), z.boolean()]).optional().nullable(),
      ok: z.boolean().optional().nullable(),
      score: z.number().optional().nullable(),
      notes: z.string().optional().nullable(),
      photoUrls: z.array(z.string().url()).optional().nullable()
    })
  ),
  evidenceUrls: z.array(z.string().url()).optional().nullable(),
  geo: z
    .object({
      lat: z.number(),
      lng: z.number()
    })
    .optional()
    .nullable()
});

export const nonConformitySchema = z.object({
  originType: z.enum(["INSPECAO", "OBSERVACAO", "INCIDENTE"]),
  inspectionId: z.string().uuid().optional().nullable(),
  incidentId: z.string().uuid().optional().nullable(),
  projectId: z.string().uuid().optional().nullable(),
  worksiteId: z.string().uuid().optional().nullable(),
  severity: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]),
  title: z.string().optional().nullable(),
  description: z.string().min(3),
  evidenceUrls: z.array(z.string().url()).optional().nullable(),
  responsibleId: z.string().uuid(),
  dueDate: z.string(),
  status: z.enum(["ABERTA", "EM_ANDAMENTO", "RESOLVIDA", "CANCELADA"]).default("ABERTA")
});

export const actionPlanItemSchema = z.object({
  nonConformityId: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  responsibleId: z.string().uuid(),
  dueDate: z.string(),
  status: z.enum(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA", "VERIFICADA"]).default("PENDENTE"),
  evidenceUrls: z.array(z.string().url()).optional().nullable(),
  notes: z.string().optional().nullable()
});

export const incidentSchema = z.object({
  projectId: z.string().uuid(),
  worksiteId: z.string().uuid().optional().nullable(),
  date: z.string(),
  severity: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]),
  description: z.string().min(3),
  category: z.string().min(2),
  involvedUserIds: z.array(z.string().uuid()).optional().nullable(),
  photos: z.array(z.string().url()).optional().nullable()
});

export const incidentInvestigationSchema = z.object({
  incidentId: z.string().uuid(),
  fiveWhys: z.array(z.string().min(2)).length(5),
  rootCause: z.string().optional().nullable(),
  immediateActions: z.array(z.string()).optional().nullable(),
  correctiveActions: z.array(z.string()).optional().nullable(),
  preventiveActions: z.array(z.string()).optional().nullable(),
  effectivenessCheck: z.string().optional().nullable(),
  verifiedById: z.string().uuid().optional().nullable()
});

export const aprTemplateSchema = z.object({
  name: z.string().min(2),
  activity: z.string().min(2),
  hazards: z.array(z.string()).min(1),
  risks: z.array(z.string()).min(1),
  controls: z.array(z.string()).min(1),
  requiredTrainings: z.array(z.string().uuid()).optional().nullable(),
  requiredEpis: z.array(z.string().uuid()).optional().nullable()
});

export const aprSchema = z.object({
  projectId: z.string().uuid(),
  worksiteId: z.string().uuid().optional().nullable(),
  templateId: z.string().uuid().optional().nullable(),
  activity: z.string().min(2),
  hazards: z.array(z.string()).min(1),
  risks: z.array(z.string()).min(1),
  controls: z.array(z.string()).min(1),
  approvedById: z.string().uuid().optional().nullable(),
  status: z.enum(["RASCUNHO", "EM_ANALISE", "APROVADA"]).default("RASCUNHO")
});

export const permitSchema = z.object({
  aprId: z.string().uuid(),
  projectId: z.string().uuid().optional().nullable(),
  worksiteId: z.string().uuid().optional().nullable(),
  type: z.enum(["ALTURA", "QUENTE", "ESPACO_CONFINADO", "ELETRICA"]),
  requirements: z.array(z.string()).min(1),
  validFrom: z.string(),
  validTo: z.string(),
  status: z.enum(["ABERTA", "APROVADA", "ENCERRADA"]).default("ABERTA"),
  collaboratorIds: z.array(z.string().uuid()).optional().nullable(),
  approverIds: z.array(z.string().uuid()).optional().nullable()
});

export const permitApprovalSchema = z.object({
  permitId: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.enum(["PENDENTE", "APROVADO", "REPROVADO"]),
  notes: z.string().optional().nullable()
});

export const sstAlertSchema = z.object({
  projectId: z.string().uuid().optional().nullable(),
  type: z.enum([
    "TREINAMENTO_VENCER",
    "TREINAMENTO_VENCIDO",
    "INSPECAO_ATRASADA",
    "NC_VENCENDO",
    "NC_VENCIDA",
    "PT_VENCER",
    "PT_VENCIDA"
  ]),
  severity: z.enum(["INFO", "ATENCAO", "CRITICA"]),
  title: z.string().min(3),
  message: z.string().min(3),
  dueDate: z.string().optional().nullable(),
  entityType: z.string().optional().nullable(),
  entityId: z.string().optional().nullable()
});

export const documentationSchema = z.object({
  activityId: z.string().uuid().optional().nullable(),
  activityName: z.string().min(2),
  projectId: z.string().uuid(),
  worksiteId: z.string().uuid().optional().nullable(),
  responsibleId: z.string().uuid(),
  aprReference: z.string().optional().nullable(),
  aprFileUrl: z.string().url().optional().nullable(),
  attachments: z
    .array(
      z.object({
        name: z.string().min(2),
        url: z.string().url(),
        type: z.string().optional().nullable()
      })
    )
    .optional()
    .nullable()
});

export const documentationReviewSchema = z.object({
  status: z.enum(["APROVADO", "REPROVADO"]),
  reviewNotes: z.string().optional().nullable(),
  correctionInstructions: z.string().optional().nullable()
});
