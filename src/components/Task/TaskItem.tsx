import { TaskButton, TaskItem as Item } from './Task.styles';
import { TaskItemProps } from './Task.interfaces';

export const TaskItem = ({ task, markCompleted, isActive }: TaskItemProps) => {
    return (
        <Item $active={isActive}>
            {`${task.name}`}
            <br />
            {new Date(task.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })}
            <br />
            {new Date(task.date).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })}
            {markCompleted && (
                <TaskButton onClick={() => markCompleted(task.id)}>
                    Mark as Done
                </TaskButton>
            )}
        </Item>
    );
};
