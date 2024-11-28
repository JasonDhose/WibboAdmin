import { H3Event, getHeader } from 'h3'
import jwt from "jsonwebtoken"

export const createToken = async (session: object, tokenSecret: string, tokenExpiration: number) => {
    return jwt.sign(session, tokenSecret, { expiresIn: tokenExpiration })
}

export const verifyToken = <T>(token: string, tokenSecret: string) => {
    try {
        return jwt.verify(token, tokenSecret) as T
    } catch {
      return null
    }
}

export const checkBanExpiration = async (userId: number, ip: string) => {
    return false
}

export const getUserFromSession = async (event: H3Event) => {
    const { tokenSecret } = useRuntimeConfig()

    const ip = getRequestIP(event, { xForwardedFor: true })
    const tokenJwt = getHeader(event, 'Authorization')

    if (!tokenJwt) return null

    const session = verifyToken<{ userId: number }>(tokenJwt, tokenSecret)

    if (!session) return null

    const user = await userDao.getOne(session.userId)

    if (!user) return null

    const isBanned = user.isBanned && await checkBanExpiration(user.id, ip!)

    if (isBanned) return null

    return user
}

export const getSessionUser = (event: H3Event) => {
    const sessionUser = event.context.user

    if (!sessionUser) {
        throw createError({ statusCode: 401, message: 'Accès refuser' })
    }

    return sessionUser
}
