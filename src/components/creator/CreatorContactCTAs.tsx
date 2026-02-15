type Props = {
  email: string;
  portfolioLink?: string;
};

export default function CreatorContactCTAs({
  email,
  portfolioLink,
}: Props) {
  return (
    <div className="mt-10 space-y-4">

      <div className="text-sm uppercase tracking-wide opacity-50">
        Contact
      </div>

      <div className="flex flex-wrap gap-3">

        {/* Email */}
        <a
          href={`mailto:${email}`}
          className="
            rounded-full
            border border-white/20
            px-4 py-2
            text-sm
            hover:border-[#636EE1]
            hover:text-[#636EE1]
            transition
          "
        >
          Email
        </a>

        {/* External portfolio */}
        {portfolioLink && (
          <a
            href={portfolioLink}
            target="_blank"
            rel="noopener noreferrer"
            className="
              rounded-full
              border border-white/20
              px-4 py-2
              text-sm
              hover:border-[#636EE1]
              hover:text-[#636EE1]
              transition
            "
          >
            Portfolio link
          </a>
        )}

        {/* Future internal CTA */}
        <button
          disabled
          className="
            rounded-full
            border border-white/10
            px-4 py-2
            text-sm
            opacity-40
            cursor-not-allowed
          "
        >
          Message on Makne
        </button>

      </div>
    </div>
  );
}
