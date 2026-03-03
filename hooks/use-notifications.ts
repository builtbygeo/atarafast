"use client"

import { useState, useEffect, useCallback } from "react"

export function useNotifications() {
    const [permission, setPermission] = useState<NotificationPermission>("default")

    useEffect(() => {
        if (typeof window !== "undefined" && "Notification" in window) {
            setPermission(Notification.permission)
        }
    }, [])

    const requestPermission = useCallback(async () => {
        if (typeof window === "undefined" || !("Notification" in window)) return "default"
        const result = await Notification.requestPermission()
        setPermission(result)
        return result
    }, [])

    const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
        if (typeof window === "undefined" || !("Notification" in window) || Notification.permission !== "granted") return

        // Check for Service Worker registration
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(title, options)
            })
        } else {
            new Notification(title, options)
        }
    }, [])

    return { permission, requestPermission, sendNotification }
}
