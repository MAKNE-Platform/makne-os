"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function GlobalToastHandler({
    toastType,
}: {
    toastType: string | null;
}) {
    useEffect(() => {
        if (!toastType) return;

        switch (toastType) {
            case "LOGIN_SUCCESS":
                toast.success("Logged in successfully 🎉");
                break;

            case "LOGOUT_SUCCESS":
                toast.success("Logged out successfully");
                break;

            case "OTP_SENT":
                toast.success("OTP sent to your email 📩");
                break;

            case "VERIFICATION_SUCCESS":
                toast.success("Email verified successfully 🚀");
                break;

                case "PASSWORD_SET":
                toast.success("Account password set successfully 🚀");
                break;

            case "SIGNUP_SUCCESS":
                toast.success("Account created successfully 🚀");
                break;
        }

        // Delete cookie from client
        document.cookie =
            "toast=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    }, [toastType]);

    return null;
}