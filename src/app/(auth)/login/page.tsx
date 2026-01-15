import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm animate-fade-in">

      <h1 className="text-2xl font-medium text-zinc-100">
        Welcome back
      </h1>

      <p className="mt-2 text-zinc-400 text-sm">
        Log in to your Makne account.
      </p>

      <form className="mt-8 space-y-4">
        <input
          type="email"
          placeholder="Email address"
          className="
  w-full rounded-xl bg-[#161618]
  border border-white/5
  px-4 py-3 text-sm text-zinc-100
  placeholder:text-zinc-500
  focus:outline-none
  focus:border-white/20
  focus:ring-2
  focus:ring-white/10
  transition
"

        />

        <button
          type="submit"
          className="
  w-full mt-2 rounded-xl
  bg-white text-black
  py-3 text-sm font-medium
  hover:bg-zinc-100
  active:scale-[0.98]
  transition
"

        >
          Continue
        </button>
      </form>

      <p className="mt-6 text-sm text-zinc-400">
        Don’t have an account?{" "}
        <Link
          href="/signup"
          className="text-white hover:underline underline-offset-4 transition"
        >
          Sign up
        </Link>

      </p>
    </div>
  );
}
