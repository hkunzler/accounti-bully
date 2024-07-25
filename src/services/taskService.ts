import { Preferences } from '@capacitor/preferences';
import { TaskProps } from '../components/Task/Task.interfaces';

export const saveTask = async (task: TaskProps) => {
    const tasks = await getTasks();
    tasks.push(task);
    await Preferences.set({
        key: 'tasks',
        value: JSON.stringify(tasks),
    });
};

export const getTasks = async () => {
    try {
        const { value } = await Preferences.get({ key: 'tasks' });
        return value ? JSON.parse(value) : [];
    } catch (error) {
        console.error('Error accessing preferences:', error);
        throw error;
    }
};

export const markTaskAsCompleted = async (taskId: number) => {
    const tasks = await getTasks();
    const updatedTasks = tasks.map((task: { id: number }) =>
        task.id === taskId ? { ...task, completed: true } : task
    );
    await Preferences.set({
        key: 'tasks',
        value: JSON.stringify(updatedTasks),
    });
};

export const getActiveTasks = async () => {
    const tasks = await getTasks();
    return tasks.filter((task: { completed: boolean }) => !task.completed);
};

export const getCompletedTasks = async () => {
    const tasks = await getTasks();
    return tasks.filter((task: { completed: boolean }) => task.completed);
};
