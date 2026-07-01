import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface FavItem {
  type: 'trade' | 'lostfound' | 'groupbuy' | 'errand'
  id: number
  title: string
}

export const useFavoriteStore = defineStore('favorite', () => {
  const items = ref<FavItem[]>([])

  const count = computed(() => items.value.length)

  function isFav(type: string, id: number): boolean {
    return items.value.some((i) => i.type === type && i.id === id)
  }

  function toggle(type: FavItem['type'], id: number, title: string) {
    const idx = items.value.findIndex((i) => i.type === type && i.id === id)
    if (idx >= 0) {
      items.value.splice(idx, 1)
    } else {
      items.value.push({ type, id, title })
    }
  }

  function removeByType(type: FavItem['type']) {
    items.value = items.value.filter((i) => i.type !== type)
  }

  function clear() {
    items.value = []
  }

  return { items, count, isFav, toggle, removeByType, clear }
})
