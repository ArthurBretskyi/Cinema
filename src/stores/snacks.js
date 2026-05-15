import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'

export const useSnacksStore = defineStore('snacks', () => {
  const { generalApiOperation } = useGeneralStore()
  const base = getStoreTemplate('snacks', generalApiOperation)

  return {
    ...base,
  }
})
