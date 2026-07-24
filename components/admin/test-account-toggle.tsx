"use client";

import { useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { setCoachTestAccount } from "@/actions/coaches";
import { toast } from "sonner";

export function TestAccountToggle({
  coachProfileId,
  isTestAccount,
}: {
  coachProfileId: string;
  isTestAccount: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(checked: boolean) {
    startTransition(async () => {
      await setCoachTestAccount(coachProfileId, checked);
      toast.success(
        checked
          ? "Marked as a test account -- their profile views won't notify parents."
          : "No longer marked as a test account."
      );
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <Checkbox
        id={`test-account-${coachProfileId}`}
        checked={isTestAccount}
        onCheckedChange={handleChange}
        disabled={isPending}
      />
      <Label
        htmlFor={`test-account-${coachProfileId}`}
        className="text-xs font-normal text-muted-foreground"
      >
        Test account
      </Label>
    </div>
  );
}
