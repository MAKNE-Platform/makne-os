export type PortfolioItem = {
  _id: any;
  link: string | undefined;
  id?: string; // stringified _id (for client use)

  // Core
  title: string;
  brandName: string;
  thumbnail?: string; // cover image URL

  // Timeline & context
  duration?: {
    start?: string;
    end?: string;
  };


  campaignType?: string;
  platforms?: string[];

  // Media gallery
  media?: {
    type: "image" | "video";
    url: string;
    thumbnail?: string; // for video
  }[];

  // External links
  links?: {
    label: string;
    url: string;
  }[];

  // Description & scope
  description?: string;
  deliverables?: string[];
  role?: string;

  // Outcome / results
  outcome?: {
    summary?: string;
    metrics?: {
      label: string;
      value: string;
    }[];
  };

  // MAKNE meta
  meta?: {
    verifiedByBrand?: boolean;
    featured?: boolean;
    draft?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
};
