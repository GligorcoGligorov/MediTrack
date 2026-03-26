import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'

// @ts-ignore
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log('Must use physical device for notifications')
    return false
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    console.log('Permission not granted for notifications')
    return false
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    })
  }

  return true
}

export async function scheduleMedicationNotification(
  medicationName: string,
  time: string,
  medicationId: number
) {
  // Cancel existing notification for this medication
  await Notifications.cancelScheduledNotificationAsync(
    medicationId.toString()
  )

  // Parse time string e.g. "8:00 AM"
  const [timePart, modifier] = time.split(' ')
  let [hours, minutes] = timePart.split(':').map(Number)

  if (modifier === 'PM' && hours !== 12) hours += 12
  if (modifier === 'AM' && hours === 12) hours = 0

  await Notifications.scheduleNotificationAsync({
    identifier: medicationId.toString(),
    content: {
      title: '💊 Medication Reminder',
      body: `Time to take your ${medicationName}!`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hours,
      minute: minutes,
    },
  })
}

export async function cancelMedicationNotification(medicationId: number) {
  await Notifications.cancelScheduledNotificationAsync(
    medicationId.toString()
  )
}