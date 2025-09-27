import { useState, useEffect, useMemo } from "react";
import { CampaignHeader } from "@/components/CampaignHeader";
import { InventoryCard } from "@/components/InventoryCard";
import { LocationCard } from "@/components/LocationCard";
import { VisitModal } from "@/components/VisitModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Location, Visit, BoxColor, LocationStatus, InventoryItem, Campaign } from "@/types";
import { BOX_COLORS } from "@/data/boxColors";
import { Package, Search, MapPin, BarChart3 } from "lucide-react";

// Sample data - In real app, this would come from a database
const SAMPLE_LOCATIONS: Location[] = Array.from({ length: 10 }, (_, i) => ({
  id: `loc-${i + 1}`,
  name: `Ubicación ${i + 1}`,
  address: `Calle Ejemplo ${i + 1}, Madrid, España`,
  coordinates: {
    lat: 40.4168 + (Math.random() - 0.5) * 0.1,
    lng: -3.7038 + (Math.random() - 0.5) * 0.1
  }
}));

const Index = () => {
  const [visits, setVisits] = useState<Visit[]>(() => {
    const savedVisits = localStorage.getItem('boxtracker-visits');
    if (savedVisits) {
      return JSON.parse(savedVisits).map((visit: any) => ({
        ...visit,
        date: new Date(visit.date),
        createdAt: new Date(visit.createdAt),
        updatedAt: new Date(visit.updatedAt)
      }));
    }
    return [];
  });

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("locations");
  const { toast } = useToast();

  // Campaign state
  const campaign: Campaign = {
    currentRound: 1,
    currentWeek: 1,
    startDate: new Date(),
    totalLocations: SAMPLE_LOCATIONS.length,
    completedLocations: 0
  };

  useEffect(() => {
    localStorage.setItem('boxtracker-visits', JSON.stringify(visits));
  }, [visits]);

  // Calculate inventory
  const inventory = useMemo((): InventoryItem[] => {
    return BOX_COLORS.map(color => {
      const colorVisits = visits.filter(v => v.colorId === color.id);
      const proposed = colorVisits.filter(v => v.status === 'proposed').length;
      const delivered = colorVisits.filter(v => v.status === 'delivered').length;
      
      return {
        colorId: color.id,
        available: color.stock - proposed - delivered,
        proposed,
        delivered
      };
    });
  }, [visits]);

  // Calculate location statuses
  const locationStatuses = useMemo((): Record<string, LocationStatus> => {
    const statuses: Record<string, LocationStatus> = {};
    
    SAMPLE_LOCATIONS.forEach(location => {
      const locationVisits = visits.filter(v => v.locationId === location.id);
      const colorsDelivered = [...new Set(
        locationVisits
          .filter(v => v.status === 'delivered')
          .map(v => v.colorId)
      )];
      
      const lastVisit = locationVisits
        .sort((a, b) => b.date.getTime() - a.date.getTime())[0];

      statuses[location.id] = {
        locationId: location.id,
        colorsDelivered,
        totalProposed: locationVisits.filter(v => v.status === 'proposed').length,
        totalDelivered: locationVisits.filter(v => v.status === 'delivered').length,
        lastVisitDate: lastVisit?.date
      };
    });

    return statuses;
  }, [visits]);

  const handleVisit = (locationId: string) => {
    setSelectedLocationId(locationId);
  };

  const handleVisitSubmit = (visitData: {
    locationId: string;
    colorId: string;
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
      updatedAt: new Date()
    };

    setVisits(prev => [newVisit, ...prev]);
    setSelectedLocationId(null);

    const colorName = BOX_COLORS.find(c => c.id === visitData.colorId)?.name;
    const locationName = SAMPLE_LOCATIONS.find(l => l.id === visitData.locationId)?.name;

    toast({
      title: visitData.status === 'delivered' ? "Entrega registrada" : "Propuesta registrada",
      description: `${colorName} - ${locationName}`,
    });
  };

  const filteredLocations = SAMPLE_LOCATIONS.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProposed = visits.filter(v => v.status === 'proposed').length;
  const totalDelivered = visits.filter(v => v.status === 'delivered').length;

  const selectedLocation = selectedLocationId 
    ? SAMPLE_LOCATIONS.find(l => l.id === selectedLocationId) 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <CampaignHeader 
          campaign={campaign}
          totalProposed={totalProposed}
          totalDelivered={totalDelivered}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Ubicaciones
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Inventario
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Estadísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="locations" className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ubicaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Locations Grid */}
            <div className="grid gap-4">
              {filteredLocations.map(location => (
                <LocationCard
                  key={location.id}
                  location={location}
                  status={locationStatuses[location.id]}
                  recentVisits={visits.filter(v => v.locationId === location.id).slice(0, 3)}
                  colors={BOX_COLORS}
                  onVisit={handleVisit}
                />
              ))}
            </div>

            {filteredLocations.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No se encontraron ubicaciones
                </h3>
                <p className="text-muted-foreground">
                  Intenta con otros términos de búsqueda.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {BOX_COLORS.map(color => {
                const colorInventory = inventory.find(i => i.colorId === color.id)!;
                return (
                  <InventoryCard
                    key={color.id}
                    color={color}
                    inventory={colorInventory}
                  />
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Estadísticas Detalladas
              </h3>
              <p className="text-muted-foreground">
                Próximamente: gráficos de rendimiento, análisis por ubicación y más.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Visit Modal */}
        <VisitModal
          isOpen={!!selectedLocationId}
          onClose={() => setSelectedLocationId(null)}
          location={selectedLocation}
          colors={BOX_COLORS}
          locationStatus={selectedLocation ? locationStatuses[selectedLocation.id] : null}
          onSubmit={handleVisitSubmit}
        />
      </div>
    </div>
  );
};

export default Index;
