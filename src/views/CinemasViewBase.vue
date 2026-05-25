<template>
    <section class="page__cinemas" :style="heroBackgroundStyle" :aria-label="ariaLabel">
        <div class="cinemas__container">
            <div class="cinemas__content content">
                <div class="content__body">
                    <MovieInfo :movie="activeMovie" @play-trailer="openTrailer" />
                </div>
                <div class="content__slider">
                    <MovieSlider :movies="movies" :active-id="activeMovie?.movieId" @select="m => activeMovie = m" />
                </div>
            </div>
        </div>

        <TrailerModal v-if="showTrailer" :url="currentTrailer" @close="closeTrailer" />
    </section>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import getStoreTemplate from '@/stores/helpers/storeTemplate'
import { useGeneralStore } from '@/stores/general'

import MovieInfo from '@/components/movies/MovieInfo.vue'
import MovieSlider from '@/components/movies/MovieSlider.vue'
import TrailerModal from '@/components/movies/TrailerModal.vue'

const props = defineProps({
    status: { type: String, required: true },
    ariaLabel: { type: String, default: '' }
})

const generalStore = useGeneralStore()
const moviesStore = getStoreTemplate('movies', generalStore.generalApiOperation)

const movies = ref([])
const activeMovie = ref(null)

const showTrailer = ref(false)
const currentTrailer = ref(null)

const fetchMovies = async () => {
    const result = await moviesStore.loadFilteredData(
        'status',
        '==',
        props.status
    )

    movies.value = (result || []).sort(
        (a, b) => (b.releaseDate || '') > (a.releaseDate || '') ? 1 : -1
    )

    if (movies.value.length) {
        activeMovie.value = movies.value[0]
    }
}

onMounted(fetchMovies)

const heroBackgroundStyle = computed(() => {
    const img =
        activeMovie.value?.backdropUrl ||
        activeMovie.value?.posterUrl ||
        ''

    return img
        ? {
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }
        : {}
})

const openTrailer = (url) => {
    if (!url) return
    currentTrailer.value = url
    showTrailer.value = true
}

const closeTrailer = () => {
    showTrailer.value = false
    currentTrailer.value = null
}
</script>
<style scoped lang="scss">
.page__cinemas {
    // min-height: 100vh;

    position: relative;
    // overflow: hidden;
    transition: background 0.6s ease-in-out;
    padding: 20px 0;


    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 1;
    }

    .cinemas__container {
        position: relative;
        z-index: 2;
    }
}

.content {
    display: flex;
    gap: 15px;
    align-items: flex-start;
}

.content__body {
    flex: 0 1 40%;
}

.content__slider {
    flex: 0 1 60%;
    align-items: center;
    justify-content: center;
}


/* small screens */
@media (max-width: 820px) {
    .content {
        flex-direction: column;
    }

    .content__slider {
        order: -1;
    }
}
</style>