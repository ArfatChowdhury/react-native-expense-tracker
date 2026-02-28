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
export const scheduleMonthlySummaryAlert = async () => {
    // Schedule for the last day of the current month at 8 PM
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // If today is already past the last day's 8 PM, schedule for next month
    let triggerDate = new Date(lastDay);
    triggerDate.setHours(20, 0, 0, 0);

    if (now > triggerDate) {
        const nextMonthLastDay = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        triggerDate = new Date(nextMonthLastDay);
        triggerDate.setHours(20, 0, 0, 0);
    }

    // Clear existing to avoid spam
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const hasSummaryAlert = scheduled.some(n => n.content.title === "📊 Monthly Summary Ready!");

    if (hasSummaryAlert) return;

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "📊 Monthly Summary Ready!",
            body: "Your final results for this month are in! Tap to see how you did.",
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: triggerDate,
    });
};
