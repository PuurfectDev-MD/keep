import { getRequestEvent, query } from "$app/server";
import * as v from "valibot"

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


type DayEntry = {
    date: string
    memories: MemoryEntry[]
    voiceDiaries: voiceDiaryEntry[]
}


type JournaLTimeline = {
    type: "success"
    days: DayEntry[]
}



export const getJournalTimelineData = query(v.object({
    time: v.string(),
    id: v.string()
}), async ({ time, id }) => {
    const event = getRequestEvent()
    if (id !== event.locals.user.id) return { type: "unauthorized", message: "You cant acces this data" }

    const timeframeMap: Record<string, number> = {
        week: 7,
        month: 30,
        quarter: 120,
        year: 365,
    }

    const timeframe = timeframeMap[time] ?? 7

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - timeframe)
    const cutoffString = cutoff.toISOString()

    console.log("About to send it to seprate fucntions to get data for memories and audio")
    const [memoriesResult, voiceResult] = await Promise.all([getMemoriesDataForTime(event.locals.supabase, event.locals.user.id, cutoffString),
    getVoiceDiaryDataForTime(event.locals.supabase, event.locals.user.id, cutoffString)
    ])

    if (memoriesResult.type === "db_error") return memoriesResult
    if (voiceResult.type === "db_error") return voiceResult


    console.log("recieved all data")
    const dayMap: Record<string, DayEntry> = {}

    for (const memory of memoriesResult.memories) {
        if (memory.type == "db_error") continue

        const date = memory.date.split("T")[0]
        if (!dayMap[date]) dayMap[date] = { date, memories: [], voiceDiaries: [] }
        dayMap[date].memories.push(memory)
    }

    for (const voice of voiceResult.voiceDiaries) {
        if (voice.type == "db_error") continue

        const date = voice.date.split("T")[0]
        if (!dayMap[date]) dayMap[date] = { date, memories: [], voiceDiaries: [] }
        dayMap[date].voiceDiaries.push(voice)
    }

    const days = Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date))

    return { type: "success" as const, days }
})



async function getMemoriesDataForTime(supabase: any, userId: string, cutOff: string) {
    const { data, error } = await supabase.from('memory').select("*").eq("user_id", userId).gte("created_at", cutOff) // the table(memory)

    if (error) {
        console.log(error.message)
        return { type: "db_error" as const, message: error.message }

    }

    const memories: MemoryEntry[] = await Promise.all(data.map(async (memory: any) => {  //putting each moery in a struture
        const urlResult = await fetchMemoryUrls(supabase, userId, memory.id)

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

    return { type: "success" as const, memories }

}

async function getVoiceDiaryDataForTime(supabase: any, userId: string, cutOff: string) {

    const { data: voiceData, error: voiceDataErr } = await supabase.from('voiceDiary').select("*").eq("user_id", userId).gte("created_at", cutOff)
    if (voiceDataErr) {
        console.log(voiceDataErr.message)
        return { type: "db_error" as const, message: "There was an error fetching voicediary data" }
    }


    const voiceDiaries: voiceDiaryEntry[] = await Promise.all(voiceData.map(async (entry: any) => {
        const urlResult = await fetchAudioUrls(supabase, userId, entry.id)
        if (urlResult.type == "db_error") return { type: "db_error" as const, message: "There was an error fetching your url" }

        return {
            type: "success" as const,
            audioUrl: urlResult.urls[0] ?? null,
            date: entry.created_at
        }
    }))


    return { type: "success" as const, voiceDiaries }
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

