import { requireVerifiedCoach } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { NotificationList } from "@/components/notifications/notification-list";

export default async function CoachNotificationsPage() {
  const session = await requireVerifiedCoach();
  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold tracking-tight">Notifications</h1>
      <NotificationList notifications={notifications} />
    </div>
  );
}
