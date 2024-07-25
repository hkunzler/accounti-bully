import { TaskButton, TaskItem as Item } from './Task.styles';
import { TaskItemProps } from './Task.interfaces';

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
