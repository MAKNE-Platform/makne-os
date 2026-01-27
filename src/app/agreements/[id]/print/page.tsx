import mongoose from "mongoose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Agreement } from "@/lib/db/models/Agreement";
import { Milestone } from "@/lib/db/models/Milestone";
import { User } from "@/lib/db/models/User";

type AgreementType = {
    _id: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    deliverables?: string;
    status: string;
    brandId: mongoose.Types.ObjectId;
    creatorId?: mongoose.Types.ObjectId;
    creatorEmail?: string;
    policies?: {
        paymentTerms?: string;
        cancellationPolicy?: string;
        revisionPolicy?: string;
        usageRights?: string;
    };
};

type BrandUserType = {
    email: string;
};


export default async function AgreementPrintPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_session")?.value;

    if (!userId) redirect("/auth/login");

    await connectDB();

    const agreement = (await Agreement.findById(
        new mongoose.Types.ObjectId(id)
    ).lean()) as AgreementType | null;

    if (!agreement) redirect("/agreements");

    const isBrand = agreement.brandId.toString() === userId;
    const isCreator = agreement.creatorId?.toString() === userId;

    if (!isBrand && !isCreator) redirect("/dashboard");

    const brand = (await User.findById(
        agreement.brandId
    ).lean()) as BrandUserType | null;

    const milestones = await Milestone.find({
        agreementId: agreement._id,
    }).lean();

    return (
        <div className="print-root">
            {/* PRINT STYLES */}
            <style>{`
  @media print {
    body {
      background: white !important;
      color: black !important;
    }
  }

  .print-root {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px;
    background: white;
    color: black;
    font-family: Arial, sans-serif;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 8px;
  }

  h2 {
    font-size: 18px;
    margin-top: 24px;
    margin-bottom: 8px;
  }

  p {
    margin: 4px 0;
    font-size: 14px;
  }

  .section {
    margin-top: 20px;
  }

  .milestone {
    margin-bottom: 12px;
  }
`}</style>


            <h1>{agreement.title}</h1>
            <p><b>Status:</b> {agreement.status}</p>

            <div className="section">
                <p><b>Brand:</b> {brand?.email}</p>
                {agreement.creatorEmail && (
                    <p><b>Creator:</b> {agreement.creatorEmail}</p>
                )}
            </div>

            {agreement.description && (
                <div className="section">
                    <h2>Description</h2>
                    <p>{agreement.description}</p>
                </div>
            )}

            {agreement.deliverables && (
                <div className="section">
                    <h2>Deliverables</h2>
                    <p>{agreement.deliverables}</p>
                </div>
            )}

            <div className="section">
                <h2>Milestones</h2>
                {milestones.map((m: any) => (
                    <div key={m._id} className="milestone">
                        <p>
                            <b>{m.title}</b> — ₹{m.amount} ({m.status})
                        </p>
                        {m.description && <p>{m.description}</p>}
                    </div>
                ))}
            </div>

            {agreement.policies && (
                <div className="section">
                    <h2>Policies</h2>
                    {agreement.policies.paymentTerms && (
                        <p><b>Payment:</b> {agreement.policies.paymentTerms}</p>
                    )}
                    {agreement.policies.cancellationPolicy && (
                        <p><b>Cancellation:</b> {agreement.policies.cancellationPolicy}</p>
                    )}
                    {agreement.policies.revisionPolicy && (
                        <p><b>Revisions:</b> {agreement.policies.revisionPolicy}</p>
                    )}
                    {agreement.policies.usageRights && (
                        <p><b>Usage:</b> {agreement.policies.usageRights}</p>
                    )}
                </div>
            )}
        </div>
    );
}
