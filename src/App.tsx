import { useEffect, useState } from 'react';
import {
    getActiveTasks,
    getCompletedTasks,
    markTaskAsCompleted,
} from './taskService';
import { LocalNotifications } from '@capacitor/local-notifications';
import TaskForm from './TaskForm';
import { Container, Title } from './styledComponents';
import { TaskList } from './TaskList';

interface Task {
    id: number;
    name: string;
    date: string;
    completed: boolean;
}

const App = () => {
    const [activeTasks, setActiveTasks] = useState<Task[]>([]);
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

    const refreshTasks = async () => {
        const updatedActiveTasks = await getActiveTasks();
        const updatedCompletedTasks = await getCompletedTasks();
        setActiveTasks(updatedActiveTasks);
        setCompletedTasks(updatedCompletedTasks);
    };

    useEffect(() => {
        const init = async () => {
            await LocalNotifications.requestPermissions();
            await refreshTasks();
            setupNotificationListener();
        };

        const setupNotificationListener = async () => {
            await LocalNotifications.addListener(
                'localNotificationActionPerformed',
                async ({ notification }) => {
                    if (notification.extra && notification.extra.taskId) {
                        await markTaskAsCompleted(notification.extra.taskId);
                        await refreshTasks();
                    }
                }
            );
        };

        init();

        return () => {
            LocalNotifications.removeAllListeners();
        };
    }, []);
    return (
        <Container>
            <Title>Accounti-bully</Title>
            <TaskForm refreshTasks={refreshTasks} />
            <TaskList
                tasks={activeTasks}
                title="Active Tasks:"
                markCompleted={markTaskAsCompleted}
                isActive={true}
            />
            <TaskList
                tasks={completedTasks}
                title="Completed Tasks:"
                isActive={false}
            />
        </Container>
    );
};

export default App;
