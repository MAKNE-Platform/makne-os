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
    deliverables,
}: Params): boolean {
    // Agreement must be executing or active
    if (
        agreement.state !== "EXECUTING" &&
        agreement.state !== "ACTIVE"
    ) {
        return false;
    }

    // All milestones must be completed
    const allMilestonesCompleted = milestones.every(
        (m) => m.state === "RELEASED"
    );

    console.log("EVALUATE AUTO COMPLETE");
    console.log("agreement.state =", agreement.state);
    console.log(
        "milestone states =",
        milestones.map(m => m.state)
    );
    console.log(
        "deliverable states =",
        deliverables.map(d => d.state)
    );


    if (!allMilestonesCompleted) return false;

    // All deliverables must be resolved
    const allDeliverablesResolved = deliverables.every(
        (d) =>
            d.state === "ACCEPTED" ||
            d.state === "AUTO_RELEASED"
    );

    return allDeliverablesResolved;
}
