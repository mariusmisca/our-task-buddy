import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddTaskFormProps {
  onAddTask: (title: string, description?: string) => void;
}

export const AddTaskForm = ({ onAddTask }: AddTaskFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title.trim(), description.trim() || undefined);
      setTitle("");
      setDescription("");
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full h-14 bg-gradient-to-r from-primary to-primary-glow",
          "hover:shadow-lg hover:shadow-primary/25 transition-all duration-300",
          "text-primary-foreground font-medium rounded-xl",
          "shadow-sm border-0"
        )}
      >
        <Plus className="mr-2 h-5 w-5" />
        Agregar Nueva Tarea
      </Button>
    );
  }

  return (
    <Card className="p-4 border border-border shadow-sm bg-card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-card-foreground">Nueva Tarea</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="p-2 h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <Input
          placeholder="Título de la tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-border focus:border-primary focus:ring-primary/20"
          autoFocus
        />
        
        <Textarea
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-border focus:border-primary focus:ring-primary/20 min-h-[80px] resize-none"
        />
        
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={!title.trim()}
            className={cn(
              "flex-1 bg-gradient-to-r from-primary to-primary-glow",
              "hover:shadow-md hover:shadow-primary/25 transition-all duration-300",
              "text-primary-foreground border-0"
            )}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="border-border text-muted-foreground hover:text-foreground"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
};