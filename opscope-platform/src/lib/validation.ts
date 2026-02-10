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
