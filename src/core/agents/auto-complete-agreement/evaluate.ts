type AgreementState =
  | "DRAFT"
  | "NEGOTIATING"
  | "ACTIVE"
  | "EXECUTING"
  | "PARTIALLY_COMPLETED"
  | "COMPLETED"
  | "CANCELLED";

type Params = {
  agreement: {
    state: AgreementState;
  };
  milestones: {
    state: string;
  }[];
  deliverables: {
    state: string;
  }[];
};

export function shouldAutoCompleteAgreement({
  agreement,
  milestones,
}: {
  agreement: any;
  milestones: Record<string, any>;
  deliverables: Record<string, any>;
}) {
  // Agreement must be ACTIVE
  if (
    agreement.state !== "ACTIVE" &&
    agreement.state !== "EXECUTING" &&
    agreement.state !== "PARTIALLY_COMPLETED"
  ) return false;


  // MUST have at least one milestone
  const milestoneList = Object.values(milestones);
  if (milestoneList.length === 0) return false;

  // ✅ ONLY milestone completion matters
  return milestoneList.every(
    (m) => m.status === "COMPLETED"
  );
}

