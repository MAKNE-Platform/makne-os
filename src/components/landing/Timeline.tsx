"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";

const timelineItems = [
    {
        title: "All started here",
        description:
            "Every system begins with a problem worth solving. MAKNE started as a need for clarity.",
        visual: "/timeline/idea.png",
    },
    {
        title: "First concept",
        description:
            "Agreements were designed as structured systems, not documents.",
        visual: "/timeline/blueprint.png",
    },
    {
        title: "When things got serious",
        description:
            "Execution, approvals, and payments were unified into one flow.",
        visual: "/timeline/workflow.png",
    },
];

export default function Timeline() {
    const ref = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start center", "end center"],
    });

    /* Progress line */
    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    /* Map scroll → active item index */
    useMotionValueEvent(scrollYProgress, "change", (v) => {
        const index = Math.min(
            timelineItems.length - 1,
            Math.floor(v * timelineItems.length)
        );
        setActiveIndex(index);
    });

    return (
        <section
            ref={ref}
            className="relative px-6 py-40 border-t border-white/5"
        >
            <div className="mx-auto max-w-6xl lg:max-w-7xl">

                {/* Heading */}
                <div className="mb-24">
                    <div className="mb-3 text-xs uppercase tracking-wide text-zinc-500">
                        Timeline
                    </div>
                    <h2 className="text-3xl md:text-4xl font-medium text-zinc-100">
                        Our journey
                    </h2>
                </div>

                {/* Main layout */}
                <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-24">

                    {/* ================= LEFT: TIMELINE ================= */}
                    <div className="relative grid grid-cols-[40px_1fr] lg:grid-cols-[64px_1fr] gap-x-16">

                        {/* Spine */}
                        <div className="relative flex justify-center">
                            <div className="absolute top-0 h-full w-px bg-white/10" />
                            <motion.div
                                className="absolute top-0 w-px bg-[#636EE1]/80"
                                style={{ height: lineHeight }}
                            />
                        </div>

                        {/* Items */}
                        <div className="flex flex-col gap-32">
                            {timelineItems.map((item, index) => (
                                <TimelineItem
                                    key={index}
                                    item={item}
                                    isActive={index === activeIndex}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ================= RIGHT: STICKY VISUAL (LG+) ================= */}
                    <div className="hidden lg:block relative">
                        <div className="sticky top-50">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="relative h-72 w-full rounded-xl overflow-hidden border border-white/5 bg-[#0E1117]"
                            >
                                <img
                                    src={timelineItems[activeIndex].visual}
                                    alt=""
                                    className="h-full w-full object-cover opacity-90"
                                />
                            </motion.div>
                        </div>
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
