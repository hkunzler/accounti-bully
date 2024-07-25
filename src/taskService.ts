import { Preferences } from '@capacitor/preferences';
import { LocalNotifications } from '@capacitor/local-notifications';
import { fetchOpenAIResponse } from './openAIService';

export const saveTask = async (task: {
    id: number;
    name: string;
    date: string;
    completed: boolean;
}) => {
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

export const scheduleNotification = async (task: {
    id: any;
    name: any;
    date: any;
    completed?: boolean;
}) => {
    const notificationTime = new Date(task.date).getTime();
    const now = new Date().getTime();
    const delay = notificationTime - now;
    const result = await fetchOpenAIResponse(task.name);

    if (delay > 0) {
        await LocalNotifications.schedule({
            notifications: [
                {
                    title: 'Task Reminder',
                    body: result.choices[0].message.content,
                    id: Math.floor(Math.random() * 10000),
                    schedule: { at: new Date(notificationTime) },
                    actionTypeId: 'TASK_ACTIONS',
                    smallIcon: '🔥',
                    extra: { taskId: task.id, taskName: task.name },
                },
            ],
        });
    }
};

LocalNotifications.addListener(
    'localNotificationActionPerformed',
    async (notification) => {
        const actionId = notification.actionId;
        const taskId = notification.notification.extra.taskId;
        const taskName = notification.notification.extra.taskName;

        if (actionId === 'COMPLETE_TASK') {
            await markTaskAsCompleted(taskId);
            console.log(`Task with ID ${taskId} completed.`);
        } else if (actionId === 'REMIND_15_MIN') {
            const reminderTime = new Date(
                new Date().getTime() + 15 * 60 * 1000
            );
            const result = await fetchOpenAIResponse(taskName);

            await LocalNotifications.schedule({
                notifications: [
                    {
                        title: 'Task Reminder',
                        body: result.choices[0].message.content,
                        id: Math.floor(Math.random() * 10000),
                        schedule: { at: reminderTime },
                        actionTypeId: 'TASK_ACTIONS',
                        extra: { taskId: taskId, taskName: taskName },
                    },
                ],
            });
            console.log(
                `Reminder for task with ID ${taskId} rescheduled for 15 minutes later.`
            );
        }
    }
);
