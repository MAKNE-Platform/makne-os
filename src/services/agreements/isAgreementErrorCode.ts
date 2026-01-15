// services/agreements/isAgreementErrorCode.ts
import { AgreementErrorCode } from "./agreementErrors";
import { AGREEMENT_ERROR_MESSAGES } from "@/services/agreements/agreementErrors";


export function isAgreementErrorCode(
  value: unknown
): value is AgreementErrorCode {
  return (
    typeof value === "string" &&
    value in AGREEMENT_ERROR_MESSAGES
  );
}
