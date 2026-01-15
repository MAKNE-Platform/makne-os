"use client";

import { useRouter } from "next/navigation";

import { createAgreementAction } from "@/app/(protected)/dashboard/agreements/actions";

import { useState } from "react";
import {
    AGREEMENT_ERROR_MESSAGES,
    AgreementErrorCode,
} from "@/services/agreements/agreementErrors";
import { isAgreementErrorCode } from "@/services/agreements/isAgreementErrorCode";


import MetaStep from "./steps/MetaStep";
import CreatorsStep from "./steps/CreatorsStep";
import DeliverablesStep from "./steps/DeliverablesStep";
import MilestonesStep from "./steps/MilestonesStep";
import PolicyStep from "./steps/PolicyStep";
import PaymentStep from "./steps/PaymentStep";
import ReviewStep from "./steps/ReviewStep";

/**
 * Horizontal step order is FINAL.
 * Do not reorder without backend alignment.
 */
const STEPS = [
    "Meta",
    "Creators",
    "Deliverables",
    "Milestones",
    "Policy",
    "Payment",
    "Review",
] as const;

export default function AgreementCreateFlow() {
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();


    // Collected data
    const [meta, setMeta] = useState<any>(null);
    const [creators, setCreators] = useState<any[]>([]);
    const [deliverables, setDeliverables] = useState<any[]>([]);
    const [milestones, setMilestones] = useState<any[]>([]);
    const [policy, setPolicy] = useState<any>(null);
    const [payment, setPayment] = useState<any>(null);
    const [paymentSplits, setPaymentSplits] = useState<any[]>([]);

    function goNext() {
        setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }

    function goBack() {
        setStep((s) => Math.max(s - 1, 0));
    }

    function canGoNext() {
        switch (step) {
            case 0:
                return meta && meta.title?.trim().length >= 3;
            case 1:
                return true;
            case 2:
                return deliverables.length > 0;
            case 3:
                return milestones.length > 0;
            case 4:
                return policy && policy.revisionLimit >= 0;
            case 5:
                if (!payment || payment.totalAmount <= 0) return false;
                const splitTotal = paymentSplits.reduce(
                    (s, p) => s + p.amount,
                    0
                );
                return (
                    paymentSplits.length > 0 &&
                    splitTotal <= payment.totalAmount
                );
            default:
                return true;
        }
    }

    function resetForm() {
        setStep(0);
        setMeta(null);
        setCreators([]);
        setDeliverables([]);
        setMilestones([]);
        setPolicy(null);
        setPayment(null);
        setPaymentSplits([]);
    }

    async function handleSubmit() {
        setLoading(true);
        setError(null);

        try {
            await createAgreementAction({
                meta,
                creators,
                deliverables,
                milestones,
                policy,
                payment,
                paymentSplits,
            });

            resetForm();
            router.replace("/dashboard/agreements");

        } catch (err: unknown) {
            const code =
                typeof err === "object" &&
                    err !== null &&
                    "errorCode" in err &&
                    typeof (err as any).errorCode === "string"
                    ? (err as any).errorCode
                    : null;

            if (code && code in AGREEMENT_ERROR_MESSAGES) {
                setError(AGREEMENT_ERROR_MESSAGES[code as AgreementErrorCode]);
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
        finally {
            setLoading(false);
        }
    }



    return (
        <div className="min-h-screen max-w-[900px] mx-auto my-6 sm:my-10 px-4">
            {/* Header */}
            <h1 className="text-2xl sm:text-[28px] font-semibold mb-2">
                Create Agreement
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 mb-6 sm:mb-8">
                Follow the steps below to define and send an agreement.
            </p>

            {/* Horizontal Stepper (scrollable on mobile) */}
            <div className="mb-6 sm:mb-8 overflow-x-auto">
                <div className="flex gap-6 min-w-max border-b border-neutral-200 pb-2">
                    {STEPS.map((label, index) => {
                        const isActive = index === step;
                        const isCompleted = index < step;

                        return (
                            <div
                                key={label}
                                className={[
                                    "pb-1 whitespace-nowrap cursor-default text-sm sm:text-base",
                                    isActive
                                        ? "border-b-2 border-neutral-900 text-neutral-900 font-semibold"
                                        : "border-b-2 border-transparent",
                                    !isActive && isCompleted
                                        ? "text-neutral-600"
                                        : !isActive
                                            ? "text-neutral-400"
                                            : "",
                                ].join(" ")}
                            >
                                {label}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Error */}
            {error && (
                <p className="text-sm text-red-600 mb-4">
                    {error}
                </p>
            )}

            {/* Step Content */}
            <div className="mb-24 sm:mb-8">
                {step === 0 && <MetaStep value={meta} onChange={setMeta} />}
                {step === 1 && (
                    <CreatorsStep value={creators} onChange={setCreators} />
                )}
                {step === 2 && (
                    <DeliverablesStep
                        value={deliverables}
                        onChange={setDeliverables}
                    />
                )}
                {step === 3 && (
                    <MilestonesStep
                        deliverables={deliverables}
                        value={milestones}
                        onChange={setMilestones}
                    />
                )}
                {step === 4 && (
                    <PolicyStep value={policy} onChange={setPolicy} />
                )}
                {step === 5 && (
                    <PaymentStep
                        payment={payment}
                        splits={paymentSplits}
                        milestones={milestones}
                        onPaymentChange={setPayment}
                        onSplitsChange={setPaymentSplits}
                    />
                )}
                {step === 6 && (
                    <ReviewStep
                        meta={meta}
                        creators={creators}
                        deliverables={deliverables}
                        milestones={milestones}
                        policy={policy}
                        payment={payment}
                        paymentSplits={paymentSplits}
                    />
                )}
            </div>

            {/* Navigation */}
            <div className="fixed sm:static bottom-0 left-0 right-0 sm:bottom-auto bg-black sm:bg-transparent border-t sm:border-0 border-neutral-200 z-10 px-4 py-3 sm:p-0">
                <div className="max-w-[900px] mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 sm:justify-between">
                    {step > 0 ? (
                        <button
                            onClick={goBack}
                            disabled={loading}
                            className="w-full sm:w-auto px-4 py-2 rounded-md border border-neutral-300 bg-transparent text-sm"
                        >
                            Back
                        </button>
                    ) : (
                        <div className="hidden sm:block" />
                    )}

                    {step < STEPS.length - 1 && (
                        <button
                            onClick={goNext}
                            disabled={!canGoNext() || loading}
                            className={[
                                "w-full sm:w-auto px-5 py-2 rounded-md text-sm text-white",
                                canGoNext()
                                    ? "bg-neutral-900"
                                    : "bg-neutral-400 cursor-not-allowed",
                            ].join(" ")}
                        >
                            Next
                        </button>
                    )}

                    {step === STEPS.length - 1 && (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full sm:w-auto px-5 py-2 rounded-md text-sm text-white bg-neutral-900"
                        >
                            {loading ? "Creating..." : "Create Agreement"}
                        </button>
                    )}
                </div>
            </div>

        </div>
    );

}
