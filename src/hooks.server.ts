import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import type { Handle } from '@sveltejs/kit'
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private'


export const handle: Handle = async ({ event, resolve }) => {
    event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            getAll: () => event.cookies.getAll(),
            setAll: (cookies) => cookies.forEach(({ name, value, options }) =>
                event.cookies.set(name, value, { ...options, path: '/' })
            )
        }
    })

    event.locals.supabaseAdmin = createClient(
        PUBLIC_SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: { session } } = await event.locals.supabase.auth.getSession()

    event.locals.session = session
    event.locals.user = session?.user ?? null


    const theme = event.cookies.get('data-theme') || 'light';

    return resolve(event, {
        transformPageChunk: ({ html }) =>
            html.replace('data-theme=""', `data-theme="${theme}"`)
    })
}



