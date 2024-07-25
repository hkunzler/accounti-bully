import { useState } from 'react';
import { saveTask } from '../../services/taskService';
import { Button, Form, Input } from './Task.styles';
import { TaskFormProps } from './Task.interfaces';
import { scheduleNotification } from '../../services/notificationService';

export const TaskForm = ({ refreshTasks }: TaskFormProps) => {
    const [taskName, setTaskName] = useState<string>('');
    const [taskDate, setTaskDate] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const task = {
            id: Date.now(),
            name: taskName,
            date: taskDate,
            completed: false,
        };
        await saveTask(task);
        await scheduleNotification(task);
        refreshTasks();
        setTaskName('');
        setTaskDate('');
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Task Name"
                required
            />
            <Input
                type="datetime-local"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                required
            />
            <Button type="submit">Save Task</Button>
        </Form>
    );
};
