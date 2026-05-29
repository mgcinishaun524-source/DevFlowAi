import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, MoreHorizontal, GripVertical } from 'lucide-react';
import { Task } from '../types';
import { cn } from '../lib/utils';
import { collection, onSnapshot, query, where, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { joinProject, emitTaskUpdate, getSocket } from '../services/socketService';

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
}

function SortableTaskCard({ task, remoteUser }: { task: Task, remoteUser?: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    scale: remoteUser ? 0.98 : 1,
  };

  const priorityColors = {
    low: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    medium: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    high: 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-brand-surface/60 p-4 rounded border border-brand-border group hover:border-brand-accent/50 transition-all duration-300 shadow-lg relative overflow-hidden",
        remoteUser && "border-white/20 opacity-80"
      )}
    >
      {remoteUser && (
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] flex flex-col items-center justify-center z-20">
          <div className="bg-white/10 px-2 py-1 rounded-full border border-white/20 animate-pulse">
            <span className="text-[6px] font-mono font-bold text-white uppercase tracking-[0.2em]">
              SYNCING: {remoteUser}
            </span>
          </div>
        </div>
      )}
      <div className="flex items-start justify-between mb-3">
        <span className={cn("text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border", priorityColors[task.priority])}>
          {task.priority}
        </span>
        <div {...attributes} {...listeners} className="cursor-grab text-slate-600 hover:text-brand-accent transition-colors">
          <GripVertical size={14} />
        </div>
      </div>
      <h4 className="text-xs font-mono font-bold text-slate-200 mb-2 uppercase tracking-tight">{task.title}</h4>
      <p className="text-[10px] text-slate-500 line-clamp-2 font-sans leading-relaxed">{task.description}</p>
    </div>
  );
}

export default function KanbanBoard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [remoteDragging, setRemoteDragging] = useState<{[key: string]: string}>({}); // taskId -> userName
  const [projectId] = useState('demo-project');

  const [activeUsers, setActiveUsers] = useState<{ userId: string, displayName: string }[]>([]);

  useEffect(() => {
    if (user) {
      joinProject(projectId, user.uid, user.displayName || 'Anonymous Operator');
    }
    
    const q = query(collection(db, 'projects', projectId, 'tasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(tasksData);
    });

    const socket = getSocket();
    socket.on('task-updated', (data) => {
      console.log('Real-time update received:', data);
    });

    socket.on('presence-update', (users) => {
      setActiveUsers(users);
    });

    socket.on('task-dragging', (data: { taskId: string, userName: string }) => {
      setRemoteDragging(prev => ({ ...prev, [data.taskId]: data.userName }));
    });

    socket.on('task-dropped', (taskId: string) => {
      setRemoteDragging(prev => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
    });

    return () => {
      unsubscribe();
      socket.off('task-updated');
      socket.off('presence-update');
      socket.off('task-dragging');
      socket.off('task-dropped');
    };
  }, [projectId, user]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns = [
    { id: 'todo', title: 'Pending Analysis' },
    { id: 'in-progress', title: 'Active Processing' },
    { id: 'done', title: 'Execution Complete' },
  ];

  const handleDragStart = (event: any) => {
    const taskId = event.active.id;
    setActiveId(taskId);
    getSocket().emit('task-dragging', { projectId, taskId, userName: user?.displayName || 'Anonymous' });
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    const taskId = active.id;
    
    getSocket().emit('task-dropped', { projectId, taskId });

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTask = tasks.find(t => t.id === active.id);
    const overId = over.id;

    let newStatus = overId;
    if (!['todo', 'in-progress', 'done'].includes(overId)) {
      const overTask = tasks.find(t => t.id === overId);
      newStatus = overTask?.status || activeTask?.status;
    }

    if (activeTask && activeTask.status !== newStatus) {
      const taskRef = doc(db, 'projects', projectId, 'tasks', activeTask.id);
      await updateDoc(taskRef, { status: newStatus });
      emitTaskUpdate(projectId, activeTask.id, newStatus as string);
    }

    setActiveId(null);
  };

  const addTask = async (status: string) => {
    const title = window.prompt('Initialize Task Name:');
    if (!title) return;

    await addDoc(collection(db, 'projects', projectId, 'tasks'), {
      projectId,
      title,
      description: 'System generated task description...',
      status,
      priority: 'medium',
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div className="h-full flex flex-col space-y-6 cyber-grid">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-brand-accent uppercase tracking-tighter">Operations Matrix</h2>
          <p className="tech-label">Real-time task synchronization and neural processing.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {activeUsers.length > 0 ? (
              activeUsers.map((u, i) => (
                <div 
                  key={u.userId + i} 
                  title={u.displayName}
                  className="w-8 h-8 rounded border border-brand-accent/50 bg-brand-surface flex items-center justify-center text-[8px] font-mono font-bold text-brand-accent shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-pulse"
                >
                  {u.displayName?.substring(0, 2).toUpperCase() || '??'}
                </div>
              ))
            ) : (
              [1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded border border-slate-700 bg-brand-surface/20 flex items-center justify-center text-[8px] font-mono font-bold text-slate-600">
                  ...
                </div>
              ))
            )}
          </div>
          <button 
            onClick={() => addTask('todo')}
            className="tech-button flex items-center gap-2"
          >
            <Plus size={14} />
            Initialize
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden min-h-0">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {columns.map(column => (
            <div key={column.id} className="glass-panel flex flex-col min-h-0 glow-border">
              <div className="p-4 flex items-center justify-between border-b border-brand-border bg-brand-surface/40">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></div>
                  <h3 className="tech-label text-slate-200">{column.title}</h3>
                  <span className="bg-brand-accent/10 text-brand-accent text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-brand-accent/20">
                    {tasks.filter(t => t.status === column.id).length}
                  </span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    addTask(column.id);
                  }}
                  className="text-slate-500 hover:text-brand-accent transition-colors p-1 rounded hover:bg-brand-accent/10"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="p-4 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                <SortableContext
                  items={tasks.filter(t => t.status === column.id).map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {tasks
                    .filter(t => t.status === column.id)
                    .map(task => (
                      <SortableTaskCard 
                        key={task.id} 
                        task={task} 
                        remoteUser={remoteDragging[task.id]}
                      />
                    ))}
                </SortableContext>
              </div>
            </div>
          ))}
          
          <DragOverlay>
            {activeId ? (
              <div className="bg-brand-accent/20 p-4 rounded border border-brand-accent shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-md rotate-2">
                <h4 className="text-xs font-mono font-bold text-brand-accent uppercase">
                  {tasks.find(t => t.id === activeId)?.title}
                </h4>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
