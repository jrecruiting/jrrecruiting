"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DialogStage = "consent" | "warning" | null;

export function PhotoConsentCheckbox({
  defaultChecked,
  onClearPhoto,
}: {
  defaultChecked?: boolean;
  onClearPhoto?: () => void;
}) {
  const [checked, setChecked] = useState(Boolean(defaultChecked));
  const [stage, setStage] = useState<DialogStage>(null);
  const [disagreeCount, setDisagreeCount] = useState(0);

  function handleCheckedChange(next: boolean) {
    if (next) {
      // Checking the box requires explicit agreement in the dialog below --
      // don't check it yet.
      setStage("consent");
    } else {
      setChecked(false);
    }
  }

  function handleAgree() {
    setChecked(true);
    setStage(null);
  }

  function handleDisagree() {
    setChecked(false);
    const count = disagreeCount + 1;
    setDisagreeCount(count);

    if (count >= 2) {
      // Declining a second time means they don't intend to authorize this
      // photo at all -- clear it instead of leaving an unconsented photo
      // sitting on the form.
      onClearPhoto?.();
      setStage("warning");
    } else {
      setStage(null);
    }
  }

  return (
    <>
      <Checkbox
        id="photoConsent"
        name="photoConsent"
        checked={checked}
        onCheckedChange={(next) => handleCheckedChange(next === true)}
      />

      {/* Both stages share one dialog root so switching from the consent
          prompt to the warning prompt never closes/reopens the dialog --
          using AlertDialogCancel (Base UI's Close primitive) here would
          fire its own close request that races with our stage change. */}
      <AlertDialog open={stage !== null} onOpenChange={(open) => !open && setStage(null)}>
        <AlertDialogContent>
          {stage === "consent" && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Photo publishing authorization</AlertDialogTitle>
                <AlertDialogDescription>
                  By selecting this box, you agree to give authorization to JR Recruiting
                  to use the provided image on jrrecruiting.com.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction variant="outline" onClick={handleDisagree}>
                  Disagree
                </AlertDialogAction>
                <AlertDialogAction
                  className="bg-gold text-gold-foreground hover:bg-gold/90"
                  onClick={handleAgree}
                >
                  Agree
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
          {stage === "warning" && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Photo won&apos;t be published</AlertDialogTitle>
                <AlertDialogDescription>
                  Without this authorization, this player&apos;s photo cannot be
                  published on jrrecruiting.com. You can still complete the profile
                  without a photo, or upload one later once you&apos;re ready to
                  authorize its use.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction
                  className="bg-gold text-gold-foreground hover:bg-gold/90"
                  onClick={() => setStage(null)}
                >
                  Got it
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
