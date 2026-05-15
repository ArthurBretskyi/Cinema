// src/stores/cities.js
import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'
import { ref, computed } from 'vue'

export const useCitiesStore = defineStore('cities', () => {
  const { generalApiOperation } = useGeneralStore()
  const base = getStoreTemplate('meta', generalApiOperation)

  const cities = ref({})
  const selectedCity = ref(null)

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
  }

  return {
    cities,
    selectedCity,
    cinemasList,
    loadCitiesCinemas,
    selectCity,
  }
})
