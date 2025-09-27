import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Trash2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskCard = ({ task, onToggleComplete, onDelete }: TaskCardProps) => {
  return (
    <Card className={cn(
      "p-4 mb-3 transition-all duration-300 hover:shadow-lg",
      "bg-card border border-border shadow-sm",
      task.completed && "opacity-75 bg-success/5 border-success/20"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleComplete(task.id)}
            className={cn(
              "p-2 h-8 w-8 rounded-full shrink-0 transition-all duration-300",
              task.completed 
                ? "bg-success text-success-foreground hover:bg-success/90 shadow-sm" 
                : "border-2 border-border hover:border-primary hover:bg-primary/5"
            )}
          >
            {task.completed ? (
              <Check className="h-4 w-4" />
            ) : (
              <div className="h-4 w-4" />
            )}
          </Button>
          
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-medium text-card-foreground transition-all duration-300",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            {task.description && (
              <p className={cn(
                "text-sm text-muted-foreground mt-1",
                task.completed && "line-through"
              )}>
                {task.description}
              </p>
            )}
            <span className="text-xs text-muted-foreground">
              {task.createdAt.toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
        
        <div className="flex gap-1 shrink-0">
          {task.completed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleComplete(task.id)}
              className="p-2 h-8 w-8 text-muted-foreground hover:text-primary"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="p-2 h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};