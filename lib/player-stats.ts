// Default combine/measurable suggestions per sport, keyed by Sport.slug.
// The live, admin-editable list lives on Sport.statSuggestions in the
// database (see /admin/stat-suggestions) -- this is only the original seed
// data, used by prisma/seed.ts and as the "Reset to defaults" option in
// that admin page. Purely a UX aid either way: the underlying stat is
// still a free-form { label, value } pair, so an unlisted sport (or a
// custom stat) just falls back to free text instead of being blocked.
export const DEFAULT_SPORT_STAT_SUGGESTIONS: Record<string, string[]> = {
  football: [
    "40-Yard Dash",
    "10-Yard Split",
    "Shuttle",
    "3-Cone Drill",
    "Broad Jump",
    "Vertical Jump",
    "Bench Press (reps)",
  ],
  baseball: [
    "60-Yard Dash",
    "Exit Velocity",
    "Throwing Velocity",
    "Pop Time",
    "Home to First",
  ],
  softball: [
    "60-Yard Dash",
    "Home to First",
    "Exit Velocity",
    "Throwing Velocity",
    "Pop Time",
  ],
  basketball: [
    "Vertical Jump",
    "Standing Reach",
    "Wingspan",
    "Lane Agility",
    "3/4 Court Sprint",
  ],
  soccer: ["40-Yard Dash", "Beep Test Level", "Vertical Jump", "5-10-5 Agility"],
  volleyball: ["Vertical Jump", "Approach Jump", "Standing Reach", "Block Touch"],
  "track-and-field": [
    "100m",
    "200m",
    "400m",
    "800m",
    "1600m",
    "3200m",
    "Long Jump",
    "Triple Jump",
    "High Jump",
    "Shot Put",
    "Discus",
  ],
  lacrosse: ["40-Yard Dash", "Shuttle", "Vertical Jump", "Shot Speed"],
  wrestling: ["Takedowns per Match", "Pin Percentage"],
  tennis: ["UTR Rating", "Serve Speed"],
  golf: ["Handicap Index", "Driving Distance", "Scoring Average"],
  swimming: ["50 Free", "100 Free", "200 Free", "100 Back", "100 Breast", "100 Fly", "200 IM"],
};

export const CUSTOM_STAT_VALUE = "__custom__";
