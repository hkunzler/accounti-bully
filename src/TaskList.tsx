import { TaskItem } from './TaskItem';
import { Subtitle, TaskList as List } from './styledComponents';

interface TaskProps {
    id: number;
    name: string;
    date: string;
}

interface TaskListProps {
    tasks: TaskProps[];
    title: string;
    markCompleted?: (id: number) => void;
    isActive: boolean;
}

export const TaskList = ({
    tasks,
    title,
    markCompleted,
    isActive,
}: TaskListProps) => {
    return (
        <>
            <Subtitle>{title}</Subtitle>
            <List>
                {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        markCompleted={markCompleted}
                        isActive={isActive}
                    />
                ))}
            </List>
        </>
    );
};
