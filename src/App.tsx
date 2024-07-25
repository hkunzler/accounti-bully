import React, { useEffect, useState } from 'react';
import {
    getActiveTasks,
    getCompletedTasks,
    markTaskAsCompleted,
    saveTask,
    scheduleNotification,
} from './taskService';
import { LocalNotifications } from '@capacitor/local-notifications';
import styled from 'styled-components';

const Container = styled.div`
    background-color: #fff;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    margin-top: 2rem;
`;

const Title = styled.h1`
    text-align: center;
`;

const Subtitle = styled.h2`
    text-align: center;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
`;

const Input = styled.input`
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const Button = styled.button`
    padding: 0.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    background-color: var(--marian-blue);
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: var(--space-cadet);
    }
`;

const TaskList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const TaskItem = styled.li<{ $active: boolean }>`
    margin: 0.5rem 0;
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    opacity: ${(props) => (props.$active ? '1' : '0.5')};
`;

const TaskButton = styled.button`
    background-color: var(--true-blue);
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: var(--marian-blue);
    }
`;

const App = () => {
    const [taskName, setTaskName] = useState('');
    const [taskDate, setTaskDate] = useState('');
    const [activeTasks, setActiveTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);

    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        const task = {
            id: Date.now(),
            name: taskName,
            date: taskDate,
            completed: false,
        };
        await saveTask(task);
        await scheduleNotification(task);
        const updatedActiveTasks = await getActiveTasks();
        setActiveTasks(updatedActiveTasks);
        setTaskName('');
        setTaskDate('');
    };

    const handleMarkAsCompleted = async (taskId: number) => {
        await markTaskAsCompleted(taskId);
        const updatedActiveTasks = await getActiveTasks();
        const updatedCompletedTasks = await getCompletedTasks();
        setActiveTasks(updatedActiveTasks);
        setCompletedTasks(updatedCompletedTasks);
    };

    const checkNotificationPermission = async () =>
        await LocalNotifications.requestPermissions();

    useEffect(() => {
        const fetchTasks = async () => {
            const activeTasks = await getActiveTasks();
            const completedTasks = await getCompletedTasks();
            setActiveTasks(activeTasks);
            setCompletedTasks(completedTasks);
        };

        checkNotificationPermission();
        fetchTasks();

        const setupNotificationListener = async () => {
            const notificationActionListener =
                await LocalNotifications.addListener(
                    'localNotificationActionPerformed',
                    async ({ actionId, notification }) => {
                        console.log(
                            'Notification Action Performed:',
                            notification
                        );
                        const taskId = notification.extra.taskId;

                        if (actionId === 'COMPLETE_TASK') {
                            await handleMarkAsCompleted(taskId);
                        }
                    }
                );

            return () => notificationActionListener.remove();
        };

        let removeListener: () => void;
        setupNotificationListener().then((remove) => (removeListener = remove));

        return () => {
            if (removeListener) removeListener();
        };
    }, []);

    return (
        <Container>
            <Title>Accounti-bully</Title>
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
            <Subtitle>Active Tasks:</Subtitle>
            <TaskList>
                {activeTasks.map(
                    (task: { id: number; name: string; date: string }) => (
                        <TaskItem $active={true} key={task.id}>
                            {`${task.name}`}
                            <br />
                            {`${new Date(task.date).toLocaleString()}`}
                            <TaskButton
                                onClick={() => handleMarkAsCompleted(task.id)}
                            >
                                Mark as Done
                            </TaskButton>
                        </TaskItem>
                    )
                )}
            </TaskList>
            <Subtitle>Completed Tasks:</Subtitle>
            <TaskList>
                {completedTasks.map(
                    (task: { id: number; name: string; date: string }) => (
                        <TaskItem $active={false} key={task.id}>
                            <div>{task.name}</div>
                            <div>{new Date(task.date).toLocaleString()}</div>
                        </TaskItem>
                    )
                )}
            </TaskList>
        </Container>
    );
};

export default App;
