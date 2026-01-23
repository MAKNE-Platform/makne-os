import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
};

export default function Button({
  children,
  href,
  variant = "primary",
}: ButtonProps) {
  const baseStyles =
    "rounded-full px-6 py-2 text-sm font-medium transition";

  const variantStyles =
    variant === "primary"
      ? "bg-[#636EE1] hover:opacity-90"
      : "border border-white/20 hover:bg-white/5";

  const className = `${baseStyles} ${variantStyles}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return <button className={className}>{children}</button>;
}
