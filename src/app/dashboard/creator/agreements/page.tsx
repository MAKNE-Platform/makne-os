import { reduceAgreement } from "@/core/agreements/aggregate";
import { deriveAgreementState } from "@/core/agreements/state";
import { loadEvents } from "@/core/events/dispatcher";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/core/auth/contract";

/**
 * Load agreement IDs where this creator is assigned
 */
async function loadCreatorAgreementIds(
  creatorId: string
): Promise<string[]> {
  const db = await (await import("@/lib/db")).getDb();

  const events = await db
    .collection("events")
    .find({
      type: "AGREEMENT_PARTY_ASSIGNED",
      "payload.creatorId": creatorId,
    })
    .toArray();

  return [...new Set(events.map((e) => e.agreementId))];
}

export default async function CreatorAgreementsPage() {
  const user = await getCurrentUser();

  // ✅ BUILD-SAFE auth gate
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "CREATOR") {
    redirect("/dashboard");
  }

  const creatorId = user.userId;

  const agreementIds = await loadCreatorAgreementIds(creatorId);

  const invited: any[] = [];
  const accepted: any[] = [];

  for (const agreementId of agreementIds) {
    const events = await loadEvents(agreementId);
    if (!events.length) continue;

    const state = reduceAgreement(events);
    const uiState = deriveAgreementState(
      events.map((e) => ({ type: e.type }))
    );

    // Skip rejected agreements
    if (state.status === "REJECTED") continue;

    if (
      uiState === "NEGOTIATING" &&
      !state.acceptedByCreators.includes(creatorId)
    ) {
      invited.push({
        agreementId,
        title: state.meta?.title ?? "Untitled agreement",
      });
    }

    if (
      uiState === "ACTIVE" &&
      state.acceptedByCreators.includes(creatorId)
    ) {
      accepted.push({
        agreementId,
        title: state.meta?.title ?? "Untitled agreement",
      });
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-2xl font-semibold">My Agreements</h1>

      {/* INVITED */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Invited Agreements</h2>

        {invited.length === 0 ? (
          <p className="text-sm text-neutral-500">
            You have no pending invitations.
          </p>
        ) : (
          <ul className="space-y-3">
            {invited.map((a) => (
              <li
                key={a.agreementId}
                className="border rounded-lg p-4 hover:bg-neutral-50 transition"
              >
                <Link
                  href={`/dashboard/creator/agreements/${a.agreementId}`}
                  className="block"
                >
                  <div className="font-medium">{a.title}</div>
                  <div className="text-sm text-neutral-500 mt-1">
                    Invitation pending
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ACCEPTED */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Accepted Agreements</h2>

        {accepted.length === 0 ? (
          <p className="text-sm text-neutral-500">
            You haven’t accepted any agreements yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {accepted.map((a) => (
              <li
                key={a.agreementId}
                className="border rounded-lg p-4 hover:bg-neutral-50 transition"
              >
                <Link
                  href={`/dashboard/creator/agreements/${a.agreementId}`}
                  className="block"
                >
                  <div className="font-medium">{a.title}</div>
                  <div className="text-sm text-green-600 mt-1">
                    Active
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
