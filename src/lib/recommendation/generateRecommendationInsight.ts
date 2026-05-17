type Params = {
  creatorName: string;

  niche?: string;

  platforms?: string;

  completionRate?: number;

  avgRevisions?: number;

  repeatBrandsPercent?: number;

  recommendationReasons?: string[];
};

export function generateRecommendationInsight({
  creatorName,
  niche,
  platforms,
  completionRate,
  avgRevisions,
  repeatBrandsPercent,
  recommendationReasons,
}: Params) {

  const insights: string[] = [];

  /* ================= OPENING ================= */

  insights.push(
    `${creatorName} appears to be a strong fit for ${niche || "brand"} collaborations`
  );

  /* ================= RELIABILITY ================= */

  if (
    typeof completionRate === "number"
  ) {

    if (completionRate >= 90) {

      insights.push(
        "with excellent campaign completion consistency"
      );

    } else if (completionRate >= 75) {

      insights.push(
        "with a reliable campaign execution history"
      );
    }
  }

  /* ================= REVISIONS ================= */

  if (
    typeof avgRevisions === "number"
  ) {

    if (avgRevisions <= 1) {

      insights.push(
        "and consistently low revision frequency"
      );
    }
  }

  /* ================= REPEAT BRANDS ================= */

  if (
    typeof repeatBrandsPercent ===
    "number"
  ) {

    if (
      repeatBrandsPercent >= 30
    ) {

      insights.push(
        "along with strong repeat brand collaboration signals"
      );
    }
  }

  /* ================= PLATFORM ================= */

  if (platforms) {

    insights.push(
      `Their content presence on ${platforms} also aligns well with digital-first campaign execution.`
    );
  }

  /* ================= RECOMMENDATION REASONS ================= */

  if (
    recommendationReasons?.length
  ) {

    insights.push(
      `Key strengths include ${recommendationReasons
        .slice(0, 3)
        .join(", ")
        .toLowerCase()}.`
    );
  }

  return insights.join(" ");
}