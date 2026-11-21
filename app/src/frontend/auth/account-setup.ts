export function accountSetupIsComplete(data: unknown): boolean {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  if ("accountSetupComplete" in data) {
    return data.accountSetupComplete === true;
  }
  return true;
}
