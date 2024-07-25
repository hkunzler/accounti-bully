export interface TaskFormProps {
    refreshTasks: () => void;
}

export interface TaskProps {
    id: number;
    name: string;
    date: string;
    completed?: boolean;
}

export interface TaskItemProps {
    task: TaskProps;
    markCompleted?: (id: number) => void;
    isActive: boolean;
}

export interface TaskListProps {
    tasks: TaskProps[];
    title: string;
    markCompleted?: (id: number) => void;
    isActive: boolean;
}

export interface TaskReminderProps {
    title: string;
    body: string;
    taskId: number;
    taskName: string;
    reminderTime: Date;
}

export interface TaskRemind15MinProps {
    taskName: string;
    taskId: number;
}
