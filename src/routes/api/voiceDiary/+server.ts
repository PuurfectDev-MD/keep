import { json } from '@sveltejs/kit'

export async function POST(event) {
    const { data: { session } } = await event.locals.supabase.auth.getSession()
    if (!session) return json({ error: "unauthorized" }, { status: 401 })


    const supabase = event.locals.supabase
    const { filePath, voiceDiaryId } = await event.request.json()

    const userId = session.user.id
    const { error: dbError } = await supabase.from('voiceDiary').insert({
        id: voiceDiaryId,
        user_id: userId,
        audio: filePath
    })

    if (dbError) {
        await supabase.storage.from("voiceDiary").remove(filePath)
        return json({ error: 'Failed try again.' }, { status: 500 })

    }

    return json({ success: true })

}