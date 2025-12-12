import { useState } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Building2, TreePine, Package, User, Percent, Save, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Court, Equipment, Coach, PricingRule } from '@/types/booking';

const AdminPage = () => {
  const {
    courts,
    equipment,
    coaches,
    pricingRules,
    updateCourt,
    updateEquipment,
    updateCoach,
    updatePricingRule,
    addPricingRule,
  } = useBookingStore();

  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);

  const handleSaveCourt = () => {
    if (editingCourt) {
      updateCourt(editingCourt);
      setEditingCourt(null);
      toast({ title: "Court updated", description: "Court settings have been saved." });
    }
  };

  const handleSaveEquipment = () => {
    if (editingEquipment) {
      updateEquipment(editingEquipment);
      setEditingEquipment(null);
      toast({ title: "Equipment updated", description: "Equipment settings have been saved." });
    }
  };

  const handleSaveCoach = () => {
    if (editingCoach) {
      updateCoach(editingCoach);
      setEditingCoach(null);
      toast({ title: "Coach updated", description: "Coach profile has been saved." });
    }
  };

  const handleTogglePricingRule = (rule: PricingRule) => {
    updatePricingRule({ ...rule, is_active: !rule.is_active });
    toast({
      title: rule.is_active ? "Rule disabled" : "Rule enabled",
      description: `${rule.name} has been ${rule.is_active ? 'disabled' : 'enabled'}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="mt-2 text-muted-foreground">
            Manage courts, equipment, coaches, and pricing rules
          </p>
        </div>

        <Tabs defaultValue="courts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="courts" className="gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Courts</span>
            </TabsTrigger>
            <TabsTrigger value="equipment" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Equipment</span>
            </TabsTrigger>
            <TabsTrigger value="coaches" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Coaches</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2">
              <Percent className="h-4 w-4" />
              <span className="hidden sm:inline">Pricing</span>
            </TabsTrigger>
          </TabsList>

          {/* Courts Tab */}
          <TabsContent value="courts" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {courts.map((court) => {
                const isEditing = editingCourt?.id === court.id;
                const Icon = court.type === 'indoor' ? Building2 : TreePine;

                return (
                  <div
                    key={court.id}
                    className={cn(
                      "rounded-xl border p-4 transition-all",
                      isEditing ? "border-primary bg-primary/5" : "border-border bg-card"
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          court.type === 'indoor' ? "bg-court-indoor/20 text-court-indoor" : "bg-court-outdoor/20 text-court-outdoor"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{court.name}</p>
                          <Badge variant="outline" className="capitalize">{court.type}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Active</span>
                        <Switch
                          checked={isEditing ? editingCourt.is_active : court.is_active}
                          onCheckedChange={(checked) => {
                            if (isEditing) {
                              setEditingCourt({ ...editingCourt, is_active: checked });
                            } else {
                              updateCourt({ ...court, is_active: checked });
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-muted-foreground">Base Price (per hour)</label>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-muted-foreground">₹</span>
                          <Input
                            type="number"
                            value={isEditing ? editingCourt.base_price_per_hour : court.base_price_per_hour}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              if (isEditing) {
                                setEditingCourt({ ...editingCourt, base_price_per_hour: value });
                              } else {
                                setEditingCourt({ ...court, base_price_per_hour: value });
                              }
                            }}
                            onFocus={() => !isEditing && setEditingCourt(court)}
                          />
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" onClick={handleSaveCourt}>
                            <Save className="mr-1 h-4 w-4" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingCourt(null)}>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {equipment.map((item) => {
                const isEditing = editingEquipment?.id === item.id;

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-xl border p-4 transition-all",
                      isEditing ? "border-primary bg-primary/5" : "border-border bg-card"
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-semibold text-foreground">{item.name}</p>
                        <Badge variant="outline" className="capitalize">{item.type}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Active</span>
                        <Switch
                          checked={isEditing ? editingEquipment.is_active : item.is_active}
                          onCheckedChange={(checked) => {
                            if (isEditing) {
                              setEditingEquipment({ ...editingEquipment, is_active: checked });
                            } else {
                              updateEquipment({ ...item, is_active: checked });
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-muted-foreground">Price/hr</label>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-muted-foreground">₹</span>
                          <Input
                            type="number"
                            value={isEditing ? editingEquipment.price_per_hour : item.price_per_hour}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              if (isEditing) {
                                setEditingEquipment({ ...editingEquipment, price_per_hour: value });
                              } else {
                                setEditingEquipment({ ...item, price_per_hour: value });
                              }
                            }}
                            onFocus={() => !isEditing && setEditingEquipment(item)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Available</label>
                        <Input
                          type="number"
                          className="mt-1"
                          value={isEditing ? editingEquipment.quantity_available : item.quantity_available}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            if (isEditing) {
                              setEditingEquipment({ ...editingEquipment, quantity_available: value });
                            } else {
                              setEditingEquipment({ ...item, quantity_available: value });
                            }
                          }}
                          onFocus={() => !isEditing && setEditingEquipment(item)}
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-2 pt-3">
                        <Button size="sm" onClick={handleSaveEquipment}>
                          <Save className="mr-1 h-4 w-4" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingEquipment(null)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Coaches Tab */}
          <TabsContent value="coaches" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coaches.map((coach) => {
                const isEditing = editingCoach?.id === coach.id;

                return (
                  <div
                    key={coach.id}
                    className={cn(
                      "rounded-xl border p-4 transition-all",
                      isEditing ? "border-primary bg-primary/5" : "border-border bg-card"
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-lg font-bold text-primary-foreground">
                          {coach.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{coach.name}</p>
                          <p className="text-sm text-muted-foreground">{coach.specialization}</p>
                        </div>
                      </div>
                      <Switch
                        checked={isEditing ? editingCoach.is_active : coach.is_active}
                        onCheckedChange={(checked) => {
                          if (isEditing) {
                            setEditingCoach({ ...editingCoach, is_active: checked });
                          } else {
                            updateCoach({ ...coach, is_active: checked });
                          }
                        }}
                      />
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Hourly Rate</label>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-muted-foreground">₹</span>
                        <Input
                          type="number"
                          value={isEditing ? editingCoach.hourly_rate : coach.hourly_rate}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            if (isEditing) {
                              setEditingCoach({ ...editingCoach, hourly_rate: value });
                            } else {
                              setEditingCoach({ ...coach, hourly_rate: value });
                            }
                          }}
                          onFocus={() => !isEditing && setEditingCoach(coach)}
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-2 pt-3">
                        <Button size="sm" onClick={handleSaveCoach}>
                          <Save className="mr-1 h-4 w-4" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingCoach(null)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* Pricing Rules Tab */}
          <TabsContent value="pricing" className="space-y-4">
            <div className="space-y-4">
              {pricingRules.map((rule) => (
                <div
                  key={rule.id}
                  className={cn(
                    "rounded-xl border p-4 transition-all",
                    rule.is_active ? "border-primary/50 bg-primary/5" : "border-border bg-card"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{rule.name}</p>
                        <Badge variant={rule.multiplier > 1 ? "default" : "secondary"}>
                          {rule.multiplier > 1 ? '+' : ''}{((rule.multiplier - 1) * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {rule.start_hour !== undefined && rule.end_hour !== undefined && (
                          <span>Hours: {rule.start_hour}:00 - {rule.end_hour}:00</span>
                        )}
                        {rule.days_of_week && (
                          <span>Days: {rule.days_of_week.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{rule.is_active ? 'Active' : 'Inactive'}</span>
                      <Switch
                        checked={rule.is_active}
                        onCheckedChange={() => handleTogglePricingRule(rule)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPage;
