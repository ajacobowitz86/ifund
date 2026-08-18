export const SERVICE_STATE_CODES = ["NY", "NJ", "PA", "CT", "FL"] as const;

export const SERVICE_STATE_NAMES: Record<(typeof SERVICE_STATE_CODES)[number], string> = {
  NY: "New York",
  NJ: "New Jersey",
  PA: "Pennsylvania",
  CT: "Connecticut",
  FL: "Florida",
};

const ALLOWED_TERMS = new Set<string>([
  ...SERVICE_STATE_CODES,
  ...Object.values(SERVICE_STATE_NAMES),
]);

export const SERVICE_STATES_LABEL =
  "New York, New Jersey, Pennsylvania, Connecticut, and Florida";

export function isAllowedServiceState(codeOrName: string | null | undefined): boolean {
  if (!codeOrName) return false;
  const value = codeOrName.trim();
  if (ALLOWED_TERMS.has(value)) return true;
  return SERVICE_STATE_CODES.some(
    (code) => SERVICE_STATE_NAMES[code].toLowerCase() === value.toLowerCase(),
  );
}

export function predictionIsInServiceStates(prediction: {
  terms?: Array<{ value: string }>;
  description?: string;
}): boolean {
  if (prediction.terms?.some((term) => isAllowedServiceState(term.value))) {
    return true;
  }

  const description = prediction.description ?? "";
  return SERVICE_STATE_CODES.some(
    (code) =>
      new RegExp(`\\b${code}\\b`).test(description) ||
      new RegExp(`\\b${SERVICE_STATE_NAMES[code]}\\b`, "i").test(description),
  );
}

export function addressIsInServiceStates(address: string): boolean {
  return predictionIsInServiceStates({ description: address });
}
