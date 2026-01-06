"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-2">
        Something went wrong
      </h2>

      <p className="text-sm text-neutral-600 mb-4">
        {error.message}
      </p>

      <button
        onClick={reset}
        className="px-4 py-2 rounded-md bg-neutral-900 text-white text-sm"
      >
        Try again
      </button>
    </div>
  );
}
