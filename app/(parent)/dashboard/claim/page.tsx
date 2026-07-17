import { ClaimSearch } from "@/components/parent/claim-search";
import { searchUnclaimedPlayers } from "@/actions/claims";

export default function ClaimPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Claim an Existing Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          If our team already created a profile for your athlete, search for
          it here to link it to your account.
        </p>
      </div>
      <ClaimSearch searchAction={searchUnclaimedPlayers} />
    </div>
  );
}
