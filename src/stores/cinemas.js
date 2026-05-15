import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'

export const useCinemasStore = defineStore('cinemas', () => {
  const { generalApiOperation } = useGeneralStore()
  const base = getStoreTemplate('cinemas', generalApiOperation)

  return {
    ...base,
  }
})
