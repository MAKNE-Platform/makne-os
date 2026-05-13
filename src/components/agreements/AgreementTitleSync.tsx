"use client";

import { useEffect } from "react";

export default function AgreementTitleSync() {
  useEffect(() => {
    const input = document.querySelector(
      'input[name="title"]'
    ) as HTMLInputElement | null;

    if (!input) return;

    const sync = () => {
      localStorage.setItem(
        "agreementTitle",
        input.value
      );
    };

    sync();

    input.addEventListener("input", sync);

    return () => {
      input.removeEventListener(
        "input",
        sync
      );
    };
  }, []);

  return null;
}