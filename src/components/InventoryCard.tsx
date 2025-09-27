import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BoxColor, InventoryItem } from "@/types";
import { Package, TrendingUp, CheckCircle } from "lucide-react";

interface InventoryCardProps {
  color: BoxColor;
  inventory: InventoryItem;
}

export const InventoryCard = ({ color, inventory }: InventoryCardProps) => {
  const totalUsed = inventory.proposed + inventory.delivered;
  const usagePercentage = (totalUsed / color.stock) * 100;
  const deliveryRate = inventory.proposed > 0 ? (inventory.delivered / inventory.proposed) * 100 : 0;

  return (
    <Card className="p-4 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: color.hexColor }}
        />
        <div>
          <h3 className="font-semibold text-card-foreground">{color.name}</h3>
          <p className="text-sm text-muted-foreground">
            {inventory.available} disponibles
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Usage Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Uso total</span>
            <span className="font-medium">{totalUsed}/{color.stock}</span>
          </div>
          <Progress 
            value={usagePercentage} 
            className="h-2"
            style={{
              backgroundColor: `${color.hexColor}20`
            }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/30 rounded-lg p-2">
            <Package className="h-4 w-4 mx-auto mb-1 text-primary" />
            <div className="text-lg font-bold text-foreground">{inventory.proposed}</div>
            <div className="text-xs text-muted-foreground">Propuestas</div>
          </div>
          
          <div className="bg-success/10 rounded-lg p-2">
            <CheckCircle className="h-4 w-4 mx-auto mb-1 text-success" />
            <div className="text-lg font-bold text-success">{inventory.delivered}</div>
            <div className="text-xs text-muted-foreground">Entregadas</div>
          </div>
          
          <div className="bg-accent/10 rounded-lg p-2">
            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-accent" />
            <div className="text-lg font-bold text-accent">{Math.round(deliveryRate)}%</div>
            <div className="text-xs text-muted-foreground">Conversión</div>
          </div>
        </div>
      </div>
    </Card>
  );
};