import { TaskButton, TaskItem as Item } from './styledComponents';

interface TaskProps {
    id: number;
    name: string;
    date: string;
}

interface TaskItemProps {
    task: TaskProps;
    markCompleted?: (id: number) => void;
    isActive: boolean;
}

export const TaskItem = ({ task, markCompleted, isActive }: TaskItemProps) => {
    return (
        <Item $active={isActive}>
            {`${task.name}`}
            <br />
            {`${new Date(task.date).toLocaleString()}`}
            {markCompleted && (
                <TaskButton onClick={() => markCompleted(task.id)}>
                    Mark as Done
                </TaskButton>
            )}
        </Item>
    );
};
