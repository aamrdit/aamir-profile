/**
 * Reads the motion preference the pre-paint script already resolved onto
 * <html data-motion>, so the answer here always matches what CSS is doing.
 */
export function useReducedMotion() {
  const prefersReduced = ref(false)

  onMounted(() => {
    prefersReduced.value = document.documentElement.dataset.motion !== 'on'
  })

  return { prefersReduced }
}
