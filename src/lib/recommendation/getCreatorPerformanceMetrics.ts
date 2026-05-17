import mongoose from "mongoose";

import { Agreement }
from "@/lib/db/models/Agreement";

import { Milestone }
from "@/lib/db/models/Milestone";

export async function getCreatorPerformanceMetrics(
  creatorId: string
) {

  const creatorObjectId =
    new mongoose.Types.ObjectId(
      creatorId
    );

  /* ================= AGREEMENTS ================= */

  const agreements =
    await Agreement.find({

      creatorId: creatorObjectId,

      status: {
        $in: [
          "ACTIVE",
          "COMPLETED",
        ],
      },
    });

  const totalAgreements =
    agreements.length;

  const completedAgreements =
    agreements.filter(
      (a: any) =>
        a.status === "COMPLETED"
    ).length;

  const completionRate =
    totalAgreements === 0
      ? 0
      : Math.round(
          (
            completedAgreements /
            totalAgreements
          ) * 100
        );

  /* ================= REPEAT BRANDS ================= */

  const brandCounts:
    Record<string, number> = {};

  agreements.forEach(
    (agreement: any) => {

      if (!agreement.brandId) return;

      const id =
        agreement.brandId.toString();

      brandCounts[id] =
        (brandCounts[id] || 0) + 1;
    }
  );

  const repeatBrands =
    Object.values(brandCounts)
      .filter(
        (count) => count > 1
      ).length;

  const repeatBrandsPercent =
    totalAgreements === 0
      ? 0
      : Math.round(
          (
            repeatBrands /
            totalAgreements
          ) * 100
        );

  /* ================= MILESTONES ================= */

  const agreementIds =
    agreements.map(
      (a: any) => a._id
    );

  const milestones =
    await Milestone.find({

      agreementId: {
        $in: agreementIds,
      },
    });

  /* ================= REVISIONS ================= */

  const revisedMilestones =
    milestones.filter(
      (m: any) =>
        m.revisionFeedback ||
        m.status === "REVISION"
    );

  const avgRevisions =
    milestones.length === 0
      ? 0
      : Number(
          (
            revisedMilestones.length /
            milestones.length
          ).toFixed(1)
        );

  /* ================= TURNAROUND ================= */

  const turnaroundMilestones =
    milestones.filter(
      (m: any) =>
        m.submission?.submittedAt
    );

  let totalTurnaroundDays = 0;

  turnaroundMilestones.forEach(
    (m: any) => {

      const start =
        new Date(
          m.createdAt
        ).getTime();

      const end =
        new Date(
          m.submission.submittedAt
        ).getTime();

      const days =
        (
          end - start
        ) /
        (
          1000 *
          60 *
          60 *
          24
        );

      totalTurnaroundDays += days;
    }
  );

  const avgTurnaround =
    turnaroundMilestones.length === 0
      ? 0
      : Number(
          (
            totalTurnaroundDays /
            turnaroundMilestones.length
          ).toFixed(1)
        );

  return {

    completionRate,

    avgRevisions,

    repeatBrandsPercent,

    avgTurnaround,
  };
}