import { logStaffDao } from "~/server/utils/daos/log-staff.dao"

export default defineEventHandler(async (event) => {
    const sessionUser = getSessionUser(event)

    if (sessionUser.rank < 6) {
        throw createError({ statusCode: 400, message: 'Permission requis' })
    }

    const body = await readBody<{ search: string }>(event)

    if (!body.search) {
        throw createError({ statusCode: 400, message: 'Un champ est manquant' })
    }

    const search = body.search
    let username = ''
    let ip = ''

    if (isValidIP(search)) {
        ip = search
    } else {
        username = search
    }

    if (!ip && !username) {
        throw createError({ statusCode: 400, message: 'Champ de recherche incorrect' })
    }

    if (username) {
        const userTarget = await userDao.getIpLastAndRankByName(username)

        if (!userTarget) {
            throw createError({ statusCode: 400, message: 'Utilisateur introuvable' })
        }

        ip = userTarget.ipLast!
    }

    if (!ip) {
        throw createError({ statusCode: 400, message: 'Utilisateur introuvable' })
    }

    const users = await userDao.getAllByIp(ip)

    if (sessionUser.rank < 11) {
        const hasHighRank = users.some((user) => user.rank >= 11)
        if (hasHighRank) {
            throw createError({ statusCode: 400, message: 'Permission requise' })
        }
    }

    await logStaffDao.create({
        pseudo: sessionUser.username,
        action: `Recherche les doubles comptes de : ${username || ip}`,
        date: Math.floor(Date.now() / 1000)
    })

    return { users }
})

// Helper pour la validation IP
function isValidIP(ip: string): boolean {
  const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(\d{1,3}\.){2}\d{1,3}$/
  const ipv6Pattern = /([a-fA-F0-9:]+:+)+[a-fA-F0-9]+/
  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip)
}
