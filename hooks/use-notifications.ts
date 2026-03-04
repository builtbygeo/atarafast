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

    const sendNotification = useCallback(async (title: string, options?: NotificationOptions) => {
        if (typeof window === "undefined" || !("Notification" in window) || Notification.permission !== "granted") return

        // Prefer SW postMessage — works reliably on iOS PWA
        if ("serviceWorker" in navigator) {
            try {
                const reg = await navigator.serviceWorker.ready
                reg.active?.postMessage({
                    type: "SHOW_NOTIFICATION",
                    title,
                    body: (options as any)?.body ?? "",
                })
                return
            } catch {
                // fall through to direct Notification
            }
        }

        // Fallback for non-SW environments
        new Notification(title, options)
    }, [])

    return { permission, requestPermission, sendNotification }
}
