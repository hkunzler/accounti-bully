import { TaskItem } from './TaskItem';

import { TaskListProps } from './Task.interfaces';
import { Subtitle, TaskList as List } from './Task.styles';

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
