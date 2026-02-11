import {
  AnswerValue,
  ChecklistQuestion,
  ChecklistTemplate,
  InspectionAnswer,
  InspectionRun,
  InspectionStatus,
  NonConformity,
  Severity,
  FailStats
} from "../data/sstInspectionsProvider";

const severityPenalty: Record<Severity, number> = {
  [Severity.LOW]: 2,
  [Severity.MED]: 5,
  [Severity.HIGH]: 12,
  [Severity.CRITICAL]: 25
};

export function calculateScore(answers: InspectionAnswer[]): number {
  let score = 100;
  for (const answer of answers) {
    if (answer.answer !== AnswerValue.FAIL) continue;
    score -= severityPenalty[answer.severitySnapshot] ?? 0;
  }
  if (score < 0) score = 0;
  if (score > 100) score = 100;
  return score;
}

export function calculateStatus(answers: InspectionAnswer[]): InspectionStatus {
  const criticalFails = answers.filter(
    (answer) => answer.answer === AnswerValue.FAIL && answer.severitySnapshot === Severity.CRITICAL
  );
  if (criticalFails.length > 0) return InspectionStatus.NON_CONFORMING;

  const highFails = answers.filter(
    (answer) => answer.answer === AnswerValue.FAIL && answer.severitySnapshot === Severity.HIGH
  );
  if (highFails.length >= 2) return InspectionStatus.NON_CONFORMING;

  const medOrHigh = answers.filter(
    (answer) =>
      answer.answer === AnswerValue.FAIL &&
      (answer.severitySnapshot === Severity.MED || answer.severitySnapshot === Severity.HIGH)
  );
  if (medOrHigh.length > 0) return InspectionStatus.ATTENTION;

  return InspectionStatus.OK;
}

export function buildFailStats(answers: InspectionAnswer[]): FailStats {
  const stats: FailStats = {
    totalFails: 0,
    bySeverity: {
      [Severity.LOW]: 0,
      [Severity.MED]: 0,
      [Severity.HIGH]: 0,
      [Severity.CRITICAL]: 0
    }
  };

  for (const answer of answers) {
    if (answer.answer !== AnswerValue.FAIL) continue;
    stats.totalFails += 1;
    stats.bySeverity[answer.severitySnapshot] = (stats.bySeverity[answer.severitySnapshot] || 0) + 1;
  }

  return stats;
}

export function requiresPhotoOnFail(
  question: ChecklistQuestion,
  answer: AnswerValue | undefined,
  evidences: { fileType: string }[]
) {
  if (!question.requiresPhotoOnFail) return false;
  if (answer !== AnswerValue.FAIL) return false;
  return !evidences.some((evidence) => evidence.fileType.startsWith("image/"));
}

export function getDueDateForSeverity(severity: Severity, baseDate: Date = new Date()): string {
  const due = new Date(baseDate);
  if (severity === Severity.CRITICAL) due.setDate(due.getDate() + 3);
  if (severity === Severity.HIGH) due.setDate(due.getDate() + 7);
  if (severity === Severity.MED) due.setDate(due.getDate() + 14);
  return due.toISOString();
}

export function buildNonConformitiesForRun(params: {
  run: InspectionRun;
  template: ChecklistTemplate;
  answers: InspectionAnswer[];
  includeSeverities?: Severity[];
  mode?: "PER_ANSWER" | "GROUPED";
}): NonConformity[] {
  const includeSeverities = params.includeSeverities?.length
    ? params.includeSeverities
    : [Severity.HIGH, Severity.CRITICAL];

  const questionMap = new Map(params.template.questions.map((question) => [question.id, question]));

  const filteredAnswers = params.answers.filter(
    (answer) =>
      answer.answer === AnswerValue.FAIL &&
      includeSeverities.includes(answer.severitySnapshot) &&
      (questionMap.get(answer.questionId)?.autoCreateNc ?? true)
  );

  if (!filteredAnswers.length) return [];

  if (params.mode === "GROUPED") {
    const descriptions = filteredAnswers
      .map((answer) => {
        const question = questionMap.get(answer.questionId);
        return `- ${question?.text ?? "Pergunta"}${answer.notes ? ` (${answer.notes})` : ""}`;
      })
      .join("\n");

    const highestSeverity = filteredAnswers.reduce((current, answer) => {
      const order = [Severity.LOW, Severity.MED, Severity.HIGH, Severity.CRITICAL];
      return order.indexOf(answer.severitySnapshot) > order.indexOf(current) ? answer.severitySnapshot : current;
    }, Severity.LOW);

    return [
      {
        id: "",
        projectId: params.run.projectId,
        worksiteId: params.run.worksiteId ?? null,
        sourceType: "INSPECTION",
        sourceId: params.run.id,
        severity: highestSeverity,
        title: `${params.template.name} - Itens nao conformes`,
        description: descriptions,
        status: "OPEN",
        dueDate: getDueDateForSeverity(highestSeverity),
        createdBy: params.run.inspectorId,
        createdAt: new Date().toISOString()
      }
    ];
  }

  return filteredAnswers.map((answer) => {
    const question = questionMap.get(answer.questionId);
    return {
      id: "",
      projectId: params.run.projectId,
      worksiteId: params.run.worksiteId ?? null,
      sourceType: "INSPECTION",
      sourceId: params.run.id,
      severity: answer.severitySnapshot,
      title: `${params.template.name} - ${question?.text ?? "Item"}`,
      description: `${answer.notes ?? ""}${answer.notes ? " " : ""}(gerado por inspecao)`
        .trim(),
      status: "OPEN",
      dueDate: getDueDateForSeverity(answer.severitySnapshot),
      createdBy: params.run.inspectorId,
      createdAt: new Date().toISOString()
    };
  });
}
