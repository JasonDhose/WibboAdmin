import type { NotificationAlert } from "~/types"

const notifications = ref<NotificationAlert[]>([])

let timeoutId = 0
let notificationId = 0

export const useNotification = () => {
  const showMessage = ({ message = '', success = false, copy = undefined }: Partial<NotificationAlert>) => {
    notifications.value.push({ id: notificationId++, message, success, copy })

    if (notifications.value.length > 5) notifications.value.shift()

    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = window.setTimeout(() => (notifications.value = []), 30_000)
  }

  return { notifications, showMessage }
}
