type CreatorInput = {
  niche?: string;

  platforms?: string;

  completionRate?: number;

  avgRevisions?: number;

  repeatBrandsPercent?: number;

  profileCompletion?: number;

  portfolioCount?: number;
};

type CampaignInput = {
  niche?: string;

  platform?: string;
};

type Result = {
  score: number;

  reasons: string[];
};

export function scoreCreator({
  creator,
  campaign,
}: {
  creator: CreatorInput;

  campaign: CampaignInput;
}): Result {

  let score = 0;

  const reasons: string[] = [];

  /* ================= NICHE MATCH ================= */

  const creatorNiche =
    creator.niche?.toLowerCase() || "";

  const campaignNiche =
    campaign.niche?.toLowerCase() || "";

  if (
    creatorNiche &&
    campaignNiche &&
    creatorNiche.includes(campaignNiche)
  ) {

    score += 35;

    reasons.push(
      `Strong niche alignment with ${campaign.niche} campaigns`
    );
  }

  /* ================= PLATFORM MATCH ================= */

  const creatorPlatforms =
    creator.platforms?.toLowerCase() || "";

  const campaignPlatform =
    campaign.platform?.toLowerCase() || "";

  if (
    creatorPlatforms &&
    campaignPlatform &&
    creatorPlatforms.includes(
      campaignPlatform
    )
  ) {

    score += 20;

    reasons.push(
      `Experienced on ${campaign.platform}`
    );
  }

  /* ================= COMPLETION RATE ================= */

  const completionRate =
    creator.completionRate || 0;

  if (completionRate >= 90) {

    score += 20;

    reasons.push(
      "Excellent campaign completion history"
    );

  } else if (completionRate >= 75) {

    score += 12;

    reasons.push(
      "Strong campaign completion rate"
    );
  }

  /* ================= REVISION RATE ================= */

  const revisions =
    creator.avgRevisions || 0;

  if (revisions <= 1) {

    score += 10;

    reasons.push(
      "Low revision frequency"
    );

  } else if (revisions <= 2) {

    score += 5;
  }

  /* ================= REPEAT BRANDS ================= */

  const repeatBrands =
    creator.repeatBrandsPercent || 0;

  if (repeatBrands >= 40) {

    score += 10;

    reasons.push(
      "High repeat brand collaborations"
    );

  } else if (repeatBrands >= 20) {

    score += 5;
  }

  /* ================= PROFILE QUALITY ================= */

  const profileCompletion =
    creator.profileCompletion || 0;

  if (profileCompletion >= 80) {

    score += 5;

    reasons.push(
      "Well-optimized creator profile"
    );
  }

  /* ================= PORTFOLIO ================= */

  const portfolioCount =
    creator.portfolioCount || 0;

  if (portfolioCount >= 3) {

    reasons.push(
      "Strong portfolio presence"
    );
  }

  /* ================= NORMALIZE ================= */

  score = Math.min(score, 100);

  return {
    score,
    reasons,
  };
}