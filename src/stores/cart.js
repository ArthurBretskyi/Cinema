import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'vuecine_cart'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.warn('Cart: failed to load from localStorage', e)
    return []
  }
}

function saveToStorage(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const useCartStore = defineStore('cart', () => {
  // state
  const items = ref(loadFromStorage())
  const isOpen = ref(false)

  // getters
  const totalQty = computed(() => items.value.reduce((sum, item) => sum + item.qty, 0))

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.qty, 0),
  )

  // actions
  function addItem(payload) {
    const existing = items.value.find(
      (item) => item.id === payload.id && item.type === payload.type,
    )

    if (existing) {
      existing.qty++
    } else {
      items.value.push({ ...payload, qty: 1 })
    }

    saveToStorage(items.value)
  }

  function removeItem(id) {
    items.value = items.value.filter((item) => item.id !== id)
    saveToStorage(items.value)
  }

  function increaseQty(id) {
    const item = items.value.find((i) => i.id === id)
    if (!item) return

    item.qty++
    saveToStorage(items.value)
  }

  function decreaseQty(id) {
    const item = items.value.find((i) => i.id === id)
    if (!item) return

    if (item.qty > 1) {
      item.qty--
    } else {
      items.value = items.value.filter((i) => i.id !== id)
    }

    saveToStorage(items.value)
  }

  function clearCart() {
    items.value = []
    saveToStorage(items.value)
  }

  // UI
  function openCart() {
    isOpen.value = true
  }

  function closeCart() {
    isOpen.value = false
  }

  function toggleCart() {
    isOpen.value = !isOpen.value
  }

  return {
    items,
    isOpen,
    totalQty,
    totalPrice,
    addItem,
    removeItem,
    increaseQty,
    decreaseQty,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
  }
})
