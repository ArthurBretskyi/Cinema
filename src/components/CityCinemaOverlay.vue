<template>
    <div v-if="isOpen" class="city-cinema-overlay">
        <!-- 🖤 Backdrop -->
        <div class="city-cinema-overlay__backdrop" @click="close" />

        <transition name="panel-slide" appear>
            <div class="city-cinema-overlay__panel" v-if="isOpen" ref="panel">
                <button class="close-btn" @click="close" aria-label="close">✕</button>

                <div class="city-cinema__content">
                    <LoadingComponent v-if="generalStore.isLoading && !citiesLoaded" />
                    <ErrorComponent v-else-if="generalStore.error" :message="generalStore.error" />

                    <div v-else class="city-cinema__container">
                        <!-- Cities -->
                        <div class="city-cinema__cities">
                            <h2 class="city-cinema__title">{{ $t('components.CityCinemaOverlay.Cities') }}</h2>
                            <ul class="city-cinema__list">
                                <li v-for="(cinemas, city) in citiesStore.cities" :key="city" :class="[
                                    'city-cinema__city',
                                    { active: city === citiesStore.selectedCity },
                                ]" @click="selectCity(city)">
                                    {{ city }}
                                </li>
                            </ul>
                        </div>

                        <!-- Cinemas -->
                        <div class="city-cinema__cinemas">
                            <h2 class="city-cinema__title">
                                {{ citiesStore.selectedCity || $t('pages.cityCinema.selectCity') }}
                            </h2>

                            <ul v-if="citiesStore.cinemasList.length" class="city-cinema__cinemas-list">
                                <li v-for="cinema in citiesStore.cinemasList" :key="cinema.name"
                                    class="city-cinema__cinema">
                                    <h3 class="city-cinema__cinema-name">{{ cinema.name }}</h3>
                                    <p class="city-cinema__cinema-address">{{ cinema.address }}</p>
                                </li>
                            </ul>

                            <p v-else class="city-cinema__placeholder">
                                {{ $t('pages.cityCinema.placeholder') }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useCitiesStore } from '@/stores/cities'
import { useGeneralStore } from '@/stores/general'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'

const props = defineProps({ isOpen: Boolean })
const emit = defineEmits(['close'])

const citiesStore = useCitiesStore()
const generalStore = useGeneralStore()

const citiesLoaded = ref(false)
const panel = ref(null)

onMounted(async () => {
    if (!Object.keys(citiesStore.cities).length) {
        await citiesStore.loadCitiesCinemas()
        citiesLoaded.value = true
    } else {
        citiesLoaded.value = true
    }

    document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside)
})

// ✅ закриття при кліку поза панеллю
function handleClickOutside(event) {
    if (panel.value && !panel.value.contains(event.target)) {
        close()
    }
}

function selectCity(city) {
    citiesStore.selectCity(city)
}

function close() {
    emit('close')
}
</script>

<style lang="scss" scoped>
.city-cinema-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    justify-content: flex-end;
}

.city-cinema-overlay__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(3px);
    opacity: 1;
    transition: opacity 0.45s ease;
    z-index: 200;
}

.city-cinema-overlay__panel {
    position: relative;
    z-index: 2010;
    width: 40%;
    height: 100vh;
    background: $background-color;
    box-shadow: -2px 0 10px rgba(61, 244, 70, 0.25);
    padding: 2rem;
    overflow-y: auto;
}

.close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: $text-color;
    transition: color 0.3s ease;

    &:hover {
        color: $decor-color-first;
    }
}

.panel-slide-enter-from {
    transform: translateY(-24px);
    opacity: 0;
}

.panel-slide-enter-active {
    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease;
}

.panel-slide-enter-to {
    transform: translateY(0);
    opacity: 1;
}

.panel-slide-leave-from {
    transform: translateY(0);
    opacity: 1;
}

.panel-slide-leave-active {
    transition: transform 0.6s ease, opacity 0.6s ease;
}

.panel-slide-leave-to {
    transform: translateY(-16px);
    opacity: 0;
}

.city-cinema__container {
    display: flex;
    margin-top: 2rem;
    gap: 2rem;
}

.city-cinema__cities {
    border-right: 1px solid rgba($primary-color, 0.2);
    padding-right: 1rem;
}

.city-cinema__city {
    cursor: pointer;
    padding: 0.6rem 1rem;
    border-radius: 6px;
    transition: background 0.3s ease;

    &:hover {
        background-color: rgba($decor-color-first, 0.15);
    }

    &.active {
        background-color: $decor-color-first;
        color: $primary-color;
    }
}
</style>