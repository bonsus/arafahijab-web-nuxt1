/**
 * Observes a sentinel element and invokes `onLoadMore` when it scrolls into view.
 * Returns a `sentinel` template ref to attach to the bottom-of-list element.
 */
export function useInfiniteScroll(
  onLoadMore: () => void,
  canLoadMore?: () => boolean,
) {
  const sentinel = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (typeof IntersectionObserver === 'undefined') return
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && (canLoadMore?.() ?? true)) {
          onLoadMore()
        }
      },
      { rootMargin: '400px 0px' },
    )
    if (sentinel.value) observer.observe(sentinel.value)
  })

  watch(sentinel, (el) => {
    if (!observer) return
    observer.disconnect()
    if (el) observer.observe(el)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { sentinel }
}
