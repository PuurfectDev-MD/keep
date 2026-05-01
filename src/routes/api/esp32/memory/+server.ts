
import { json } from '@sveltejs/kit'


export async function POST(event) {
    const deviceKey = event.request.headers.get('x-device-key')


    if (!deviceKey) return json({ error: "unauthorized" }, { status: 401 })

    const supabase = event.locals.supabaseAdmin

    const { data: keyRow, error: keyError } = await supabase.from('device_keys').select('user_id').eq("raw_key", deviceKey).single()


    if (keyError) {
        return json({ error: "unauthorized" }, { status: 401 })

    }

    const userId = keyRow.user_id

    const { filePaths, title, description, memoryId } = await event.request.json()



    const { error: dbError } = await supabase.from('memory').insert({
        id: memoryId,
        user_id: userId,
        title,
        description,
        images: filePaths
    })

    if (dbError) {
        await supabase.storage.from('memories').remove(filePaths)
        return json({ error: 'Failed please try again' }, { status: 500 })
    }

    return json({ success: true })
}