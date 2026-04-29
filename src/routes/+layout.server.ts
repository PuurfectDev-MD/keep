export function load({ locals, cookies }) {
    const theme = cookies.get('data-theme') || 'light'
    return {
        user: locals.user,
        theme: theme
    }
}