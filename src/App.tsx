import { useEffect, useState } from 'react';
import {
    getActiveTasks,
    getCompletedTasks,
    markTaskAsCompleted,
} from './services/taskService';
import { TaskForm } from './components/Task/TaskForm';
import { TaskList } from './components/Task/TaskList';
import { Container, Title } from './components/Task/Task.styles';
import { TaskProps } from './components/Task/Task.interfaces';
import { useNotification } from './hooks/useNotification';

const App = () => {
    const [activeTasks, setActiveTasks] = useState<TaskProps[]>([]);
    const [completedTasks, setCompletedTasks] = useState<TaskProps[]>([]);

    const refreshTasks = async () => {
        try {
            const [updatedActiveTasks, updatedCompletedTasks] =
                await Promise.all([getActiveTasks(), getCompletedTasks()]);
            setActiveTasks(updatedActiveTasks);
            setCompletedTasks(updatedCompletedTasks);
        } catch (error) {
            console.error('Failed to refresh tasks', error);
        }
    };

    const { requestPermissions, setupNotificationListener } = useNotification(
        refreshTasks,
        markTaskAsCompleted
    );

    useEffect(() => {
        const init = async () => {
            await requestPermissions();
            await refreshTasks();
        };

        init();

        return () => {
            setupNotificationListener(false);
        };
    }, []);

    useEffect(() => {
        refreshTasks();
    }, [completedTasks]);

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
