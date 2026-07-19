"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { Star } from "@phosphor-icons/react";
import { toggleStar, setNotifyOnUpdate } from "@/actions/stars";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AUTO_DISMISS_MS = 6000;

export function QuickStarButton({
  playerId,
  initialStarred,
  className,
}: {
  playerId: string;
  initialStarred: boolean;
  className?: string;
}) {
  const [starred, setStarred] = useState(initialStarred);
  const [promptOpen, setPromptOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, []);

  async function handleClick() {
    if (isPending) return;
    const optimisticNext = !starred;
    setStarred(optimisticNext);
    setIsPending(true);

    try {
      const result = await toggleStar(playerId);
      setStarred(result.starred);

      if (result.starred) {
        setPromptOpen(true);
        dismissTimer.current = setTimeout(() => setPromptOpen(false), AUTO_DISMISS_MS);
      } else {
        setPromptOpen(false);
      }
    } catch {
      setStarred(!optimisticNext);
      toast.error("Couldn't update star. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleNotifyChoice(notify: boolean) {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    setPromptOpen(false);
    try {
      await setNotifyOnUpdate(playerId, notify);
      if (notify) toast.success("You'll get an email when this profile updates.");
    } catch {
      toast.error("Couldn't save your notification preference.");
    }
  }

  return (
    <>
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        aria-pressed={starred}
        aria-label={starred ? "Unstar this player" : "Star this player"}
        disabled={isPending}
        className={`relative flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-gold/10 hover:text-gold disabled:opacity-60 [touch-action:manipulation] ${className ?? ""}`}
        whileTap={reduceMotion ? undefined : { scale: 0.85 }}
      >
        <motion.span
          animate={
            reduceMotion
              ? { opacity: starred ? 1 : 0.7 }
              : { scale: starred ? [1, 1.3, 1] : 1 }
          }
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex"
        >
          <Star
            className={starred ? "h-5 w-5 text-gold" : "h-5 w-5"}
            weight={starred ? "fill" : "regular"}
            aria-hidden
          />
        </motion.span>

        <AnimatePresence>
          {starred && !reduceMotion && (
            <motion.span
              key="burst"
              initial={{ opacity: 0.6, scale: 0.4 }}
              animate={{ opacity: 0, scale: 1.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 rounded-full bg-gold/40"
            />
          )}
        </AnimatePresence>
      </motion.button>

      <Popover open={promptOpen} onOpenChange={setPromptOpen}>
        <PopoverContent anchor={buttonRef} side="bottom" align="center" className="w-64">
          <p className="text-sm">Get notified by email when this player&apos;s profile updates?</p>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={() => handleNotifyChoice(false)}>
              No thanks
            </Button>
            <Button
              size="sm"
              className="bg-gold text-gold-foreground hover:bg-gold/90"
              onClick={() => handleNotifyChoice(true)}
            >
              Yes, notify me
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
