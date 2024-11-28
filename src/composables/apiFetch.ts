const langs: Record<string, string> = {
    'alert-server-error': 'Une erreur serveur est apparu, réessayer plus tard',
    'error': "Une erreur s'est produite. Merci d'essayer plus tard",
    'permission': 'Permissions insuffisantes',
    'login.fail': 'Vos identifiants sont incorrects',
    'login.ban': 'Tu as été exclu. La raison de cette exclusion est la suivante " {0} " Merci de relire la nos conditions d\'utilisation. La sanction prendra fin le {1} à {2}',
    'login.staff': 'Votre IP ne correspond pas avec les données de notre database, merci de procéder à un changement de cette sécurité : {0}',
    'admin.user-notfound': "L'utilisateur n'existe pas",
}

const FormatString = (str: string, ...val: string[]) => {
    for (let index = 0; index < val.length; index++) {
        str = str.replace(`{${index}}`, val[index])
    }
    return str
}

export const useApiFetch = <T>(path: string, opts = {}) => {
    const { logout } = useAuth()
    const { showMessage } = useNotification()
    const runtimeConfig = useRuntimeConfig()
    const authToken = useCookie('auth-token')

    if (authToken.value) opts = { ...opts, ...{ headers: { Authorization: `Bearer ${authToken.value}` } } }

    return $fetch<T>(path, {
        baseURL: runtimeConfig.public.apiBase,
        onResponseError({ response }) {
            const status = response.status
            const message = response._data.message ?? ''

            if (status === 404 || status === 403) {
                throw createError({ statusCode: status, message: message })
            } else if (status === 401) {
                logout()
            } else if (status >= 500) {
                if (process.server) {
                    throw createError({ statusCode: status, message: message })
                } else {
                    showMessage({
                        message: langs['alert-server-error'],
                    })
                }
            } else if (status === 400 && message) {
                let key = message
                let params: string[] = []

                if (message.includes('|')) {
                    key = message.split('|')[0]
                    params = message.split('|').slice(1)
                }

                showMessage({
                    message: FormatString(langs[key], ...params),
                    copy: key === 'login.staff' ? params[0] : undefined
                })
            }
        },
        ...(opts && { ...opts }),
    })
}
