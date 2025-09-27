import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Location, BoxColor, LocationStatus } from "@/types";
import { Camera, Package, CheckCircle, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface VisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location | null;
  colors: BoxColor[];
  locationStatus: LocationStatus | null;
  onSubmit: (visit: {
    locationId: string;
    colorId: string;
    status: 'proposed' | 'delivered';
    photo?: string;
    notes?: string;
  }) => void;
}

export const VisitModal = ({ 
  isOpen, 
  onClose, 
  location, 
  colors, 
  locationStatus,
  onSubmit 
}: VisitModalProps) => {
  const [selectedColorId, setSelectedColorId] = useState<string>("");
  const [status, setStatus] = useState<'proposed' | 'delivered'>('proposed');
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!location || !locationStatus) return null;

  const availableColors = colors.filter(c => !locationStatus.colorsDelivered.includes(c.id));
  const selectedColor = colors.find(c => c.id === selectedColorId);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedColorId) return;

    onSubmit({
      locationId: location.id,
      colorId: selectedColorId,
      status,
      photo: photo || undefined,
      notes: notes || undefined
    });

    // Reset form
    setSelectedColorId("");
    setStatus('proposed');
    setNotes("");
    setPhoto("");
    onClose();
  };

  const handleClose = () => {
    setSelectedColorId("");
    setStatus('proposed');
    setNotes("");
    setPhoto("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Nueva Visita
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Location Info */}
          <Card className="p-3 bg-muted/30">
            <h3 className="font-semibold text-sm">{location.name}</h3>
            <p className="text-xs text-muted-foreground">{location.address}</p>
            {locationStatus.colorsDelivered.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">Ya entregados:</p>
                <div className="flex flex-wrap gap-1">
                  {locationStatus.colorsDelivered.map(colorId => {
                    const color = colors.find(c => c.id === colorId);
                    return (
                      <Badge key={colorId} variant="secondary" className="text-xs">
                        {color?.name || colorId}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>

          {/* Color Selection */}
          <div>
            <Label htmlFor="color-select">Color de la caja *</Label>
            <Select value={selectedColorId} onValueChange={setSelectedColorId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona un color" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                {availableColors.map(color => (
                  <SelectItem key={color.id} value={color.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: color.hexColor }}
                      />
                      <span>{color.name}</span>
                      <span className="text-muted-foreground text-xs">
                        ({color.stock} disponibles)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Selection */}
          {selectedColorId && (
            <div>
              <Label>Estado de la visita *</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Button
                  type="button"
                  variant={status === 'proposed' ? 'default' : 'outline'}
                  onClick={() => setStatus('proposed')}
                  className={cn(
                    "justify-start",
                    status === 'proposed' && "bg-primary text-primary-foreground"
                  )}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Propuesta
                </Button>
                <Button
                  type="button"
                  variant={status === 'delivered' ? 'default' : 'outline'}
                  onClick={() => setStatus('delivered')}
                  className={cn(
                    "justify-start",
                    status === 'delivered' && "bg-success text-success-foreground"
                  )}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Entregada
                </Button>
              </div>
            </div>
          )}

          {/* Photo Upload (only for delivered) */}
          {status === 'delivered' && (
            <div>
              <Label>Foto de evidencia</Label>
              <div className="mt-1">
                {photo ? (
                  <div className="relative">
                    <img 
                      src={photo} 
                      alt="Evidencia" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setPhoto("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-32 border-dashed"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Toca para agregar foto
                      </p>
                    </div>
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notas adicionales</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observaciones, comentarios del cliente..."
              className="mt-1 min-h-[80px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!selectedColorId}
              className="flex-1 bg-gradient-to-r from-primary to-primary-glow"
            >
              {status === 'delivered' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Registrar Entrega
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 mr-2" />
                  Registrar Propuesta
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};