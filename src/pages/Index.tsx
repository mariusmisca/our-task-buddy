import { useState, useEffect } from "react";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskForm } from "@/components/AddTaskForm";
import { TaskStats } from "@/components/TaskStats";
import { useToast } from "@/hooks/use-toast";
import { CheckSquare, Smartphone } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks');
    if (savedTasks) {
      return JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
    }
    return [];
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, description?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      createdAt: new Date()
    };
    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Tarea agregada",
      description: "Tu nueva tarea ha sido creada exitosamente.",
    });
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, completed: !task.completed };
        toast({
          title: updatedTask.completed ? "Tarea completada" : "Tarea pendiente",
          description: updatedTask.completed 
            ? "¡Excelente trabajo!" 
            : "Tarea marcada como pendiente.",
        });
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Tarea eliminada",
      description: "La tarea ha sido eliminada exitosamente.",
      variant: "destructive"
    });
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-primary to-primary-glow rounded-2xl shadow-lg">
              <CheckSquare className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Smartphone className="h-4 w-4" />
                <span>Seguimiento móvil</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <TaskStats tasks={tasks} />

        {/* Add Task Form */}
        <div className="mb-6">
          <AddTaskForm onAddTask={addTask} />
        </div>

        {/* Tasks List */}
        <div className="space-y-6">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                Tareas Pendientes ({pendingTasks.length})
              </h2>
              <div>
                {pendingTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleTaskComplete}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                Completadas ({completedTasks.length})
              </h2>
              <div>
                {completedTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleTaskComplete}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {tasks.length === 0 && (
            <div className="text-center py-12">
              <div className="p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-3xl mb-4 inline-block">
                <CheckSquare className="h-16 w-16 text-muted-foreground mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                ¡Comienza tu productividad!
              </h3>
              <p className="text-muted-foreground">
                Agrega tu primera tarea para empezar a organizar tu día.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
