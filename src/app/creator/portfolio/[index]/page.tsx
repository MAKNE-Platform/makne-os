import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";
import { User } from "@/lib/db/models/User";
import { ArrowLeft } from "lucide-react";

type Params = {
  params: Promise<{
    index: string; // this is now projectId
  }>;
};

export default async function ProjectDetailPage({ params }: Params) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "CREATOR") redirect("/auth/login");

  await connectDB();

  const user = await User.findById(userId).lean<{ email: string }>();
  if (!user) redirect("/auth/login");

  const profileDoc = await CreatorProfile.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  }).lean<any>();

  if (!profileDoc || !Array.isArray(profileDoc.portfolio)) {
    redirect("/creator/portfolio");
  }

  const { index } = await params; // index is actually projectId

  // ✅ Find project by _id instead of array index
  const project = profileDoc.portfolio.find(
    (p: any) => p._id?.toString() === index
  );

  if (!project) {
    redirect("/creator/portfolio");
  }

  // 🔒 Fully serialize project to plain object
  const serializedProject = {
    ...project,
    _id: project._id?.toString(),
    media: project.media?.map((m: any) => ({
      type: m.type,
      url: m.url,
    })),
    links: project.links?.map((l: any) => ({
      label: l.label,
      url: l.url,
    })),
    outcome: project.outcome
      ? {
        summary: project.outcome.summary,
        metrics: project.outcome.metrics?.map((m: any) => ({
          label: m.label,
          value: m.value,
        })),
      }
      : undefined,
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* ===== BACK BUTTON ===== */}
        <div>
          <a
            href="/creator/portfolio"
            className="text-sm text-[#636EE1] hover:underline flex items-center gap-1"
          >
            <ArrowLeft /> Back to portfolio
          </a>
        </div>

        {/* ===== HEADER ===== */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-4xl font-semibold">
              {serializedProject.title}
            </h1>

            {serializedProject.meta?.featured && (
              <span className="text-xs bg-[#636EE1]/20 text-[#636EE1] px-3 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>

          <div className="text-sm opacity-70 flex flex-wrap gap-3">
            {serializedProject.brandName && (
              <span>{serializedProject.brandName}</span>
            )}

            {serializedProject.campaignType && (
              <span>• {serializedProject.campaignType}</span>
            )}

            {serializedProject.duration?.start && (
              <span>
                • {serializedProject.duration.start}
                {serializedProject.duration.end &&
                  ` → ${serializedProject.duration.end}`}
              </span>
            )}
          </div>
        </div>

        {/* ===== THUMBNAIL HERO ===== */}
        {serializedProject.thumbnail && (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#ffffff05]">
            <img
              src={serializedProject.thumbnail}
              alt={serializedProject.title}
              className="w-full h-[60vh] object-cover object-center"
            />
          </div>
        )}

        {/* ===== OVERVIEW ===== */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Overview</h2>

          {serializedProject.description ? (
            <p className="text-sm opacity-80 leading-relaxed max-w-3xl">
              {serializedProject.description}
            </p>
          ) : (
            <p className="text-sm opacity-50 italic">
              No description provided for this project yet.
            </p>
          )}
        </div>

        {/* ===== MEDIA GALLERY ===== */}
        {serializedProject.media?.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Media</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {serializedProject.media.map((m: any, i: number) => (
                <MediaItem key={`${m.url}-${i}`} media={m} />

              ))}
            </div>
          </div>
        )}

        {/* ===== DELIVERABLES ===== */}
{serializedProject.deliverables?.length > 0 && (
  <div className="space-y-6">
    <h2 className="text-xl font-medium">Deliverables</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {serializedProject.deliverables.map((rawDeliverable: any, i: number) => {
        const d =
          typeof rawDeliverable === "string"
            ? { title: rawDeliverable }
            : rawDeliverable;

        return (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-[#ffffff05] p-5 space-y-3 hover:border-[#636EE1]/40 transition"
          >
            {/* Title */}
            <div className="text-sm font-semibold">
              {d.title}
            </div>

            {/* Format + Platform Pills */}
            {(d.format || d.platform) && (
              <div className="flex flex-wrap gap-2">
                {d.format && (
                  <span className="text-xs px-3 py-1 rounded-full border border-white/15 opacity-80">
                    {d.format}
                  </span>
                )}
                {d.platform && (
                  <span className="text-xs px-3 py-1 rounded-full border border-[#636EE1]/40 text-[#636EE1]">
                    {d.platform}
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            {d.description && (
              <p className="text-xs opacity-70 leading-relaxed">
                {d.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}

        {/* ===== OUTCOME ===== */}
        {serializedProject.outcome?.summary && (
          <div className="space-y-6">
            <h2 className="text-xl font-medium">Outcome</h2>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#636EE1]/10 to-transparent p-6 space-y-4">
              <p className="text-sm opacity-90 leading-relaxed">
                {serializedProject.outcome.summary}
              </p>

              {serializedProject.outcome.metrics?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {serializedProject.outcome.metrics.map(
                    (m: any, i: number) => (
                      <div
                        key={i}
                        className="rounded-xl border border-white/10 bg-[#ffffff05] p-4"
                      >
                        <div className="text-xs opacity-60">
                          {m.label}
                        </div>
                        <div className="mt-1 text-lg font-medium">
                          {m.value}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== LINKS ===== */}
        {serializedProject.links?.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Project Links</h2>

            <div className="flex flex-wrap gap-4">
              {serializedProject.links.map((l: any, i: number) => (
                <a
                  key={i}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-[#636EE1]/40 text-[#636EE1] px-4 py-2 text-sm hover:bg-[#636EE1]/10 transition"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );

}


function MediaItem({
  media,
}: {
  media: {
    type: "image" | "video";
    url: string;
  };
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
      {media.type === "image" ? (
        <img
          src={media.url}
          alt="Project media"
          className="w-full h-full object-cover"
        />
      ) : (
        <video
          src={media.url}
          controls
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
