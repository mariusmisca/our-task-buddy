import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Campaign } from "@/types";
import { Calendar, MapPin, Target, TrendingUp } from "lucide-react";

interface CampaignHeaderProps {
  campaign: Campaign;
  totalProposed: number;
  totalDelivered: number;
}

export const CampaignHeader = ({ 
  campaign, 
  totalProposed, 
  totalDelivered 
}: CampaignHeaderProps) => {
  const completionRate = campaign.totalLocations > 0 
    ? (campaign.completedLocations / campaign.totalLocations) * 100 
    : 0;
  
  const conversionRate = totalProposed > 0 
    ? (totalDelivered / totalProposed) * 100 
    : 0;

  const getWeekLabel = () => {
    return `Ronda ${campaign.currentRound} - Semana ${campaign.currentWeek}`;
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Campaign Status */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Campaña de Cajas de Colores
            </h2>
            <p className="text-sm text-muted-foreground">
              {campaign.totalLocations} ubicaciones • 3 rondas de 3 semanas
            </p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Calendar className="h-3 w-3 mr-1" />
            {getWeekLabel()}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progreso general</span>
            <span className="font-medium">
              {campaign.completedLocations}/{campaign.totalLocations} ubicaciones
            </span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3 text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold text-primary">{totalProposed}</div>
          <div className="text-xs text-muted-foreground">Total Propuestas</div>
        </Card>
        
        <Card className="p-3 text-center bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <MapPin className="h-6 w-6 mx-auto mb-2 text-success" />
          <div className="text-2xl font-bold text-success">{totalDelivered}</div>
          <div className="text-xs text-muted-foreground">Total Entregas</div>
        </Card>
        
        <Card className="p-3 text-center bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-accent" />
          <div className="text-2xl font-bold text-accent">{Math.round(conversionRate)}%</div>
          <div className="text-xs text-muted-foreground">Conversión</div>
        </Card>
        
        <Card className="p-3 text-center bg-gradient-to-br from-muted/20 to-muted/10 border-border">
          <Calendar className="h-6 w-6 mx-auto mb-2 text-foreground" />
          <div className="text-2xl font-bold text-foreground">{Math.round(completionRate)}%</div>
          <div className="text-xs text-muted-foreground">Completado</div>
        </Card>
      </div>
    </div>
  );
};