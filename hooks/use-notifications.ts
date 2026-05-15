"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { getSettings } from "@/lib/storage"

export function useNotifications() {
    const [permission, setPermission] = useState<NotificationPermission>("default")
    const scheduledRef = useRef<Set<string>>(new Set())

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
        if (typeof window === "undefined" || !("Notification" in window)) return
        if (Notification.permission !== "granted") return
        if (!getSettings().notificationsEnabled) return

        // Always show system notification (best-effort for PWA background)
        // iOS will only show this if the PWA is still running in background
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

        new Notification(title, options)
    }, [])

    const scheduleNotification = useCallback((id: string, timestamp: number, title: string, options?: NotificationOptions) => {
        // Prevent duplicate scheduling
        if (scheduledRef.current.has(id)) return
        scheduledRef.current.add(id)

        const now = Date.now()
        const delay = timestamp - now

        if (delay <= 0) {
            // Already passed, send immediately if app was backgrounded
            sendNotification(title, options)
            return
        }

        // Best-effort: schedule a timeout. This will fire when:
        // - App is visible (shows in-app toast + system notification)
        // - App is backgrounded on iOS (may fire if not suspended, otherwise fires on resume)
        const timer = setTimeout(() => {
            scheduledRef.current.delete(id)
            sendNotification(title, options)
        }, delay)

        // Cleanup on unmount or reschedule
        return () => {
            clearTimeout(timer)
            scheduledRef.current.delete(id)
        }
    }, [sendNotification])

    const cancelScheduled = useCallback((id: string) => {
        scheduledRef.current.delete(id)
    }, [])

    return { permission, requestPermission, sendNotification, scheduleNotification, cancelScheduled }
}
