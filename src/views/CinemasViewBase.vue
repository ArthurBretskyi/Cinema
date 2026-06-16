<template>
    <section class="page__cinemas" :aria-label="ariaLabel">

        <!-- MovieHero отримує активний фільм і слухає події від нього -->
        <MovieHero :movie="activeMovie" :info-open="infoOpen" @prev="prev" @next="next" @toggle-info="infoOpen = !infoOpen"
            @play-trailer="openTrailer" />

        <!-- Трейлер — відкривається поверх всього -->
        <TrailerModal v-if="showTrailer" :url="currentTrailer" @close="closeTrailer" />

    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMoviesStore } from '@/stores/movies'

import MovieHero from '@/components/movies/MovieHero.vue'
import TrailerModal from '@/components/movies/TrailerModal.vue'

// ─── Props ───────────────────────────────────────────────────────────────────
const props = defineProps({
    status: { type: String, required: true },  // 'now_playing' або 'coming_soon'
    ariaLabel: { type: String, default: '' },
})

// ─── Store ───────────────────────────────────────────────────────────────────
const moviesStore = useMoviesStore()

// ─── Стан ────────────────────────────────────────────────────────────────────
const activeIndex = ref(0)   // індекс активного фільму в масиві
const infoOpen = ref(false)  // чи розгорнутий опис фільму
const showTrailer = ref(false)
const currentTrailer = ref(null)

// ─── Список фільмів ──────────────────────────────────────────────────────────
// computed — автоматично оновлюється коли змінюється store
const movies = computed(() =>
    [...moviesStore.getItemsList]
        .filter(m => m.status === props.status)
        .sort((a, b) => (b.releaseDate || '') > (a.releaseDate || '') ? 1 : -1)
)

// ─── Активний фільм ──────────────────────────────────────────────────────────
// береться з масиву movies по індексу
const activeMovie = computed(() => movies.value[activeIndex.value] ?? null)

// ─── Навігація ───────────────────────────────────────────────────────────────
function prev() {
    // % length — якщо на першому, переходить на останній (циклічно)
    activeIndex.value = (activeIndex.value - 1 + movies.value.length) % movies.value.length
    infoOpen.value = false  // скидаємо опис при переключенні
}

function next() {
    activeIndex.value = (activeIndex.value + 1) % movies.value.length
    infoOpen.value = false
}

// ─── Завантаження даних ──────────────────────────────────────────────────────
onMounted(async () => {
    // Якщо дані вже є в store — не робимо зайвий запит до Firebase
    if (moviesStore.getItemsList.length === 0) {
        await moviesStore.loadFilteredData('status', '==', props.status)
    }
})

// ─── Трейлер ─────────────────────────────────────────────────────────────────
function openTrailer(url) {
    if (!url) return
    currentTrailer.value = url
    showTrailer.value = true
}

function closeTrailer() {
    showTrailer.value = false
    currentTrailer.value = null
}
</script>

<style lang="scss" scoped>
.page__cinemas {
    min-height: 100vh;
}
</style>