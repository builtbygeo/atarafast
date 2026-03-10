import { auth, currentUser } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { report } = await req.json()
        if (!report) {
            return NextResponse.json({ error: 'No report provided' }, { status: 400 })
        }

        const client = await clerkClient()
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                lastAiReport: report,
                lastAiReportAt: new Date().toISOString()
            }
        })

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('Save AI report error:', err)
        return NextResponse.json({ error: 'Failed to save report', details: err.message }, { status: 500 })
    }
}
