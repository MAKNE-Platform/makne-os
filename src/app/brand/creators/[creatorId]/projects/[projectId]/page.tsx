import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { CreatorProfile } from "@/lib/db/models/CreatorProfile";
import { ArrowLeft } from "lucide-react";

type Params = {
  params: Promise<{
    creatorId: string;
    projectId: string;
  }>;
};

export default async function BrandProjectDetailPage({ params }: Params) {
  const { creatorId, projectId } = await params;

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth_session")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (!userId || role !== "BRAND") {
    redirect("/auth/login");
  }

  await connectDB();

  const creatorProfile = await CreatorProfile.findById(
    new mongoose.Types.ObjectId(creatorId)
  ).lean<any>();

  if (!creatorProfile || !Array.isArray(creatorProfile.portfolio)) {
    redirect("/brand/creators");
  }

  const project = creatorProfile.portfolio.find(
    (p: any) => p._id?.toString() === projectId
  );

  if (!project) {
    redirect(`/brand/creators/${creatorId}`);
  }

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
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* BACK TO CREATOR */}
        <div>
          <a
            href={`/brand/creators/${creatorId}`}
            className="text-sm text-[#636EE1] hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to creator
          </a>
        </div>

        {/* HERO */}
        <div className="space-y-6">

          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-5xl font-semibold tracking-tight">
              {serializedProject.title}
            </h1>

            {serializedProject.meta?.featured && (
              <span className="text-xs bg-[#636EE1]/20 text-[#636EE1] px-3 py-1 rounded-full border border-[#636EE1]/30">
                Featured
              </span>
            )}
          </div>

          <div className="text-sm text-white/60 flex flex-wrap gap-4">
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

        {/* THUMBNAIL */}
        {serializedProject.thumbnail && (
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#ffffff05]">
            <img
              src={serializedProject.thumbnail}
              alt={serializedProject.title}
              className="w-full h-[65vh] object-cover object-center"
            />
          </div>
        )}

        {/* OVERVIEW */}
        <Section title="Overview">
          {serializedProject.description ? (
            <p className="text-base opacity-80 leading-relaxed max-w-4xl">
              {serializedProject.description}
            </p>
          ) : (
            <p className="text-sm opacity-50 italic">
              No description provided.
            </p>
          )}
        </Section>

        {/* MEDIA */}
        {serializedProject.media?.length > 0 && (
          <Section title="Media Gallery">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {serializedProject.media.map((m: any, i: number) => (
                <div
                  key={`${m.url}-${i}`}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-black"
                >
                  {m.type === "image" ? (
                    <img
                      src={m.url}
                      alt="Project media"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={m.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {serializedProject.deliverables?.length > 0 && (
  <Section title="Deliverables">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {serializedProject.deliverables.map((d: string, i: number) => {

        // Smart formatting
        const formatted = d.trim();

        return (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-[#0B0F19]/60 backdrop-blur p-6 hover:border-[#636EE1]/30 transition space-y-3"
          >
            <div className="flex items-center justify-between">

              <div className="text-sm font-medium">
                {formatted}
              </div>

              <span className="text-[10px] uppercase tracking-wide opacity-40">
                Deliverable {i + 1}
              </span>
            </div>

            <div className="h-px bg-white/5" />

            <div className="text-xs text-white/60 leading-relaxed">
              This deliverable was executed as part of the campaign scope,
              aligned with the brand’s objectives and content strategy.
            </div>
          </div>
        );
      })}

    </div>

  </Section>
)}

        {/* OUTCOME */}
        {serializedProject.outcome?.summary && (
          <Section title="Outcome">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#636EE1]/10 to-transparent p-8 space-y-6">
              <p className="text-base opacity-90 leading-relaxed max-w-4xl">
                {serializedProject.outcome.summary}
              </p>

              {serializedProject.outcome.metrics?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {serializedProject.outcome.metrics.map(
                    (m: any, i: number) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-white/10 bg-[#ffffff05] p-6"
                      >
                        <div className="text-xs opacity-60">
                          {m.label}
                        </div>
                        <div className="mt-2 text-2xl font-semibold">
                          {m.value}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </Section>
        )}

        {/* LINKS */}
        {serializedProject.links?.length > 0 && (
          <Section title="Project Links">
            <div className="flex flex-wrap gap-4">
              {serializedProject.links.map((l: any, i: number) => (
                <a
                  key={i}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-[#636EE1]/40 text-[#636EE1] px-5 py-2 text-sm hover:bg-[#636EE1]/10 transition"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </Section>
        )}

      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </div>
  );
}