import { redirect } from "@sveltejs/kit";

export function load({ locals }) {
    if (locals.user) {
        return redirect(303, `/${locals.user.id}`)
    }


}