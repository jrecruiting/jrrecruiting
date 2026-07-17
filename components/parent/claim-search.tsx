"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requestClaim } from "@/actions/claims";
import { toast } from "sonner";

type UnclaimedPlayer = {
  id: string;
  firstName: string;
  lastName: string;
  state: string | null;
  country: string;
  gradYear: number;
};

export function ClaimSearch({
  searchAction,
}: {
  searchAction: (query: string) => Promise<UnclaimedPlayer[]>;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UnclaimedPlayer[] | null>(null);
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    startTransition(async () => {
      const found = await searchAction(query);
      setResults(found);
    });
  };

  const handleClaim = (playerId: string) => {
    startTransition(async () => {
      await requestClaim(playerId, "");
      setRequestedIds((prev) => new Set(prev).add(playerId));
      toast.success("Claim request sent — an admin will review it shortly.");
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 sm:max-w-sm">
        <Label htmlFor="claim-search">Search by athlete name</Label>
        <div className="flex gap-2">
          <Input
            id="claim-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="First or last name"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button type="button" onClick={handleSearch} disabled={isPending || query.trim().length < 2}>
            Search
          </Button>
        </div>
      </div>

      {results !== null && (
        <div className="flex flex-col gap-3">
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No unclaimed profiles found. If our team created a profile for
              your athlete, double-check the spelling, or{" "}
              <a href="/contact" className="text-gold hover:underline">
                contact us
              </a>{" "}
              for help.
            </p>
          ) : (
            results.map((player) => (
              <Card key={player.id} className="border-border/60">
                <CardContent className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {player.firstName} {player.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {[player.state, player.country].filter(Boolean).join(", ")} &middot; Class
                      of {player.gradYear}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    disabled={isPending || requestedIds.has(player.id)}
                    className="bg-gold text-gold-foreground hover:bg-gold/90"
                    onClick={() => handleClaim(player.id)}
                  >
                    {requestedIds.has(player.id) ? "Request Sent" : "This Is My Athlete"}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
