import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'

export const useMoviesStore = defineStore('movies', () => {
  const { generalApiOperation } = useGeneralStore()
  const base = getStoreTemplate('movies', generalApiOperation)

  return {
    ...base,
  }
})
