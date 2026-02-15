"use client";

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
        portfolio: PortfolioItem[];
        performance: {
            collaborations: number;
            completed: number;
            earnings: number;
            completionRate: number;
        };
    };
};

/* ================= COMPONENT ================= */

export default function CreatorPortfolioClient({ profile }: Props) {

    const featuredProjects = profile.portfolio
        .filter(p => !p.meta?.draft)     // hide drafts
        .slice(0, 2);                    // show only top 2

    return (
        <div className="space-y-12">

            {/* ===== PROFILE HEADER ===== */}
            {/* <h1 className="text-4xl">My Portfolio</h1> */}
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                    {profile.profileImage ? (
                        <img
                            src={profile.profileImage}
                            alt={profile.displayName}
                            className="h-20 w-20 rounded-full object-cover border border-white/10"
                        />
                    ) : (
                        <div className="h-20 w-20 rounded-full bg-[#636EE1]/20 flex items-center justify-center text-2xl font-medium">
                            {profile.displayName[0].toUpperCase()}
                        </div>
                    )}
                    <Link
                        href="/creator/profile"
                        className="absolute -bottom-1 -right-1 rounded-full bg-[#636EE1] py-1 px-1.5 text-xs text-black"
                    >
                        ✎
                    </Link>
                </div>

                {/* Name */}
                <div>
                    <h1 className="text-3xl font-medium">{profile.displayName}</h1>
                    <div className="text-sm opacity-70">{profile.niche}</div>
                </div>
            </div>


            {/* ================= OVERVIEW KPIs ================= */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
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
            <div className="rounded-xl border border-white/10 bg-[#ffffff05] p-4 flex items-center justify-between">
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
            </div>

            {/* ================= PERFORMANCE ================= */}
            <div className="space-y-3">
                <h2 className="text-sm font-medium opacity-70">Performance</h2>

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
                        <CapabilityPill>{profile.niche}</CapabilityPill>
                    </CapabilityCard>

                    {/* Platforms */}
                    <CapabilityCard title="Platforms">
                        {profile.platforms.split(",").map((p) => (
                            <CapabilityPill key={p}>{p.trim()}</CapabilityPill>
                        ))}
                    </CapabilityCard>

                    {/* Content Formats */}
                    <CapabilityCard title="Content Formats">
                        {["Reels", "Posts", "Stories", "Short-form Video"].map((f) => (
                            <CapabilityPill key={f}>{f}</CapabilityPill>
                        ))}
                    </CapabilityCard>

                    {/* Tools */}
                    <CapabilityCard title="Tools & Software">
                        {["Canva", "Premiere Pro", "CapCut"].map((t) => (
                            <CapabilityPill key={t}>{t}</CapabilityPill>
                        ))}
                    </CapabilityCard>

                    {/* Languages */}
                    <CapabilityCard title="Languages">
                        {["English", "Hindi"].map((l) => (
                            <CapabilityPill key={l}>{l}</CapabilityPill>
                        ))}
                    </CapabilityCard>

                    {/* Strengths */}
                    <CapabilityCard title="Strengths">
                        {["Brand storytelling", "Audience engagement", "Consistency"].map((s) => (
                            <CapabilityPill key={s}>{s}</CapabilityPill>
                        ))}
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

                {featuredProjects.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-[#ffffff05] p-6 space-y-3">
                        <div className="text-sm font-medium">No featured projects yet</div>
                        <div className="text-sm opacity-70">
                            Publish at least one project to showcase your work.
                        </div>

                        <Link
                            href="/creator/portfolio/manage"
                            className="inline-flex w-max items-center gap-2 rounded-lg bg-[#636EE1] px-4 py-2 text-sm font-medium text-black"
                        >
                            + Add project
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {featuredProjects.map((item, index) => (
                            <Link key={index} href={`/creator/portfolio/${index}`}>
                                <FeaturedProjectCard item={item} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>


        </div>
    )
}

/* ================= SUB COMPONENTS ================= */

function PerfCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-xl border border-white/10 bg-[#ffffff05] p-4">
            <div className="text-xs opacity-60">{label}</div>
            <div className="mt-1 text-lg font-medium">{value}</div>
        </div>
    );
}

function FeaturedProjectCard({ item }: { item: PortfolioItem }) {
    return (
        <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#ffffff05] transition hover:border-[#636EE1]/40 hover:-translate-y-1">

            {/* Thumbnail */}
            <div className="aspect-[16/9] bg-black/30">
                {item.thumbnail ? (
                    <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs opacity-50">
                        No thumbnail
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-1">
                <div className="text-sm font-medium">{item.title}</div>

                <div className="text-xs opacity-70">
                    {item.brandName || "Brand collaboration"}
                    {item.campaignType && ` • ${item.campaignType}`}
                </div>

                {item.outcome?.summary && (
                    <div className="pt-1 text-xs opacity-80 line-clamp-2">
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
