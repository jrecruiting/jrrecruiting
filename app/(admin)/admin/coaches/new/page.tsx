import { AddCoachForm } from "@/components/admin/add-coach-form";
import { Card, CardContent } from "@/components/ui/card";

export default function NewCoachPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold tracking-tight">Add Coach</h1>
      <Card className="max-w-md border-border/60">
        <CardContent>
          <AddCoachForm />
        </CardContent>
      </Card>
    </div>
  );
}
