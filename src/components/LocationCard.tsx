import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Location, LocationStatus, Visit, BoxColor } from "@/types";
import { MapPin, Package, CheckCircle, Calendar, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationCardProps {
  location: Location;
  status: LocationStatus;
  recentVisits: Visit[];
  colors: BoxColor[];
  onVisit: (locationId: string) => void;
}

export const LocationCard = ({ 
  location, 
  status, 
  recentVisits, 
  colors, 
  onVisit 
}: LocationCardProps) => {
  const getColorName = (colorId: string) => {
    return colors.find(c => c.id === colorId)?.name || colorId;
  };

  const getColorHex = (colorId: string) => {
    return colors.find(c => c.id === colorId)?.hexColor || '#666';
  };

  const pendingColors = colors.filter(c => !status.colorsDelivered.includes(c.id));

  return (
    <Card className={cn(
      "p-4 hover:shadow-md transition-all duration-300",
      status.totalDelivered > 0 && "border-success/30 bg-success/5"
    )}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground truncate">
            {location.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{location.address}</span>
          </div>
        </div>
        
        <Button
          onClick={() => onVisit(location.id)}
          size="sm"
          className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-md"
        >
          <Package className="h-4 w-4 mr-1" />
          Visitar
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1">
          <Package className="h-4 w-4 text-primary" />
          <span className="font-medium">{status.totalProposed}</span>
          <span className="text-muted-foreground">propuestas</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4 text-success" />
          <span className="font-medium">{status.totalDelivered}</span>
          <span className="text-muted-foreground">entregadas</span>
        </div>
      </div>

      {/* Delivered Colors */}
      {status.colorsDelivered.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-2">Colores entregados:</p>
          <div className="flex flex-wrap gap-1">
            {status.colorsDelivered.map(colorId => (
              <Badge
                key={colorId}
                variant="secondary"
                className="text-xs"
                style={{
                  backgroundColor: `${getColorHex(colorId)}20`,
                  color: getColorHex(colorId),
                  borderColor: `${getColorHex(colorId)}40`
                }}
              >
                {getColorName(colorId)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Available Colors */}
      {pendingColors.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-2">
            Colores disponibles ({pendingColors.length}):
          </p>
          <div className="flex flex-wrap gap-1">
            {pendingColors.slice(0, 4).map(color => (
              <div
                key={color.id}
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: color.hexColor }}
                title={color.name}
              />
            ))}
            {pendingColors.length > 4 && (
              <span className="text-xs text-muted-foreground">
                +{pendingColors.length - 4} más
              </span>
            )}
          </div>
        </div>
      )}

      {/* Last Visit */}
      {status.lastVisitDate && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Última visita: {status.lastVisitDate.toLocaleDateString('es-ES')}</span>
        </div>
      )}

      {/* Recent Visit with Photo */}
      {recentVisits.length > 0 && recentVisits[0].photo && (
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Camera className="h-3 w-3" />
          <span>Con foto de evidencia</span>
        </div>
      )}
    </Card>
  );
};