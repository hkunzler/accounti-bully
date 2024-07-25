import { useEffect, useState } from 'react';
import {
    getActiveTasks,
    getCompletedTasks,
    markTaskAsCompleted,
} from './services/taskService';
import { LocalNotifications } from '@capacitor/local-notifications';
import TaskForm from './components/Task/TaskForm';
import { TaskList } from './components/Task/TaskList';
import { Container, Title } from './components/Task/Task.styles';
import { TaskProps } from './components/Task/Task.interfaces';

const App = () => {
    const [activeTasks, setActiveTasks] = useState<TaskProps[]>([]);
    const [completedTasks, setCompletedTasks] = useState<TaskProps[]>([]);

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

        const setupNotificationListener = async () =>
            await LocalNotifications.addListener(
                'localNotificationActionPerformed',
                async ({ notification }) => {
                    if (notification.extra && notification.extra.taskId) {
                        await markTaskAsCompleted(notification.extra.taskId);
                        await refreshTasks();
                    }
                }
            );

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
