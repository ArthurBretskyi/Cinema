// src/stores/cities.js
import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'
import { ref, computed } from 'vue'

export const useCitiesStore = defineStore('cities', () => {
  const { generalApiOperation } = useGeneralStore()
  const base = getStoreTemplate('meta', generalApiOperation)

  const cities = ref({})

  const LS_KEY = 'selectedCity'

  const selectedCity = ref(localStorage.getItem(LS_KEY) || null)

  const cinemasList = computed(() => {
    return selectedCity.value && cities.value[selectedCity.value]
      ? cities.value[selectedCity.value]
      : []
  })

  async function loadCitiesCinemas() {
    return await generalApiOperation({
      operation: async () => {
        const doc = await base.loadItemById('cities_cinemas')

        cities.value = doc

        return doc
      },
    })
  }

  function selectCity(city) {
    selectedCity.value = city
    if (city) localStorage.setItem(LS_KEY, city)
    else localStorage.removeItem(LS_KEY)
  }

  return {
    cities,
    selectedCity,
    cinemasList,
    loadCitiesCinemas,
    selectCity,
  }
})
