export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('arafahijab_token')
  if (!token.value) {
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
