import { form, getRequestEvent } from "$app/server";
import * as v from "valibot"

export const signInForm = form(v.object({
    username: v.pipe(v.string(), v.nonEmpty()),
    email: v.pipe(v.string(), v.nonEmpty()),
    password: v.pipe(v.string(), v.nonEmpty()),

}

), async ({ username, password, email }) => {
    let event = getRequestEvent()

    const { error } = await event.locals.supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                username: username, // for user.meta_data.username
            }
        }
    })


    if (!error) {
        return { type: "success", message: "The signup was succesful. Go check your email" }
    }

    return { type: "db-error", message: "There was an error when signing up." }
})