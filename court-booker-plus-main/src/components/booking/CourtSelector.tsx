import { Court } from '@/types/booking';
import { cn } from '@/lib/utils';
import { Building2, TreePine, Check } from 'lucide-react';

interface CourtSelectorProps {
  courts: Court[];
  selectedCourt: Court | null;
  onSelectCourt: (court: Court) => void;
}

export function CourtSelector({ courts, selectedCourt, onSelectCourt }: CourtSelectorProps) {
  const activeCourts = courts.filter(c => c.is_active);

  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg font-semibold text-foreground">Select Court</h3>
      <div className="grid grid-cols-2 gap-3">
        {activeCourts.map((court) => {
          const isSelected = selectedCourt?.id === court.id;
          const Icon = court.type === 'indoor' ? Building2 : TreePine;

          return (
            <button
              key={court.id}
              onClick={() => onSelectCourt(court)}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200",
                isSelected
                  ? court.type === 'indoor'
                    ? "border-court-indoor bg-court-indoor/10 shadow-md"
                    : "border-court-outdoor bg-court-outdoor/10 shadow-md"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
              )}
            >
              {isSelected && (
                <div className={cn(
                  "absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full",
                  court.type === 'indoor' ? "bg-court-indoor" : "bg-court-outdoor"
                )}>
                  <Check className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              )}

              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg",
                court.type === 'indoor'
                  ? "bg-court-indoor/20 text-court-indoor"
                  : "bg-court-outdoor/20 text-court-outdoor"
              )}>
                <Icon className="h-6 w-6" />
              </div>

              <div className="text-center">
                <p className="font-semibold text-foreground">{court.name}</p>
                <p className="text-xs capitalize text-muted-foreground">{court.type}</p>
              </div>

              <p className={cn(
                "text-sm font-bold",
                court.type === 'indoor' ? "text-court-indoor" : "text-court-outdoor"
              )}>
                ₹{court.base_price_per_hour}/hr
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
