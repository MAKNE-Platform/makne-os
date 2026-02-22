import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { saveDeliverablesAction } from "./actions";

export default async function DeliverablesPage() {
    const cookieStore = await cookies();
    const role = cookieStore.get("user_role")?.value;
    const agreementId = cookieStore.get("draft_agreement_id")?.value;
    

    if (role !== "BRAND") {
        redirect("/auth/login");
    }

    if (!agreementId) {
        redirect("/brand/dashboard");
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#0b0f1a] via-[#0e1324] to-[#151933] px-6 py-16">

            {/* Subtle MAKNE Glow */}
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#636EE1]/20 blur-[120px]" />

            <div className="relative mx-auto max-w-2xl space-y-12">

                {/* HEADER */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-semibold tracking-tight text-white">
                            Define Deliverables
                        </h1>
                        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-zinc-400">
                            Step 2 of 6
                        </span>
                    </div>

                    <p className="text-sm text-zinc-400">
                        Specify what the creator is expected to deliver as part of this collaboration.
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 h-1 w-full rounded-full bg-white/10">
                        <div className="h-full w-2/6 rounded-full bg-[#636EE1]" />
                    </div>
                </div>

                {/* FORM CARD */}
                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                    <form
                        action={saveDeliverablesAction}
                        className="space-y-8"
                    >

                        {/* Deliverable Block */}
                        {[1, 2, 3].map((index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-white/10 bg-[#121420] p-6 space-y-4 transition hover:border-white/20"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-zinc-300">
                                        Deliverable {index}
                                    </h3>
                                    {index === 1 && (
                                        <span className="text-xs text-zinc-500">
                                            Required
                                        </span>
                                    )}
                                </div>

                                <input
                                    name="deliverable_title"
                                    placeholder="e.g. Instagram Reel"
                                    required={index === 1}
                                    className="w-full rounded-2xl border border-white/10 bg-[#0f1322] px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[#636EE1] focus:ring-2 focus:ring-[#636EE1]/30"
                                />

                                <textarea
                                    name="deliverable_description"
                                    placeholder="Description (optional)"
                                    rows={3}
                                    className="w-full resize-none rounded-2xl border border-white/10 bg-[#0f1322] px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[#636EE1] focus:ring-2 focus:ring-[#636EE1]/30"
                                />
                            </div>
                        ))}

                        {/* CTA */}
                        <div className="flex justify-end pt-4">
                            <button
                                className="group relative inline-flex items-center justify-center rounded-2xl bg-[#636EE1] px-8 py-3 text-sm font-medium text-white transition hover:brightness-110 active:scale-[0.98]"
                            >
                                <span className="absolute inset-0 rounded-2xl bg-[#636EE1]/20 blur-md opacity-0 transition group-hover:opacity-60" />
                                <span className="relative">Continue</span>
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}