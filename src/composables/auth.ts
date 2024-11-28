import type { UserData } from '~/types'

export const useAuthUser = () => useState<UserData | null>('user', () => null)

export const useAuth = () => {
    const authUser = useAuthUser()
    const authToken = useCookie('auth-token')
    const { showMessage } = useNotification()

    const setUser = (user: UserData | null) => {
        authUser.value = user
    }

    const setCookieToken = (token: string) => {
        authToken.value = token
    }

    const login = async (username: string, password: string) => {
        const data = await useApiFetch<{ Authorization: string }>('/api/v1/login', { body: { username, password }, method: 'POST' })

        const token = data.Authorization?.split('Bearer ')[1]

        setCookieToken(token)

        await nextTick()

        await me()
    }

    const logout = async () => {
        setCookieToken('')
        setUser(null)
        navigateTo('/')
        showMessage({ message: 'Vous avez été déconnecté' })
    }

    const me = async () => {
        try {
            if (!authUser.value && authToken.value) {
                const { user } = await useApiFetch<{ user: UserData }>('/api/v1/userdata')

                if (user.rank >= 6) setUser(user)
                else logout()
            }
        } catch (e: unknown) {
            console.error(e)
        }
    }

    return {
        login,
        logout,
        me,
        authUser,
    }
}
