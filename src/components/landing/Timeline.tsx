"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";

const timelineItems = [
    {
        title: "Unstructured Collaboration",
        description:
            "Brands and creators relied on chats, informal promises, and fragmented documents. Scope drift, delayed approvals, and payment uncertainty were common.",
        visual: "/timeline/item1.png",
    },
    {
        title: "Defining the Agreement System",
        description:
            "MAKNE introduced agreements as structured digital entities — with explicit deliverables, milestones, states, and conditions defined upfront.",
        visual: "/timeline/item2.png",
    },
    {
        title: "Lifecycle as Infrastructure",
        description:
            "Every agreement operates within a controlled lifecycle: draft, review, active, completed. Status is not implied, it is enforced.",
        visual: "/timeline/item3.png",
    },
    {
        title: "Milestones with State Logic",
        description:
            "Submission, revision, approval, and release flows were unified into a deterministic system. Work progression and payment release are programmatically aligned.",
        visual: "/timeline/item4.png",
    },
    {
        title: "Embedded Trust Mechanisms",
        description:
            "Escrow-style controls, visible progress tracking, and gated releases ensure accountability across both parties, by design.",
        visual: "/timeline/item5.png",
    },
    {
        title: "Operational Infrastructure",
        description:
            "Dashboards, wallet systems, creator management, and agreement governance formed a cohesive platform. Collaboration became predictable.",
        visual: "/timeline/item6.png",
    },
];

export default function Timeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"],
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        const index = Math.min(
            timelineItems.length - 1,
            Math.floor(v * timelineItems.length)
        );
        setActiveIndex(index);
    });


    const [isInView, setIsInView] = useState(false);

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        setIsInView(v > 0.1 && v < 0.90);
    });

    return (
        <section
            ref={containerRef}
            className="relative px-6 py-40 border-t border-white/5"
        >
            <div className="mx-auto max-w-7xl">

                {/* Heading */}
                <div className="mb-24">
                    <div className="mb-3 text-xs uppercase tracking-wide text-zinc-500">
                        Timeline
                    </div>
                    <h2 className="text-3xl md:text-4xl font-medium text-zinc-100">
                        The Evolution of Structured Trust
                    </h2>
                    <p className="mt-4 max-w-2xl text-zinc-400">
                        MAKNE was built to replace ambiguity with systems.
                        What began as a need for clarity became a framework for reliable collaboration.
                    </p>
                </div>

                {/* Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-24">

                    {/* LEFT SIDE */}
                    <div className="relative grid grid-cols-[40px_1fr] lg:grid-cols-[64px_1fr] gap-x-16">

                        {/* Spine */}
                        <div className="relative flex justify-center">
                            <div className="absolute top-0 h-full w-px bg-white/10" />
                            <motion.div
                                className="absolute top-0 w-px bg-[#636EE1]"
                                style={{ height: lineHeight }}
                            />
                        </div>

                        {/* Items */}
                        <div className="flex flex-col gap-32">
                            {timelineItems.map((item, index) => (
                                <div key={index} className="relative">

                                    <h3
                                        className={`text-xl font-medium ${index === activeIndex
                                            ? "text-zinc-100"
                                            : "text-zinc-400"
                                            }`}
                                    >
                                        {item.title}
                                    </h3>

                                    <p className="mt-3 max-w-xl text-zinc-500 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ================= RIGHT: TRUE PIN ================= */}
                    <div className="hidden lg:block relative">
                        {isInView && (
                            <motion.div
                                style={{
                                    position: "fixed",
                                    top: "50%",
                                    right: "max( calc((100vw - 1280px) / 2), 24px )",
                                    transform: "translateY(-50%)",
                                }}
                                className="w-[420px] rounded-2xl overflow-hidden"
                            >

                                <div className="bg-[#636EE1] h-35 w-35 absolute top-50 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-1 blur-3xl rounded-full" />
                                <motion.img
                                    key={activeIndex}
                                    src={timelineItems[activeIndex].visual}
                                    alt=""
                                    initial={{ opacity: 0, scale: 0.92, rotate: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.92 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full h-auto object-contain p-12"
                                />
                            </motion.div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}

/* ================= Timeline Item ================= */

function TimelineItem({
    item,
    isActive,
}: {
    item: { title: string; description: string };
    isActive: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0.3, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
        >
            {/* Branch rule */}
            <div className="absolute left-[-85px] top-4 w-16 lg:left-[-95px] lg:w-20">
                <div
                    className={`h-px w-full ${isActive ? "bg-[#636EE1]/80" : "bg-white/30"
                        }`}
                />
            </div>

            <h3
                className={`text-xl font-medium ${isActive ? "text-zinc-100" : "text-zinc-300"
                    }`}
            >
                {item.title}
            </h3>
            <p className="mt-3 max-w-xl text-zinc-400 leading-relaxed">
                {item.description}
            </p>
        </motion.div>
    );
}
