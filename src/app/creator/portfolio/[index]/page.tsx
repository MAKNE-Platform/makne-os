import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/connect";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";
import { User } from "@/lib/db/models/User";

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
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-10 max-w-4xl mx-auto space-y-10">

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-medium">{serializedProject.title}</h1>
        <div className="text-sm opacity-70">
          {serializedProject.brandName}
          {serializedProject.campaignType && ` • ${serializedProject.campaignType}`}
        </div>
      </div>

      {/* Thumbnail */}
      {serializedProject.thumbnail && (
        <div className="overflow-hidden rounded-2xl h-[60vh] object-cover border border-white/10">
          <img
            src={serializedProject.thumbnail}
            alt={serializedProject.title}
            className="w-full object-cover"
          />
        </div>
      )}

      {/* MEDIA */}
      {serializedProject.media?.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Media</h2>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {serializedProject.media.map((m: any, i: number) => (
              <MediaItem key={i} media={m} />
            ))}
          </div>
        </div>
      )}

      {/* Duration */}
      {serializedProject.duration && (
        <div className="text-sm opacity-70">
          Duration:{" "}
          {serializedProject.duration.start || "—"}
          {serializedProject.duration.end && ` → ${serializedProject.duration.end}`}
        </div>
      )}

      {/* Description */}
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Overview</h2>

        {serializedProject.description ? (
          <p className="text-sm opacity-80 leading-relaxed">
            {serializedProject.description}
          </p>
        ) : (
          <p className="text-sm opacity-50 italic">
            No description provided for this project yet.
          </p>
        )}
      </div>

      {/* Deliverables */}
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Deliverables</h2>

        {serializedProject.deliverables?.length ? (
          <ul className="list-disc list-inside text-sm opacity-80">
            {serializedProject.deliverables.map((d: string, i: number) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm opacity-50 italic">
            Deliverables not specified.
          </p>
        )}
      </div>

      {/* Outcome */}
      {serializedProject.outcome?.summary && (
        <div className="rounded-xl border border-white/10 bg-[#ffffff05] p-4 space-y-2">
          <div className="text-sm font-medium">Outcome</div>
          <div className="text-sm opacity-80">
            {serializedProject.outcome.summary}
          </div>

          {serializedProject.outcome.metrics?.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {serializedProject.outcome.metrics.map((m: any, i: number) => (
                <div
                  key={i}
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs"
                >
                  <div className="opacity-60">{m.label}</div>
                  <div className="font-medium">{m.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Links */}
      {serializedProject.links?.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Links</h2>
          <div className="flex flex-wrap gap-3">
            {serializedProject.links.map((l: any, i: number) => (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#636EE1] hover:underline"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
