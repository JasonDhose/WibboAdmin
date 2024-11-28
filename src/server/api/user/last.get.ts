export default defineEventHandler(async (event) => {
    const sessionUser = getSessionUser(event)

    if (sessionUser.rank < 6) {
        throw createError({ statusCode: 400, message: 'Permission requis' })
    }

    const users = await userDao.getAllLast()

    return { users }
})
