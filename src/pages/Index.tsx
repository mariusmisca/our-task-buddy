import { useState, useEffect, useMemo } from "react";
import { CampaignHeader } from "@/components/CampaignHeader";
import { InventoryCard } from "@/components/InventoryCard";
import { LocationCard } from "@/components/LocationCard";
import { VisitModal } from "@/components/VisitModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Location, Visit, LocationStatus, InventoryItem, Campaign } from "@/types";
import { ACTIONS } from "@/data/actions";
import { ROUTES, ALL_LOCATIONS } from "@/data/routes";
import { Package, Search, MapPin, BarChart3, Route } from "lucide-react";

const Index = () => {
  const [visits, setVisits] = useState<Visit[]>(() => {
    const saved = localStorage.getItem('actiontracker-visits');
    if (saved) {
      return JSON.parse(saved).map((v: any) => ({
        ...v,
        date: new Date(v.date),
        createdAt: new Date(v.createdAt),
        updatedAt: new Date(v.updatedAt),
      }));
    }
    return [];
  });

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("locations");
  const { toast } = useToast();

  const campaign: Campaign = {
    currentRound: 1,
    currentWeek: 1,
    startDate: new Date(),
    totalLocations: ALL_LOCATIONS.length,
    completedLocations: 0,
  };

  useEffect(() => {
    localStorage.setItem('actiontracker-visits', JSON.stringify(visits));
  }, [visits]);

  const inventory = useMemo((): InventoryItem[] => {
    return ACTIONS.map(action => {
      const actionVisits = visits.filter(v => v.actionId === action.id);
      const proposed = actionVisits.filter(v => v.status === 'proposed').length;
      const delivered = actionVisits.filter(v => v.status === 'delivered').length;
      return { actionId: action.id, available: action.stock - proposed - delivered, proposed, delivered };
    });
  }, [visits]);

  const locationStatuses = useMemo((): Record<string, LocationStatus> => {
    const statuses: Record<string, LocationStatus> = {};
    ALL_LOCATIONS.forEach(location => {
      const locVisits = visits.filter(v => v.locationId === location.id);
      const actionsDelivered = [...new Set(locVisits.filter(v => v.status === 'delivered').map(v => v.actionId))];
      const lastVisit = locVisits.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
      statuses[location.id] = {
        locationId: location.id,
        actionsDelivered,
        totalProposed: locVisits.filter(v => v.status === 'proposed').length,
        totalDelivered: locVisits.filter(v => v.status === 'delivered').length,
        lastVisitDate: lastVisit?.date,
      };
    });
    return statuses;
  }, [visits]);

  const handleVisitSubmit = (visitData: {
    locationId: string;
    actionId: string;
    status: 'proposed' | 'delivered';
    photo?: string;
    notes?: string;
  }) => {
    const newVisit: Visit = {
      id: crypto.randomUUID(),
      ...visitData,
      round: campaign.currentRound,
      week: campaign.currentWeek,
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setVisits(prev => [newVisit, ...prev]);
    setSelectedLocationId(null);

    const actionName = ACTIONS.find(a => a.id === visitData.actionId)?.name;
    const locationName = ALL_LOCATIONS.find(l => l.id === visitData.locationId)?.name;
    toast({
      title: visitData.status === 'delivered' ? "Entrega registrada" : "Propuesta registrada",
      description: `${actionName} - ${locationName}`,
    });
  };

  const filteredLocations = useMemo(() => {
    let locs = selectedRouteId === "all" ? ALL_LOCATIONS : ALL_LOCATIONS.filter(l => l.routeId === selectedRouteId);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      locs = locs.filter(l => l.name.toLowerCase().includes(term) || l.address.toLowerCase().includes(term));
    }
    return locs;
  }, [selectedRouteId, searchTerm]);

  const totalProposed = visits.filter(v => v.status === 'proposed').length;
  const totalDelivered = visits.filter(v => v.status === 'delivered').length;
  const selectedLocation = selectedLocationId ? ALL_LOCATIONS.find(l => l.id === selectedLocationId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <CampaignHeader campaign={campaign} totalProposed={totalProposed} totalDelivered={totalDelivered} />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />Ubicaciones
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />Acciones
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />Estadísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="locations" className="space-y-4">
            {/* Route filter */}
            <div className="flex gap-2">
              <Select value={selectedRouteId} onValueChange={setSelectedRouteId}>
                <SelectTrigger className="w-[180px]">
                  <Route className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Todas las rutas" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border z-50">
                  <SelectItem value="all">Todas las rutas</SelectItem>
                  {ROUTES.map(route => (
                    <SelectItem key={route.id} value={route.id}>{route.name} ({route.locations.length})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar ubicaciones..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{filteredLocations.length} ubicaciones</p>

            <div className="grid gap-4">
              {filteredLocations.map(location => (
                <LocationCard
                  key={location.id}
                  location={location}
                  status={locationStatuses[location.id]}
                  recentVisits={visits.filter(v => v.locationId === location.id).slice(0, 3)}
                  actions={ACTIONS}
                  onVisit={setSelectedLocationId}
                />
              ))}
            </div>

            {filteredLocations.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No se encontraron ubicaciones</h3>
                <p className="text-muted-foreground">Intenta con otros términos de búsqueda.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {ACTIONS.map(action => {
                const inv = inventory.find(i => i.actionId === action.id)!;
                return <InventoryCard key={action.id} action={action} inventory={inv} />;
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Estadísticas Detalladas</h3>
              <p className="text-muted-foreground">Próximamente: gráficos de rendimiento, análisis por ruta y más.</p>
            </div>
          </TabsContent>
        </Tabs>

        <VisitModal
          isOpen={!!selectedLocationId}
          onClose={() => setSelectedLocationId(null)}
          location={selectedLocation ?? null}
          actions={ACTIONS}
          locationStatus={selectedLocation ? locationStatuses[selectedLocation.id] : null}
          onSubmit={handleVisitSubmit}
        />
      </div>
    </div>
  );
};

export default Index;
