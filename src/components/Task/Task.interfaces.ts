export interface TaskFormProps {
    refreshTasks: () => void;
}

export interface TaskProps {
    id: number;
    name: string;
    date: string;
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
