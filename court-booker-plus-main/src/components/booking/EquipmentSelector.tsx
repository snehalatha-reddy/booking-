import { Equipment, BookingEquipment } from '@/types/booking';
import { cn } from '@/lib/utils';
import { Minus, Plus, CircleDot } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EquipmentSelectorProps {
  equipment: Equipment[];
  selectedEquipment: BookingEquipment[];
  onToggleEquipment: (equipmentId: string, quantity: number) => void;
}

const equipmentIcons: Record<string, string> = {
  racket: '🏸',
  shoes: '👟',
  shuttlecock: '🪶',
};

export function EquipmentSelector({
  equipment,
  selectedEquipment,
  onToggleEquipment
}: EquipmentSelectorProps) {
  const activeEquipment = equipment.filter(e => e.is_active && e.quantity_available > 0);

  const getQuantity = (equipmentId: string) => {
    return selectedEquipment.find(e => e.equipment_id === equipmentId)?.quantity || 0;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">Equipment Rental</h3>
        <span className="text-xs text-muted-foreground">Optional</span>
      </div>

      <div className="space-y-2">
        {activeEquipment.map((item) => {
          const quantity = getQuantity(item.id);
          const maxQuantity = Math.min(item.quantity_available, 4);

          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between rounded-xl border p-3 transition-all duration-200",
                quantity > 0
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-card"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{equipmentIcons[item.type] || '🎯'}</span>
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ₹{item.price_per_hour}/hr • {item.quantity_available} available
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onToggleEquipment(item.id, quantity - 1)}
                  disabled={quantity === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <span className="w-8 text-center font-semibold text-foreground">{quantity}</span>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onToggleEquipment(item.id, quantity + 1)}
                  disabled={quantity >= maxQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
