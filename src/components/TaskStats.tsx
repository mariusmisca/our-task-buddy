import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, Target } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}

interface TaskStatsProps {
  tasks: Task[];
}

export const TaskStats = ({ tasks }: TaskStatsProps) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <Card className="p-4 text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
        <div className="text-2xl font-bold text-primary">{totalTasks}</div>
        <div className="text-xs text-muted-foreground">Total</div>
      </Card>
      
      <Card className="p-4 text-center bg-gradient-to-br from-success/5 to-success/10 border-success/20">
        <CheckCircle className="h-6 w-6 mx-auto mb-2 text-success" />
        <div className="text-2xl font-bold text-success">{completedTasks}</div>
        <div className="text-xs text-muted-foreground">Completadas</div>
      </Card>
      
      <Card className="p-4 text-center bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
        <Clock className="h-6 w-6 mx-auto mb-2 text-accent" />
        <div className="text-2xl font-bold text-accent">{pendingTasks}</div>
        <div className="text-xs text-muted-foreground">Pendientes</div>
      </Card>
    </div>
  );
};