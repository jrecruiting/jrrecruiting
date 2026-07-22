import type { Prisma } from "@prisma/client";
import type { SearchParamsValues } from "@/lib/validations/search";

export function buildPlayerWhere(params: SearchParamsValues): Prisma.PlayerWhereInput {
  const where: Prisma.PlayerWhereInput = { listingStatus: "ACTIVE" };

  if (params.country) where.country = params.country.toUpperCase();
  // State only makes sense once a country is chosen — mirrors the assumption
  // used in the player form (state code is US/CA-style, not globally unique).
  if (params.state && params.country) where.state = params.state.toUpperCase();
  if (params.gender) where.gender = params.gender;
  if (params.playerType) where.playerType = params.playerType;
  if (params.gradYear) where.gradYear = params.gradYear;

  if (params.sportId || params.position || params.projection) {
    where.sports = {
      some: {
        ...(params.sportId ? { sportId: params.sportId } : {}),
        ...(params.position
          ? { position: { contains: params.position, mode: "insensitive" } }
          : {}),
        ...(params.projection ? { projection: params.projection } : {}),
      },
    };
  }

  return where;
}
