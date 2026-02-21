type Props = {
  displayName: string;
  niche: string;
  platforms: string;
  profileImage?: string;
  bio?: string;
  location?: string;
};

export default function CreatorBasicInfoSection({
  displayName,
  niche,
  platforms,
  profileImage,
  bio,
  location,
}: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 mt-10">

      {/* ================= LEFT: BASIC INFO ================= */}
      <div className="space-y-5 text-md">

        <div>
          <span className="opacity-60">Display name:</span>{" "}
          <span className="font-medium">{displayName}</span>
        </div>

        {bio && (
          <div>
            <span className="opacity-60">Bio:</span>{" "}
            <span className="font-medium whitespace-pre-line">{bio}</span>
          </div>
        )}

        {location && (
          <div>
            <span className="opacity-60">Location:</span>{" "}
            <span className="font-medium">{location}</span>
          </div>
        )}

        <div>
          <span className="opacity-60">Primary category:</span>{" "}
          {niche ? (
            niche.split(",").map((n, i) => (
              <span
                key={`${n.trim()}-${i}`}
                className="inline-block ml-2 rounded-full border border-white/15 px-3 py-1 text-xs font-medium"
              >
                {n.trim()}
              </span>
            ))
          ) : (
            <span className="font-medium opacity-40">Not added</span>
          )}
        </div>

        <div>
          <span className="opacity-60">Platforms:</span>{" "}
          <span className="font-medium">{platforms}</span>
        </div>

        {/* <div className="opacity-40 text-xs">
          Verification badge coming soon
        </div> */}
      </div>

      {/* ================= RIGHT: AVATAR ================= */}
      <div
        className="
          rounded-2xl
          border border-white/15
          bg-[#ffffff05]
          flex items-center justify-center
          h-[60vh] overflow-hidden
        "
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt={displayName}
            className="h-full w-full rounded object-cover border border-white/10"
          />
        ) : (
          <div className="h-40 w-40 rounded-full bg-[#636EE1]/20 flex items-center justify-center text-4xl font-medium">
            {displayName?.[0]?.toUpperCase() ?? "C"}
          </div>
        )}
      </div>

    </div>
  );
}
