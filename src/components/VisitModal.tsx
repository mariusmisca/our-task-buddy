import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Location, Action, LocationStatus } from "@/types";
import { Camera, Package, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface VisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location | null;
  actions: Action[];
  locationStatus: LocationStatus | null;
  onSubmit: (visit: {
    locationId: string;
    actionId: string;
    status: 'proposed' | 'delivered';
    photo?: string;
    notes?: string;
  }) => void;
}

export const VisitModal = ({ isOpen, onClose, location, actions, locationStatus, onSubmit }: VisitModalProps) => {
  const [selectedActionId, setSelectedActionId] = useState<string>("");
  const [status, setStatus] = useState<'proposed' | 'delivered'>('proposed');
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!location || !locationStatus) return null;

  const availableActions = actions.filter(a => !locationStatus.actionsDelivered.includes(a.id));

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPhoto(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedActionId) return;
    onSubmit({ locationId: location.id, actionId: selectedActionId, status, photo: photo || undefined, notes: notes || undefined });
    resetAndClose();
  };

  const resetAndClose = () => {
    setSelectedActionId("");
    setStatus('proposed');
    setNotes("");
    setPhoto("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Nueva Visita
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-3 bg-muted/30">
            <h3 className="font-semibold text-sm">{location.name}</h3>
            <p className="text-xs text-muted-foreground">{location.address}</p>
            {locationStatus.actionsDelivered.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">Ya entregadas:</p>
                <div className="flex flex-wrap gap-1">
                  {locationStatus.actionsDelivered.map(actionId => {
                    const action = actions.find(a => a.id === actionId);
                    return <Badge key={actionId} variant="secondary" className="text-xs">{action?.name || actionId}</Badge>;
                  })}
                </div>
              </div>
            )}
          </Card>

          <div>
            <Label htmlFor="action-select">Acción *</Label>
            <Select value={selectedActionId} onValueChange={setSelectedActionId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona una acción" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                {availableActions.map(action => (
                  <SelectItem key={action.id} value={action.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: action.hexColor }} />
                      <span>{action.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedActionId && (
            <div>
              <Label>Estado *</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Button type="button" variant={status === 'proposed' ? 'default' : 'outline'} onClick={() => setStatus('proposed')}
                  className={cn("justify-start", status === 'proposed' && "bg-primary text-primary-foreground")}>
                  <Package className="h-4 w-4 mr-2" />Propuesta
                </Button>
                <Button type="button" variant={status === 'delivered' ? 'default' : 'outline'} onClick={() => setStatus('delivered')}
                  className={cn("justify-start", status === 'delivered' && "bg-success text-success-foreground")}>
                  <CheckCircle className="h-4 w-4 mr-2" />Entregada
                </Button>
              </div>
            </div>
          )}

          {status === 'delivered' && (
            <div>
              <Label>Foto de evidencia</Label>
              <div className="mt-1">
                {photo ? (
                  <div className="relative">
                    <img src={photo} alt="Evidencia" className="w-full h-32 object-cover rounded-lg" />
                    <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => setPhoto("")}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button type="button" variant="outline" className="w-full h-32 border-dashed" onClick={() => fileInputRef.current?.click()}>
                    <div className="text-center">
                      <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Toca para agregar foto</p>
                    </div>
                  </Button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notas adicionales</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observaciones..." className="mt-1 min-h-[80px]" />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit} disabled={!selectedActionId} className="flex-1 bg-gradient-to-r from-primary to-primary-glow">
              {status === 'delivered' ? <><CheckCircle className="h-4 w-4 mr-2" />Registrar Entrega</> : <><Package className="h-4 w-4 mr-2" />Registrar Propuesta</>}
            </Button>
            <Button variant="outline" onClick={resetAndClose}>Cancelar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
