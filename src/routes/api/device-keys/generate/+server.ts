import { json } from '@sveltejs/kit'
import { randomBytes } from 'crypto'

export async function POST(event) {
    const session = event.locals.session
    const db = event.locals.supabase
    if (!session) return json({ error: 'authorized' }, { status: 401 })

    const userId = session.user.id

    const existing = await db.from('device_keys').select('*').eq('user_id', userId).limit(1).single()

    if (existing.data) {
        return json({ key: existing.data.raw_key, label: existing.data.label })

    }

    const rawKey = randomBytes(32).toString('hex')

    const { error: insertErr } = await db.from("device_keys").insert({
        user_id: userId,
        raw_key: rawKey,
        label: 'My ESP32'
    })

    if (insertErr) {
        console.log(insertErr.message)
        return json({ error: "There was an error" }, { status: 401 })
    }

    return json({ key: rawKey, label: 'My Esp32' })
}