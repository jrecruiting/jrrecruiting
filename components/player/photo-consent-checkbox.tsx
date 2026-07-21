"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function PhotoConsentCheckbox({ defaultChecked }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(Boolean(defaultChecked));
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleCheckedChange(next: boolean) {
    if (next) {
      // Checking the box requires explicit agreement in the dialog below --
      // don't check it yet.
      setDialogOpen(true);
    } else {
      setChecked(false);
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

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Photo publishing authorization</AlertDialogTitle>
            <AlertDialogDescription>
              By selecting this box, you agree to give authorization to JR Recruiting to
              use the provided image on jrrecruiting.com.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setChecked(false)}>Disagree</AlertDialogCancel>
            <AlertDialogAction
              className="bg-gold text-gold-foreground hover:bg-gold/90"
              onClick={() => setChecked(true)}
            >
              Agree
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
