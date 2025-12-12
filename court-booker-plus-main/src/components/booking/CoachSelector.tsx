import { Coach } from '@/types/booking';
import { cn } from '@/lib/utils';
import { Check, Star, User } from 'lucide-react';

interface CoachSelectorProps {
  coaches: Coach[];
  selectedCoach: Coach | null;
  onSelectCoach: (coach: Coach | null) => void;
  isCoachAvailable: (coachId: string) => boolean;
}

export function CoachSelector({
  coaches,
  selectedCoach,
  onSelectCoach,
  isCoachAvailable
}: CoachSelectorProps) {
  const activeCoaches = coaches.filter(c => c.is_active);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">Book a Coach</h3>
        <span className="text-xs text-muted-foreground">Optional</span>
      </div>

      <div className="space-y-2">
        {/* No coach option */}
        <button
          onClick={() => onSelectCoach(null)}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200",
            selectedCoach === null
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:border-primary/50"
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">No Coach</p>
            <p className="text-sm text-muted-foreground">Play on your own</p>
          </div>
          {selectedCoach === null && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
              <Check className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
          )}
        </button>

        {activeCoaches.map((coach) => {
          const isSelected = selectedCoach?.id === coach.id;
          const isAvailable = isCoachAvailable(coach.id);

          return (
            <button
              key={coach.id}
              onClick={() => isAvailable && onSelectCoach(coach)}
              disabled={!isAvailable}
              className={cn(
                "relative flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200",
                !isAvailable
                  ? "cursor-not-allowed border-border bg-muted/50 opacity-60"
                  : isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-lg font-bold text-primary-foreground">
                {coach.name.split(' ').map(n => n[0]).join('')}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{coach.name}</p>
                  {!isAvailable && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      Unavailable
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{coach.specialization}</p>
                <p className="text-sm font-semibold text-primary">₹{coach.hourly_rate}/hr</p>
              </div>

              {isSelected && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
