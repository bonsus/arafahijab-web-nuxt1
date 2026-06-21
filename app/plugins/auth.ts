// Restore the logged-in user's profile on app init (e.g. after a page refresh).
// The token persists in a cookie, but the `user` state is in-memory and resets
// on reload — this fetches it again so profile data is available everywhere.
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  if (authStore.token && !authStore.user) {
    await authStore.fetchMe()
  }
})
