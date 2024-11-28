export default defineEventHandler(async (event) => {
    const url = getRequestURL(event)

    if (!url || (!url.pathname.startsWith('/api') && !url.pathname.startsWith('/auth/me'))) return

    const user = await getUserFromSession(event)

    if (user) event.context.user = user
})
