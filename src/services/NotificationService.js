import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications are displayed when the app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const registerForPushNotificationsAsync = async () => {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return false;
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return true;
    } catch (error) {
        console.log('Notification registration error:', error);
        return false;
    }
};

export const confirmTransaction = async (type, title, amount) => {
    const isIncome = type === 'income';
    await Notifications.scheduleNotificationAsync({
        content: {
            title: isIncome ? "💰 Income Added" : "💸 Expense Added",
            body: `${isIncome ? '✅' : '✅'} $${amount.toFixed(2)}: ${title}`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null,
    });
};

export const sendBudgetWarning = async (category, percentage) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: percentage >= 100 ? "🚨 Budget Exceeded!" : "⚠️ Budget Warning",
            body: percentage >= 100
                ? `You've used 100% of your ${category} budget!`
                : `You've used ${percentage}% of your weekly ${category} budget`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            data: { screen: 'Budget' },
        },
        trigger: null,
    });
};

export const sendMilestoneAlert = async (savings) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "🎉 Milestone Achievement!",
            body: `You saved $${savings.toLocaleString()} this month! Great job!`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null,
    });
};

export const scheduleDailyReminder = async () => {
    // Clear existing reminders first to avoid duplicates
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const hasReminder = scheduled.some(n => n.content.title === "⏰ Wallety Reminder");

    if (hasReminder) return;

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "⏰ Wallety Reminder",
            body: "Don't forget to log your daily expenses!",
            sound: true,
        },
        trigger: {
            hour: 20, // 8 PM
            minute: 0,
            repeats: true,
        },
    });
};
