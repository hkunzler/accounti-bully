import { useEffect } from 'react';
import {
    ActionPerformed,
    LocalNotifications,
    PermissionStatus,
} from '@capacitor/local-notifications';

export const useNotification = (
    refreshTasks: () => Promise<void>,
    markTaskAsCompleted: (taskId: number) => Promise<void>
) => {
    const requestPermissions = async (): Promise<PermissionStatus> =>
        LocalNotifications.requestPermissions();

    const setupNotificationListener = async (
        shouldListen: boolean = true
    ): Promise<void> => {
        if (shouldListen)
            await LocalNotifications.addListener(
                'localNotificationActionPerformed',
                async (notificationAction: ActionPerformed) => {
                    const taskId =
                        notificationAction.notification.extra?.taskId;
                    if (taskId) {
                        await markTaskAsCompleted(taskId);
                        await refreshTasks();
                    }
                }
            );
        else LocalNotifications.removeAllListeners();
    };

    useEffect(() => {
        setupNotificationListener();
        return () => {
            setupNotificationListener(false);
        };
    }, []);

    return { requestPermissions, setupNotificationListener };
};
