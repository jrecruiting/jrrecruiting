import { PrismaClient } from "@prisma/client";
import { DEFAULT_SPORT_STAT_SUGGESTIONS } from "../lib/player-stats";

const prisma = new PrismaClient();

const sports = [
  {
    name: "Baseball",
    slug: "baseball",
    positions: ["Pitcher", "Catcher", "First Base", "Second Base", "Third Base", "Shortstop", "Outfield"],
  },
  {
    name: "Softball",
    slug: "softball",
    positions: ["Pitcher", "Catcher", "First Base", "Second Base", "Third Base", "Shortstop", "Outfield"],
  },
  {
    name: "Football",
    slug: "football",
    positions: [
      "Quarterback",
      "Running Back",
      "Wide Receiver",
      "Tight End",
      "Offensive Line",
      "Defensive Line",
      "Linebacker",
      "Cornerback",
      "Safety",
      "Kicker/Punter",
    ],
  },
  {
    name: "Basketball",
    slug: "basketball",
    positions: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"],
  },
  {
    name: "Soccer",
    slug: "soccer",
    positions: ["Goalkeeper", "Defender", "Midfielder", "Forward"],
  },
  {
    name: "Volleyball",
    slug: "volleyball",
    positions: ["Setter", "Outside Hitter", "Middle Blocker", "Opposite", "Libero", "Defensive Specialist"],
  },
  {
    name: "Track & Field",
    slug: "track-and-field",
    positions: ["Sprints", "Distance", "Hurdles", "Jumps", "Throws", "Relays"],
  },
  {
    name: "Lacrosse",
    slug: "lacrosse",
    positions: ["Attack", "Midfield", "Defense", "Goalie", "Faceoff"],
  },
  {
    name: "Wrestling",
    slug: "wrestling",
    positions: ["Weight Class"],
  },
  {
    name: "Tennis",
    slug: "tennis",
    positions: ["Singles", "Doubles"],
  },
  {
    name: "Golf",
    slug: "golf",
    positions: ["Individual"],
  },
  {
    name: "Swimming",
    slug: "swimming",
    positions: ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Individual Medley", "Relay"],
  },
];

async function main() {
  for (const sport of sports) {
    await prisma.sport.upsert({
      where: { slug: sport.slug },
      // Only set statSuggestions on first insert -- an admin may have
      // already customized it via /admin/stat-suggestions, and re-running
      // this seed shouldn't clobber that.
      update: { name: sport.name, positions: sport.positions },
      create: { ...sport, statSuggestions: DEFAULT_SPORT_STAT_SUGGESTIONS[sport.slug] ?? [] },
    });
  }
  console.log(`Seeded ${sports.length} sports.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
