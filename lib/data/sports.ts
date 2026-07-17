import { prisma } from "@/lib/prisma";

export async function getSports() {
  return prisma.sport.findMany({ orderBy: { name: "asc" } });
}
