<script setup lang="ts">
import { NAV } from '~/content/site'

/**
 * FR-100 series. The primary CTA was removed from the nav entirely
 * (DECISIONS.md D5), so this is wordmark + anchors only.
 *
 * FR-102's background change uses an IntersectionObserver sentinel rather than
 * a scroll listener: Section 3 bans scroll listeners and M3's acceptance
 * asserts zero of them in the built output. The sentinel is an 80px-tall
 * element pinned to the document origin -- once it leaves the viewport the
 * page has scrolled past 80px. See DECISIONS.md C2.
 */
/** Distinguishes the landmark when the overlay adds a second nav context. */
const navLabel = 'Primary'

const isSolid = ref(false)
const isMenuOpen = ref(false)

const sentinel = ref<HTMLElement | null>(null)
const overlay = ref<HTMLElement | null>(null)
const menuTrigger = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!sentinel.value) return
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry) isSolid.value = !entry.isIntersecting
    },
    { threshold: 0 },
  )
  observer.observe(sentinel.value)
})

onBeforeUnmount(() => observer?.disconnect())

function openMenu() {
  isMenuOpen.value = true
  nextTick(() => {
    const first = overlay.value?.querySelector<HTMLElement>('a, button')
    first?.focus()
  })
}

/** FR-107: returns focus to the Menu trigger on close. */
function closeMenu() {
  if (!isMenuOpen.value) return
  isMenuOpen.value = false
  nextTick(() => menuTrigger.value?.focus())
}

/** FR-107: traps focus while open, closes on Escape. */
function onOverlayKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu()
    return
  }

  if (event.key !== 'Tab' || !overlay.value) return

  const focusable = [...overlay.value.querySelectorAll<HTMLElement>('a[href], button')]
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
</script>

<template>
  <!-- Pinned to the document origin, not the fixed header, so it scrolls away. -->
  <div ref="sentinel" aria-hidden="true" class="nav-sentinel" />

  <header
    id="nav"
    data-testid="nav"
    class="fixed inset-x-0 top-0 z-50 transition-colors duration-150"
    :class="isSolid ? 'bg-paper border-rule border-b' : 'border-b border-transparent'"
  >
    <nav :aria-label="navLabel" class="shell nav-height flex items-center justify-between">
      <a
        href="#hero"
        data-testid="nav-wordmark"
        class="text-ink font-mono text-mono-label flex min-h-48 items-center uppercase no-underline"
      >
        {{ NAV.wordmark }}
      </a>

      <!-- FR-105: text links at lg and above. FR-104: centre stays empty. -->
      <ul class="hidden items-center gap-36 lg:flex">
        <li v-for="link in NAV.links" :key="link.testid">
          <a
            :href="link.href"
            :data-testid="link.testid"
            class="text-ink font-mono text-mono-label flex min-h-48 items-center uppercase no-underline transition-opacity duration-150 hover:opacity-70"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>

      <!-- FR-106: the word Menu, not a hamburger icon. -->
      <button
        ref="menuTrigger"
        type="button"
        data-testid="nav-menu-trigger"
        class="text-ink font-mono text-mono-label flex min-h-48 min-w-48 items-center justify-end uppercase lg:hidden"
        :aria-expanded="isMenuOpen"
        aria-controls="nav-menu-overlay"
        @click="openMenu"
      >
        {{ NAV.menuLabel }}
      </button>
    </nav>

    <div
      v-if="isMenuOpen"
      id="nav-menu-overlay"
      ref="overlay"
      data-testid="nav-menu-overlay"
      class="bg-paper fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      :aria-label="NAV.menuLabel"
      @keydown="onOverlayKeydown"
    >
      <div class="shell nav-height flex items-center justify-end">
        <button
          type="button"
          class="text-ink font-mono text-mono-label flex min-h-48 min-w-48 items-center justify-end uppercase"
          @click="closeMenu"
        >
          {{ NAV.closeLabel }}
        </button>
      </div>

      <ul class="shell flex flex-col gap-24 pt-48">
        <li v-for="link in NAV.links" :key="`overlay-${link.testid}`">
          <a
            :href="link.href"
            class="text-ink font-primary text-h3 flex min-h-48 items-center no-underline"
            @click="closeMenu"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>
    </div>
  </header>
</template>

