import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import db from '@/firebase/firebase-config'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'

export const useCollectionsStore = defineStore('collections', () => {
  const { generalApiOperation } = useGeneralStore()

  // 🧱 базові CRUD можливості (на випадок, якщо ми колись зробимо /collections колекцією)
  const base = getStoreTemplate('collections', generalApiOperation)

  // 🧩 теперішній спосіб — документ meta/collections
  const collections = ref({})
  const isLoaded = ref(false)

  async function loadCollections() {
    await generalApiOperation(async () => {
      const refDoc = doc(db, 'meta', 'collections')
      const snap = await getDoc(refDoc)

      if (snap.exists()) {
        collections.value = snap.data()
      } else {
        collections.value = {}
      }

      isLoaded.value = true
    })
  }

  async function saveCollections(newData) {
    await generalApiOperation(async () => {
      const refDoc = doc(db, 'meta', 'collections')
      await setDoc(refDoc, newData, { merge: true })
      collections.value = { ...collections.value, ...newData }
    })
  }

  // 🧩 утиліта для отримання масиву (зручно для селектів)
  const getCollectionsArray = computed(() => {
    return Object.entries(collections.value).map(([value, item]) => ({
      value,
      label: item.label || value,
      icon: item.icon || '📦',
      description: item.description || '',
    }))
  })

  return {
    ...base,
    collections,
    isLoaded,
    loadCollections,
    saveCollections,
    getCollectionsArray,
  }
})
