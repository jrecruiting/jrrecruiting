export const PLAYER_PROJECTIONS = [
  { value: "FBS", label: "FBS" },
  { value: "FCS", label: "FCS" },
  { value: "D2", label: "D2" },
  { value: "D3", label: "D3" },
  { value: "NAIA", label: "NAIA" },
] as const;

export type PlayerProjectionValue = (typeof PLAYER_PROJECTIONS)[number]["value"];
