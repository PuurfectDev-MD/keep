import { command, getRequestEvent, query } from "$app/server";
import * as v from 'valibot'


type MemoryEntry = {
    type: "success"
    id: string
    title: string | null
    description: string | null
    imageUrls: string[]
    date: string
} | {
    type: "db_error"
    message: string
}


type voiceDiaryEntry = {
    type: "success"
    audioUrl: string | null
    date: string
} | {
    type: "db_error"
    message: string
}



export const getUserDashboardInfo = query(v.string(), async (id) => {
    const event = getRequestEvent()


    const recentMemories = event.locals.supabase.from("memory").select("*").eq("user_id", id).limit(4).order("created_at", { ascending: false })
    const recentVoice = event.locals.supabase.from("voiceDiary").select("*").eq("user_id", id).limit(4).order("created_at", { ascending: false })

    const [memoriesResult, voiceResult] = await Promise.all([recentMemories, recentVoice])
    if (memoriesResult.error || voiceResult.error) {
        console.log(memoriesResult.error?.message)
        return { type: "db_error", message: "There was an error fetching your data" }
    }

    const memories: MemoryEntry[] = await Promise.all(memoriesResult.data.map(async (memory: any) => {
        const urlResult = await fetchMemoryUrls(event.locals.supabase, id, memory.id)
        if (urlResult.type == "db_error" as const) {
            console.log(urlResult.message)
            return urlResult
        }

        return {
            type: "success" as const,
            id: memory.id,
            title: memory.title,
            description: memory.description,
            imageUrls: urlResult.urls,
            date: memory.created_at

        }
    }))

    const voices: voiceDiaryEntry[] = await Promise.all(voiceResult.data.map(async (voice: any) => {
        const urlResult = await fetchAudioUrls(event.locals.supabase, id, voice.id)
        if (urlResult.type == "db_error" as const) {
            console.log(urlResult.message)
            return urlResult
        }

        return {
            type: "success" as const,
            audioUrl: urlResult.urls[0] ?? null,
            date: voice.created_at
        }
    }))

    return {
        type: "success",
        memories: memories,
        voices: voices
    }
})





async function fetchAudioUrls(supabase: any, userId: string, voiceId: string) {
    const { data: audioFilesList, error: audioFetchErr } = await supabase.storage.from("voiceDiary").list(`${userId}/${voiceId}`)

    if (audioFetchErr) {
        console.log(audioFetchErr.message)
        return { type: "db_error" as const, message: "There was an error listing voice files" }
    }

    const AudioUrls = audioFilesList.map((file: any) => {
        const { data } = supabase
            .storage
            .from("voiceDiary")
            .getPublicUrl(`${userId}/${voiceId}/${file.name}`)

        return data.publicUrl
    })

    return {
        type: "success" as const, urls: AudioUrls
    }
}



async function fetchMemoryUrls(supabase: any, userId: string, memoryId: string) {

    const { data: files, error: memoryFetchErr } = await supabase  // the bucket (memories)
        .storage
        .from("memories")
        .list(`${userId}/${memoryId}`)

    if (memoryFetchErr) {
        console.log(memoryFetchErr.message)

        return { type: "db_error" as const, message: memoryFetchErr.message }
    }
    const Imgurls = files.map((file: any) => {
        const { data } = supabase
            .storage
            .from("memories")
            .getPublicUrl(`${userId}/${memoryId}/${file.name}`)
        return data.publicUrl
    })

    return { type: "success" as const, urls: Imgurls }

}



export const getUserStats = query(v.string(), async (id) => {
    const event = getRequestEvent()
    const memoriesCount = event.locals.supabase.from("memory").select("*", { count: "exact", head: true }).eq("user_id", id)
    const voiceDiaryCount = event.locals.supabase.from("voiceDiary").select("*", { count: "exact", head: true }).eq("user_id", id)
    const streakData = event.locals.supabase.from("streak").select("*").eq("user_id", id).single()

    const [memoriesResult, voiceResult, streakResult] = await Promise.all([memoriesCount, voiceDiaryCount, streakData])

    if (memoriesResult.error || voiceResult.error || streakResult.error) {
        console.log(memoriesResult.error?.message)
        console.log(voiceResult.error?.message)
        console.log(streakResult.error?.message)
        return { type: "db_error", message: "There was an error fetching your data" }
    }

    return {
        type: "success",
        memoriesCount: memoriesResult.count,
        voiceDiaryCount: voiceResult.count,
        streak: streakResult.data
    }
})



export const updateStreak = command(v.string(), async (userId) => {
    const event = getRequestEvent()
    const db = event.locals.supabase

    const today = new Date()

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const getCurrentStreak = await db.from("streak").select("*").eq("user_id", userId).single()
    if (getCurrentStreak.error) {
        console.log(getCurrentStreak.error.message)
        return { type: "db_error" as const, message: "There was an error fetching streak data" }
    }
    console.log("Got the current streak as: ", getCurrentStreak.data.currentStreak)

    if (getCurrentStreak.data.lastUpdated < today.toISOString()) {
        console.log("Updating streak")
        const updateStreak = await db.from("streak").update({ streak: (getCurrentStreak.data.currentStreak + 1).toString(), lastUpdated: today.toISOString() }).eq("user_id", userId)
        if (updateStreak.error) {
            console.log(updateStreak.error.message)
            return { type: "db_error" as const, message: "There was an error updating streak data" }
        }

        if (getCurrentStreak.data.currentStreak + 1 > getCurrentStreak.data.longestStreak) {
            console.log("Updating longest streak")
            const updateLongestStreak = await db.from("streak").update({ longestStreak: (getCurrentStreak.data.currentStreak + 1).toString() }).eq("user_id", userId)

            if (updateLongestStreak.error) {
                console.log(updateLongestStreak.error.message)
                return { type: "db_error" as const, message: "There was an error updating longest streak data" }
            }
        }

        console.log("All done")
    }

})