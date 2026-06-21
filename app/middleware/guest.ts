// Redirect ke home jika sudah login (untuk halaman auth)
export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('arafahijab_token')
  if (token.value) {
    return navigateTo('/')
  }
})
