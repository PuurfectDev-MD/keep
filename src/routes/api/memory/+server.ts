import { json } from '@sveltejs/kit'

export async function POST(event) {
    const { data: { session } } = await event.locals.supabase.auth.getSession();

    if (!session) return json({ error: "unauthorized" }, { status: 401 })

    const supabase = event.locals.supabase
    const { filePaths, title, description, memoryId } = await event.request.json()


    const userId = session.user.id


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