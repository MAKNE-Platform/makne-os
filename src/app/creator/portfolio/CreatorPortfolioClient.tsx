"use client";

import { useState } from "react";

import PortfolioOverviewCard from "@/components/creator/PortfolioOverviewCard";
import CreatorBasicInfoSection from "@/components/creator/CreatorBasicInfoSection";
import CreatorContactCTAs from "@/components/creator/CreatorContactCTAs";
import Link from "next/link";
import type { PortfolioItem } from "@/types/portfolio";
import { Key } from "react";


/* ================= TYPES ================= */

type Props = {
    profile: {
        bio: string | undefined;
        location: string | undefined;
        overview: any;
        availability: "AVAILABLE" | "LIMITED" | "UNAVAILABLE";
        displayName: string;
        email: string;
        niche: string;
        platforms: string;
        profileImage?: string;
        profileCompletion: number;
        portfolio: PortfolioItem[];
        performance: {
            collaborations: number;
            completed: number;
            earnings: number;
            completionRate: number;
        };
        skills: {
            contentFormats: string[];
            tools: string[];
            languages: string[];
            strengths: string[];
        };
        hasPublishedProject: any,

    };
};

/* ================= COMPONENT ================= */

export default function CreatorPortfolioClient({ profile }: Props) {

    const [showAllProjects, setShowAllProjects] = useState(false);

    // All projects creator owns
    const allProjects = profile.portfolio ?? [];

    // Explicit featured (ignore draft)
    const explicitlyFeatured = allProjects.filter(
        (p) => p.meta?.featured
    );

    // Final featured display for creator view
    const featuredProjects =
        explicitlyFeatured.length > 0
            ? explicitlyFeatured
            : allProjects.slice(0, 2);

    const maxVisible = 4;

    const visibleProjects = showAllProjects
        ? allProjects
        : allProjects.slice(0, maxVisible);

    const hasMoreThanMax = allProjects.length > maxVisible;


    console.log(profile.displayName);

    return (
        <div className="space-y-12">

            {/* ================= HERO ================= */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b1020] via-[#0f172a] to-[#1e1b4b] p-6 sm:p-8 lg:p-10">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-10">

                    {/* LEFT: Identity */}
                    <div className="flex flex-col sm:flex-row sm:items-center items-center sm:items-start gap-6 w-full">

                        {/* Avatar Wrapper */}
                        <div className="relative flex justify-center sm:justify-start w-full sm:w-auto">
                            {profile.profileImage ? (
                                <img
                                    src={profile.profileImage}
                                    alt={profile.displayName}
                                    className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 rounded-2xl object-cover shadow-xl ring-2 ring-[#636EE1]/40"
                                />
                            ) : (
                                <div className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 rounded-2xl bg-[#636EE1]/20 flex items-center justify-center text-xl sm:text-2xl lg:text-3xl font-semibold">
                                    {profile.displayName?.[0]?.toUpperCase() ?? "C"}
                                </div>
                            )}

                            <Link
                                href="/creator/profile"
                                className="
    absolute -bottom-4
    h-9 w-9
    flex items-center justify-center
    rounded-full
    bg-white/10
    backdrop-blur-md
    border border-white/20
    shadow-lg
    hover:bg-[#636EE1]
    hover:text-black
    transition-all duration-200
  "
                            >
                                ✎
                            </Link>
                        </div>

                        {/* Name + Meta */}
                        <div className="space-y-2 text-center sm:text-left">

                            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                                {profile.displayName}
                            </h1>

                            {profile.niche && (
                                <div className="text-sm opacity-70 break-words">
                                    {profile.niche}
                                </div>
                            )}

                            {profile.location && (
                                <div className="text-xs opacity-50 break-words">
                                    {profile.location}
                                </div>
                            )}

                            {/* Availability Pill */}
                            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs">
                                <div
                                    className={`h-2 w-2 rounded-full ${profile.availability === "AVAILABLE"
                                        ? "bg-green-400"
                                        : profile.availability === "LIMITED"
                                            ? "bg-yellow-400"
                                            : "bg-red-400"
                                        }`}
                                />
                                {profile.availability === "AVAILABLE" && "Available for work"}
                                {profile.availability === "LIMITED" && "Limited availability"}
                                {profile.availability === "UNAVAILABLE" && "Not available"}
                            </div>

                        </div>
                    </div>

                    {/* RIGHT: Profile Completion */}
                    <div className="w-full sm:max-w-md lg:max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 sm:p-6 space-y-4">

                        <div className="flex justify-between text-xs opacity-70">
                            <span>Profile completion</span>
                            <span>{profile.profileCompletion}%</span>
                        </div>

                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#636EE1] transition-all"
                                style={{ width: `${profile.profileCompletion}%` }}
                            />
                        </div>

                        {profile.profileCompletion < 100 && (
                            <div className="text-xs opacity-60">
                                Complete your profile to boost brand trust.
                            </div>
                        )}

                    </div>

                </div>
            </div>

            {/* ================= OVERVIEW KPIs ================= */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 -mt-4">
                <PortfolioOverviewCard
                    label="Total campaigns"
                    value={profile.overview.totalCampaigns}
                />

                <PortfolioOverviewCard
                    label="On-time delivery"
                    value={`${profile.overview.onTimePercent}%`}
                />

                <PortfolioOverviewCard
                    label="Avg. revisions"
                    value={profile.overview.avgRevisions}
                    helper="per project"
                />

                <PortfolioOverviewCard
                    label="Repeat brands"
                    value={`${profile.overview.repeatBrandsPercent}%`}
                />

                <PortfolioOverviewCard
                    label="Avg. turnaround"
                    value={`${profile.overview.avgTurnaround} days`}
                />
            </div>


            {/* ================= BASIC INFO ================= */}
            <SectionHeader
                title="Basic Info"
                editHref="/creator/profile"
            />

            <CreatorBasicInfoSection
                displayName={profile.displayName}
                niche={profile.niche}
                platforms={profile.platforms}
                profileImage={profile.profileImage}
                bio={profile.bio}
                location={profile.location}
            />

            {/* ================= CONTACT CTAs ================= */}
            <CreatorContactCTAs
                email={profile.email}
                portfolioLink={profile.portfolio[0]?.link}
            />

            {/* ================= AVAILABILITY ================= */}
            {/* <div className="rounded-xl border border-white/10 bg-[#ffffff05] p-4 flex items-center justify-between">
                <div>
                    <div className="text-xs opacity-70">Availability</div>
                    <div className="mt-1 text-sm font-medium">
                        {profile.availability === "AVAILABLE" && "Available for collaborations"}
                        {profile.availability === "LIMITED" && "Limited availability"}
                        {profile.availability === "UNAVAILABLE" && "Not available"}
                    </div>
                </div>

                <div
                    className={`h-3 w-3 rounded-full ${profile.availability === "AVAILABLE"
                        ? "bg-green-400"
                        : profile.availability === "LIMITED"
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        }`}
                />
            </div> */}

            {/* ================= PERFORMANCE ================= */}
            <div className="space-y-3">
                <h2 className="text-lg font-medium opacity-70">Performance</h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <PerfCard label="Collaborations" value={profile.performance.collaborations} />
                    <PerfCard label="Completed" value={profile.performance.completed} />
                    <PerfCard
                        label="Total earnings"
                        value={`₹${profile.performance.earnings.toLocaleString()}`}
                    />
                    <PerfCard
                        label="Completion rate"
                        value={`${profile.performance.completionRate}%`}
                    />
                </div>
            </div>

            {/* ================= SKILLS & CAPABILITIES ================= */}
            <div className="space-y-4">
                {/* <h2 className="text-xl font-medium">Skills & Capabilities</h2> */}
                <SectionHeader
                    title="Skills & Capabilities"
                    editHref="/creator/profile"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Primary Niche */}
                    <CapabilityCard title="Primary Niche">
                        {profile.niche ? (
                            <CapabilityPill>{profile.niche}</CapabilityPill>
                        ) : (
                            <span className="text-xs opacity-40">Not added yet</span>
                        )}
                    </CapabilityCard>

                    {/* Platforms */}
                    <CapabilityCard title="Platforms">
                        {profile.platforms
                            ? profile.platforms.split(",").map((p, i) => (
                                <CapabilityPill key={`${p.trim()}-${i}`}>
                                    {p.trim()}
                                </CapabilityPill>
                            ))
                            : <span className="text-xs opacity-40">Not added yet</span>}
                    </CapabilityCard>

                    {/* Content Formats */}
                    <CapabilityCard title="Content Formats">
                        {profile.skills?.contentFormats?.length ? (
                            profile.skills.contentFormats.map((f, i) => (
                                <CapabilityPill key={`${f}-${i}`}>{f}</CapabilityPill>
                            ))
                        ) : (
                            <span className="text-xs opacity-40">Not added yet</span>
                        )}
                    </CapabilityCard>

                    {/* Tools */}
                    <CapabilityCard title="Tools & Software">
                        {profile.skills?.tools?.length ? (
                            profile.skills.tools.map((t, i) => (
                                <CapabilityPill key={`${t}-${i}`}>{t}</CapabilityPill>
                            ))
                        ) : (
                            <span className="text-xs opacity-40">Not added yet</span>
                        )}
                    </CapabilityCard>

                    {/* Languages */}
                    <CapabilityCard title="Languages">
                        {profile.skills?.languages?.length ? (
                            profile.skills.languages.map((l, i) => (
                                <CapabilityPill key={`${l}-${i}`}>{l}</CapabilityPill>
                            ))
                        ) : (
                            <span className="text-xs opacity-40">Not added yet</span>
                        )}
                    </CapabilityCard>

                    {/* Strengths */}
                    <CapabilityCard title="Strengths">
                        {profile.skills?.strengths?.length ? (
                            profile.skills.strengths.map((s, i) => (
                                <CapabilityPill key={`${s}-${i}`}>{s}</CapabilityPill>
                            ))
                        ) : (
                            <span className="text-xs opacity-40">Not added yet</span>
                        )}
                    </CapabilityCard>

                </div>

            </div>


            {/* ===== FEATURED PROJECTS ===== */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Featured Projects</h2>

                    {profile.portfolio.length > 0 && (
                        <Link
                            href="/creator/portfolio/manage"
                            className="text-sm text-[#636EE1] hover:underline"
                        >
                            Manage
                        </Link>
                    )}
                </div>

                {allProjects.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-[#ffffff05] p-6 space-y-3">
                        <div className="text-sm font-medium">No projects yet</div>
                        <div className="text-sm opacity-70">
                            Add projects to showcase your work.
                        </div>

                        <Link
                            href="/creator/portfolio/manage"
                            className="inline-flex w-max items-center gap-2 rounded-lg bg-[#636EE1] px-4 py-2 text-sm font-medium text-black"
                        >
                            + Add project
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {visibleProjects.map((item, index) => (
                                <Link key={index} href={`/creator/portfolio/${item._id}`}>
                                    <FeaturedProjectCard item={item} />
                                </Link>
                            ))}
                        </div>

                        {/* View All Toggle */}
                        {hasMoreThanMax && (
                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={() => setShowAllProjects(!showAllProjects)}
                                    className="text-sm text-[#636EE1] hover:underline"
                                >
                                    {showAllProjects ? "Show less" : "View all projects"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>



        </div>
    )
}

/* ================= SUB COMPONENTS ================= */

function PerfCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/60 backdrop-blur p-5 hover:border-[#636EE1]/30 transition">
            <div className="text-xs opacity-60">{label}</div>
            <div className="mt-1 text-lg font-medium">{value}</div>
        </div>
    );
}

function FeaturedProjectCard({ item }: { item: PortfolioItem }) {
    return (
        <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-[#ffffff05] transition hover:border-[#636EE1]/40">

            {/* Featured Badge */}
            {item.meta?.featured && (
                <div className="absolute top-3 right-3 z-10 rounded-full border bg-[#0000005f] border-[#636EE1] px-3 py-1 text-[10px] font-medium text-white shadow-md">
                    Featured
                </div>
            )}

            {/* Thumbnail */}
            <div className="aspect-[16/9] bg-black/30 relative overflow-hidden">
                {item.thumbnail ? (
                    <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs opacity-50">
                        No thumbnail
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">

                {/* Title */}
                <div className="text-sm font-medium">{item.title}</div>

                {/* Brand + Campaign */}
                <div className="text-xs opacity-70">
                    {item.brandName || "Brand collaboration"}
                    {item.campaignType && ` • ${item.campaignType}`}
                </div>

                {/* Duration */}
                {item.duration?.start && (
                    <div className="text-xs opacity-60">
                        {item.duration.start}
                        {item.duration.end && ` – ${item.duration.end}`}
                    </div>
                )}

                {/* Deliverables Count */}
                {item.deliverables && item.deliverables.length > 0 && (
                    <div className="text-xs opacity-60">
                        {item.deliverables.length} deliverable
                        {item.deliverables.length > 1 && "s"}
                    </div>
                )}

                {/* Outcome Summary */}
                {item.outcome?.summary && (
                    <div className="pt-1 text-xs text-[#636EE1] font-medium line-clamp-2">
                        {item.outcome.summary}
                    </div>
                )}
            </div>
        </div>
    );
}


function CapabilityCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-white/10 bg-[#ffffff05] p-4 space-y-3">
            <div className="text-sm font-medium opacity-80">{title}</div>
            <div className="flex flex-wrap gap-2">{children}</div>
        </div>
    );
}

function CapabilityPill({ children }: { children: React.ReactNode }) {
    return (
        <span className="rounded-full border border-white/15 px-3 py-1 text-xs opacity-80 whitespace-nowrap">
            {children}
        </span>
    );
}

function SectionHeader({
    title,
    editHref,
}: {
    title: string;
    editHref: string;
}) {
    return (
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">{title}</h2>

            <Link
                href={editHref}
                className="text-xs text-[#636EE1] hover:underline"
            >
                Edit
            </Link>
        </div>
    );
}

