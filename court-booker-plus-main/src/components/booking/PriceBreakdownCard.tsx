import { PriceBreakdown } from '@/types/booking';
import { cn } from '@/lib/utils';
import { Receipt, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

interface PriceBreakdownCardProps {
  breakdown: PriceBreakdown;
  className?: string;
}

export function PriceBreakdownCard({ breakdown, className }: PriceBreakdownCardProps) {
  const hasModifiers = breakdown.court_modifiers.length > 0;
  const hasEquipment = breakdown.equipment_items.length > 0;
  const hasCoach = breakdown.coach_fee > 0;
  const hasAnySelection = breakdown.court_base > 0;

  if (!hasAnySelection) {
    return (
      <div className={cn("rounded-xl border border-dashed border-border bg-card/50 p-6", className)}>
        <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
          <Receipt className="h-8 w-8" />
          <p className="text-sm">Select a court and time slot to see pricing</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4 shadow-sm", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-semibold text-foreground">Price Breakdown</h3>
      </div>

      <div className="space-y-3">
        {/* Court base price */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Court (1 hour)</span>
          <span className="font-medium text-foreground">₹{breakdown.court_base.toFixed(2)}</span>
        </div>

        {/* Price modifiers */}
        {hasModifiers && (
          <div className="space-y-1.5 border-t border-border pt-2">
            {breakdown.court_modifiers.map((modifier, idx) => {
              const isDiscount = modifier.amount < 0;
              return (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className={cn(
                    "flex items-center gap-1",
                    isDiscount ? "text-success" : "text-badge-peak"
                  )}>
                    {isDiscount ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
                    {modifier.rule}
                  </span>
                  <span className={cn(
                    "font-medium",
                    isDiscount ? "text-success" : "text-badge-peak"
                  )}>
                    {isDiscount ? '-' : '+'}₹{Math.abs(modifier.amount).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Equipment */}
        {hasEquipment && (
          <div className="space-y-1.5 border-t border-border pt-2">
            <p className="text-xs font-medium uppercase text-muted-foreground">Equipment</p>
            {breakdown.equipment_items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium text-foreground">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Coach fee */}
        {hasCoach && (
          <div className="flex items-center justify-between border-t border-border pt-2 text-sm">
            <span className="text-muted-foreground">Coach (1 hour)</span>
            <span className="font-medium text-foreground">₹{breakdown.coach_fee.toFixed(2)}</span>
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between border-t-2 border-primary/20 pt-3">
          <span className="font-display text-base font-semibold text-foreground">Total</span>
          <span className="font-display text-2xl font-bold text-primary">
            ₹{breakdown.total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
