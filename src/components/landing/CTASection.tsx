import Button from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="border-t border-white/10 px-6 py-20 text-center">
      <h2 className="text-2xl font-medium">
        Ready to collaborate with clarity?
      </h2>

      <p className="mt-3 text-sm text-gray-400">
        Create agreements, track execution, and release payments with confidence.
      </p>

      <div className="mt-6">
        <Button href="/auth">Create an Account</Button>
      </div>
    </section>
  );
}
