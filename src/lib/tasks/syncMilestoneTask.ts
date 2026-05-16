import { Agreement } from "@/lib/db/models/Agreement";

export async function syncMilestoneTask({
    agreementId,
    milestoneId,
    completed,
}: {
    agreementId: string;

    milestoneId: string;

    completed: boolean;
}) {

    const agreement =
        await Agreement.findById(agreementId);

    console.log(
        "SYNC TASK CALLED",
        {
            agreementId,
            milestoneId,
            completed,
        }
    );

    if (!agreement) return;

    agreement.creatorTasks =
        (agreement.creatorTasks || []).map(
            (task: any) => {

                if (
                    task.sourceType === "MILESTONE" &&
                    task.sourceId?.toString() ===
                    milestoneId.toString()
                ) {

                    return {
                        ...task,
                        completed,
                    };
                }

                return task;
            }
        );

    agreement.markModified(
        "creatorTasks"
    );

    await agreement.save();
}