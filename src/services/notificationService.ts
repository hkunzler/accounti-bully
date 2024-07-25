import {
    ActionPerformed,
    LocalNotifications,
} from '@capacitor/local-notifications';
import { fetchOpenAIResponse } from './openAIService';
import { markTaskAsCompleted } from './taskService';
import {
    TaskProps,
    TaskRemind15MinProps,
    TaskReminderProps,
} from '../components/Task/Task.interfaces';

const COMPLETE_TASK = 'COMPLETE_TASK';
const REMIND_15_MIN = 'REMIND_15_MIN';
const TASK_ACTIONS = 'TASK_ACTIONS';

export const scheduleNotification = async (task: TaskProps) => {
    const notificationTime = new Date(task.date).getTime();
    const now = new Date().getTime();
    const delay = notificationTime - now;
    const result = await fetchOpenAIResponse(task.name);

    if (delay > 0)
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
};

const handleNotificationAction = async (notification: ActionPerformed) => {
    const {
        actionId,
        notification: {
            extra: { taskId, taskName },
        },
    } = notification;

    switch (actionId) {
        case COMPLETE_TASK:
            await markTaskAsCompleted(taskId);
            break;
        case REMIND_15_MIN:
            await handleRemind15Min({ taskName, taskId });
            break;
        default:
            console.error(`Unhandled action: ${actionId}`);
            break;
    }
};

LocalNotifications.addListener(
    'localNotificationActionPerformed',
    handleNotificationAction
);

const handleRemind15Min = async ({
    taskName,
    taskId,
}: TaskRemind15MinProps) => {
    const reminderTime = getFutureTime(15);
    const result = await fetchOpenAIResponse(taskName);

    await scheduleTaskReminder({
        title: 'Task Reminder',
        body: result.choices[0].message.content,
        taskId: taskId,
        taskName: taskName,
        reminderTime: reminderTime,
    });
};

const getFutureTime = (minutes: number) =>
    new Date(new Date().getTime() + minutes * 60 * 1000);

const scheduleTaskReminder = async ({
    title,
    body,
    taskId,
    taskName,
    reminderTime,
}: TaskReminderProps) => {
    const notificationId = new Date().getTime();

    await LocalNotifications.schedule({
        notifications: [
            {
                title,
                body,
                id: notificationId,
                schedule: { at: reminderTime },
                actionTypeId: TASK_ACTIONS,
                extra: { taskId, taskName },
            },
        ],
    });
};
