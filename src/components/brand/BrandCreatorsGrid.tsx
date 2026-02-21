"use client";

import Link from "next/link";

type Creator = {
  _id: string;
  username: string;
  niche: string;
  platforms: string;
  location: string;
  profileImage: string;
  bio: string;
  contentFormats: string[];
  portfolioCount: number;
  email: string;
};

export default function BrandCreatorsGrid({
  creators,
}: {
  creators: Creator[];
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

      {creators.map((creator) => (
        <div
          key={creator._id}
          className="group rounded-2xl border border-white/10 bg-[#ffffff05] backdrop-blur-xl p-6 hover:border-[#636EE1]/50 transition-all"
        >
          {/* Profile Image */}
          <div className="w-16 h-16 rounded-full bg-[#636EE1]/20 flex items-center justify-center text-lg font-semibold overflow-hidden">
            {creator.profileImage ? (
              <img
                src={creator.profileImage}
                alt={creator.username}
                className="w-full h-full object-cover"
              />
            ) : (
              creator.username[0].toUpperCase()
            )}
          </div>

          {/* Username */}
          <div className="mt-4 text-lg font-medium">
            {creator.username}
          </div>

          {/* Niche */}
          <div className="text-sm text-white/60">
            {creator.niche}
          </div>

          {/* Platforms */}
          <div className="mt-2 text-xs text-white/50">
            {creator.platforms}
          </div>

          {/* Location */}
          {creator.location && (
            <div className="mt-1 text-xs text-white/40">
              {creator.location}
            </div>
          )}

          {/* Skills */}
          <div className="mt-3 flex flex-wrap gap-2">
            {creator.contentFormats.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-xs px-2 py-1 rounded-full bg-[#636EE1]/10 border border-[#636EE1]/30 text-[#636EE1]"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Portfolio Count */}
          <div className="mt-4 text-xs text-white/50">
            {creator.portfolioCount} Portfolio Projects
          </div>

          {/* CTA */}
          <Link
            href={`/brand/creators/${creator._id}`}
            className="mt-4 inline-block text-sm text-[#636EE1] group-hover:underline"
          >
            View Profile →
          </Link>
        </div>
      ))}

    </div>
  );
}