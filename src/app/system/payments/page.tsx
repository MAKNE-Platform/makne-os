export default function SystemPaymentsPage() {
    return (
        <div className="mx-auto max-w-xl px-6 py-8">
            <h1 className="text-xl font-semibold mb-4">
                System Payments
            </h1>

            <p className="text-sm text-muted-foreground mb-6">
                Run the payment processor to release eligible payments.
            </p>

            <p className="text-xs text-red-500">
                System key loaded: {process.env.NEXT_PUBLIC_SYSTEM_KEY ? "YES" : "NO"}
            </p>


            <form method="POST" action="/api/system/payments/auto-release">
                <input
                    type="hidden"
                    name="systemKey"
                    value={process.env.NEXT_PUBLIC_SYSTEM_KEY}
                />

                <button
                    type="submit"
                    className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
                >
                    Run Payment Processor
                </button>
            </form>

        </div>
    );
}
