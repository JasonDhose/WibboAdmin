export default defineNuxtRouteMiddleware((to) => {
    const { authUser } = useAuth()

    if (to.path !== '/' && !authUser.value) return '/'
    if (to.path === '/' && authUser.value) return '/home'
})
