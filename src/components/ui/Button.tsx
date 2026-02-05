import Link from "next/link";

export interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200";

  const variants = {
    primary: "bg-[#636EE1] text-white hover:brightness-110",
    secondary:
      "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
  };

  const styles = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return <button className={styles}>{children}</button>;
}
