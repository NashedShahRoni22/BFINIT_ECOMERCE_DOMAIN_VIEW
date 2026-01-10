import { FileQuestion, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyContent({ title, isAdmin = false }) {
  return (
    <div>
      {/* Hero */}
      <div className="bg-muted/30 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl">{title}</h1>
        </div>
      </div>

      {/* Empty State */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted mb-4 rounded-full p-4">
              <FileQuestion className="text-muted-foreground h-10 w-10" />
            </div>

            <h2 className="mb-2 text-xl font-semibold">
              {isAdmin ? "No Content Added Yet" : "Content Not Available"}
            </h2>

            <p className="text-muted-foreground mb-6 max-w-md">
              {isAdmin
                ? "This page doesn't have any content yet. Start by adding some content to make it visible to your customers."
                : "This page is currently under construction. Please check back later."}
            </p>

            {isAdmin && (
              <Button>
                <Pencil className="mr-2 h-4 w-4" />
                Add Content
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
