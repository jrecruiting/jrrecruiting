export const PLAYER_TYPES = [
  { value: "HIGH_SCHOOL", label: "High School" },
  { value: "JUCO", label: "JUCO" },
  { value: "TRANSFER", label: "Transfer" },
] as const;

export type PlayerTypeValue = (typeof PLAYER_TYPES)[number]["value"];

export function playerTypeLabel(value: string): string {
  return PLAYER_TYPES.find((t) => t.value === value)?.label ?? value;
}
