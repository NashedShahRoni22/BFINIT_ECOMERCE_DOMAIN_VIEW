import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Globe, AlertTriangle } from "lucide-react";

export default function CurrencySwitchWarningModal({
  isOpen,
  pendingRegion,
  onConfirm,
  onCancel,
}) {
  if (!pendingRegion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden p-0">
        {/* ── Warning Header ── */}
        <div className="bg-warning/10 border-warning/20 flex items-center gap-3 border-b px-6 py-4">
          <div className="bg-warning/15 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
            <AlertTriangle className="text-warning-foreground h-4 w-4" />
          </div>
          <div>
            <p className="text-foreground text-sm font-semibold">
              Your cart will be cleared
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              This action cannot be undone
            </p>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="space-y-4 px-6 py-5">
          {/* Region being switched to */}
          <div className="border-border bg-muted/40 flex items-center justify-between rounded-lg border px-4 py-3">
            <div className="flex items-center gap-2">
              <Globe className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-foreground text-sm font-medium">
                  {pendingRegion.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {pendingRegion.currencyLabel}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              {pendingRegion.currency}
            </Badge>
          </div>

          {/* Explanation */}
          <div className="flex gap-2.5">
            <ShoppingCart className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Switching regions clears your cart because prices and product
              availability vary by country. You&apos;ll need to add items again
              in the new region.
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="flex flex-row gap-2 px-6 pb-5 sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="flex-1 sm:flex-none"
          >
            Keep my cart
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            className="flex-1 sm:flex-none"
          >
            Switch & clear cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
