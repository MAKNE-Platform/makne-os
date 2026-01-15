import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="bg-[#0B0B0C] text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0B0B0C]/80 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src="/makne_logo.jpg" alt="Makne" className="h-8" />

          <nav className="hidden md:flex gap-8 text-sm text-zinc-400">
            <a href="#features" className="hover:text-zinc-200">Features</a>
            <a href="#how-it-works" className="hover:text-zinc-200">How it works</a>
            <a href="#pricing" className="hover:text-zinc-200">Pricing</a>
          </nav>

          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-full text-sm text-zinc-300 hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-medium leading-tight">
            Agreements that power modern creator collaborations.
          </h1>

          <p className="mt-6 text-lg text-zinc-400">
            Create structured agreements, track deliverables, and release payments
            automatically — all in one system.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-full bg-white text-black text-sm font-medium"
            >
              Get started
            </Link>

            <Link
              href="/login"
              className="px-6 py-3 rounded-full border border-white/10 text-sm text-zinc-300 hover:text-white"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-32 px-6 border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto space-y-32">

          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium">
                Structured agreements
              </h2>
              <p className="mt-4 text-zinc-400 text-lg">
                Define deliverables, milestones, and expectations clearly from day one.
                No vague terms, no missed details — everything is explicit and tracked.
              </p>
            </div>

            <div className="h-64 rounded-2xl bg-[#161618] border border-white/5 flex items-center justify-center text-zinc-500">
              Feature visual
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-16 items-center md:flex-row-reverse">
            <div className="md:order-2">
              <h2 className="text-3xl md:text-4xl font-medium">
                Event-based timeline
              </h2>
              <p className="mt-4 text-zinc-400 text-lg">
                Every action is recorded as an event — assignments, acceptances,
                submissions, approvals, and payments. Nothing is hidden or overwritten.
              </p>
            </div>

            <div className="md:order-1 h-64 rounded-2xl bg-[#161618] border border-white/5 flex items-center justify-center text-zinc-500">
              Timeline visual
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium">
                Automatic payments
              </h2>
              <p className="mt-4 text-zinc-400 text-lg">
                Payments are released automatically when milestones are completed.
                No chasing, no disputes — just deterministic execution.
              </p>
            </div>

            <div className="h-64 rounded-2xl bg-[#161618] border border-white/5 flex items-center justify-center text-zinc-500">
              Payment flow
            </div>
          </div>

        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="py-32 px-6 border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-medium">
            How it works
          </h2>

          <p className="mt-4 text-zinc-400 text-lg max-w-2xl mx-auto">
            Makne turns collaborations into structured workflows — from agreement
            creation to automatic payout.
          </p>

          <div className="mt-20 grid gap-8 md:grid-cols-4 text-left">

            {/* Step 1 */}
            <div className="rounded-2xl bg-[#161618] border border-white/5 p-6">
              <div className="text-sm text-zinc-500">01</div>
              <h3 className="mt-4 text-lg font-medium">
                Create an agreement
              </h3>
              <p className="mt-2 text-zinc-400 text-sm">
                Define deliverables, milestones, timelines, and payment terms
                in a structured agreement.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl bg-[#161618] border border-white/5 p-6">
              <div className="text-sm text-zinc-500">02</div>
              <h3 className="mt-4 text-lg font-medium">
                Assign a creator
              </h3>
              <p className="mt-2 text-zinc-400 text-sm">
                Invite the creator to review and accept the agreement
                before any work begins.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl bg-[#161618] border border-white/5 p-6">
              <div className="text-sm text-zinc-500">03</div>
              <h3 className="mt-4 text-lg font-medium">
                Track milestones
              </h3>
              <p className="mt-2 text-zinc-400 text-sm">
                Monitor submissions, approvals, and progress through
                an immutable event timeline.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-2xl bg-[#161618] border border-white/5 p-6">
              <div className="text-sm text-zinc-500">04</div>
              <h3 className="mt-4 text-lg font-medium">
                Release payment
              </h3>
              <p className="mt-2 text-zinc-400 text-sm">
                Payments are released automatically once milestones
                are completed and approved.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="py-32 px-6 border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-medium">
            Pricing
          </h2>

          <p className="mt-4 text-zinc-400 text-lg max-w-2xl mx-auto">
            Simple, transparent pricing designed to scale with your collaborations.
          </p>

          <div className="mt-20 grid gap-8 md:grid-cols-3 text-left">

            {/* Starter */}
            <div className="rounded-2xl bg-[#161618] border border-white/5 p-8 flex flex-col">
              <h3 className="text-xl font-medium">Starter</h3>
              <p className="mt-2 text-zinc-400 text-sm">
                For individual creators and small collaborations.
              </p>

              <div className="mt-6 text-3xl font-medium">
                Free
              </div>

              <ul className="mt-6 space-y-3 text-sm text-zinc-400">
                <li>• Basic agreements</li>
                <li>• Milestone tracking</li>
                <li>• Event timeline</li>
                <li>• Limited active agreements</li>
              </ul>

              <a
                href="/signup"
                className="mt-8 inline-flex justify-center px-4 py-2 rounded-full bg-white text-black text-sm font-medium"
              >
                Get started
              </a>
            </div>

            {/* Professional */}
            <div className="rounded-2xl bg-[#1C1C1F] border border-white/10 p-8 flex flex-col scale-[1.03]">
              <h3 className="text-xl font-medium">Professional</h3>
              <p className="mt-2 text-zinc-400 text-sm">
                For brands managing multiple creators and campaigns.
              </p>

              <div className="mt-6 text-3xl font-medium">
                ₹— / month
              </div>

              <ul className="mt-6 space-y-3 text-sm text-zinc-400">
                <li>• Unlimited agreements</li>
                <li>• Advanced milestones</li>
                <li>• Automatic payments</li>
                <li>• Priority support</li>
              </ul>

              <a
                href="/signup"
                className="mt-8 inline-flex justify-center px-4 py-2 rounded-full bg-white text-black text-sm font-medium"
              >
                Start free trial
              </a>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl bg-[#161618] border border-white/5 p-8 flex flex-col">
              <h3 className="text-xl font-medium">Enterprise</h3>
              <p className="mt-2 text-zinc-400 text-sm">
                For organizations with custom workflows and compliance needs.
              </p>

              <div className="mt-6 text-3xl font-medium">
                Custom
              </div>

              <ul className="mt-6 space-y-3 text-sm text-zinc-400">
                <li>• Custom agreement logic</li>
                <li>• Dedicated support</li>
                <li>• SLA & compliance</li>
                <li>• Custom integrations</li>
              </ul>

              <a
                href="#"
                className="mt-8 inline-flex justify-center px-4 py-2 rounded-full border border-white/10 text-sm text-zinc-300 hover:text-white"
              >
                Contact sales
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Trust / System */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-medium">
            Built for trust and clarity
          </h2>

          <p className="mt-6 text-zinc-400 text-lg max-w-3xl mx-auto">
            Makne is designed around an event-based agreement system.
            Every action — from assignment to approval to payment — is
            recorded, traceable, and deterministic.
          </p>

          <div className="mt-20 grid gap-8 md:grid-cols-3 text-left">
            <div className="rounded-2xl bg-[#161618] border border-white/5 p-6">
              <h3 className="text-lg font-medium">Event-sourced agreements</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Agreements evolve through recorded events, not mutable states.
                What happened stays visible forever.
              </p>
            </div>

            <div className="rounded-2xl bg-[#161618] border border-white/5 p-6">
              <h3 className="text-lg font-medium">Immutable timelines</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Every milestone, submission, and decision has a permanent
                place in the agreement timeline.
              </p>
            </div>

            <div className="rounded-2xl bg-[#161618] border border-white/5 p-6">
              <h3 className="text-lg font-medium">Deterministic execution</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Payments and transitions follow predefined rules —
                no manual overrides, no ambiguity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-medium leading-tight">
            Ready to run your collaborations with clarity?
          </h2>

          <p className="mt-6 text-zinc-400 text-lg">
            Start with a structured agreement and let Makne handle the rest.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <a
              href="/signup"
              className="px-8 py-3 rounded-full bg-white text-black text-sm font-medium"
            >
              Get started
            </a>

            <a
              href="/login"
              className="px-8 py-3 rounded-full border border-white/10 text-sm text-zinc-300 hover:text-white"
            >
              Login
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 text-sm text-zinc-400">
          <div>
            <img src="/makne_logo.jpg" alt="Makne" className="h-6 mb-4" />
            <p className="max-w-xs">
              Structured agreements and automated execution for modern creator
              collaborations.
            </p>
          </div>

          <div className="flex gap-12">
            <div className="space-y-2">
              <div className="text-zinc-200 font-medium">Product</div>
              <a href="#features" className="block hover:text-white">Features</a>
              <a href="#how-it-works" className="block hover:text-white">How it works</a>
              <a href="#pricing" className="block hover:text-white">Pricing</a>
            </div>

            <div className="space-y-2">
              <div className="text-zinc-200 font-medium">Company</div>
              <a href="#" className="block hover:text-white">About</a>
              <a href="#" className="block hover:text-white">Contact</a>
            </div>

            <div className="space-y-2">
              <div className="text-zinc-200 font-medium">Legal</div>
              <a href="#" className="block hover:text-white">Privacy</a>
              <a href="#" className="block hover:text-white">Terms</a>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
