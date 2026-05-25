
<template>
    <div v-if="movie" class="info-content">
        <img v-if="movie.titleImageUrl" :src="movie.titleImageUrl" alt="title" class="info-content__title" />

        <h4 class="info-content__labels">
            <span>{{ movie.releaseDate?.split('-')?.[0] || '' }}</span>
            <span><i>{{ movie.age || '12+' }}</i></span>
            <span>{{ (movie.genre || []).join(', ') }}</span>
            <span>{{ movie.duration ? `${movie.duration} min` : '' }}</span>
        </h4>

        <div class="info-content__text">
            <p>{{ movie.description }}</p>
        </div>

        <div @click="$emit('play-trailer', movie.trailerUrl)" class="info-content__actions">
            <button class="button-youtube">
                <font-awesome-icon icon="fa-brands fa-youtube" class="button--youtube" />

            </button>
            <span>Watch the trailer</span>
            <!-- <button class="button button--alt"> <i class="fa-solid fa-plus"></i> My List</button> -->
        </div>
    </div>
</template>

<script setup>
const props = defineProps({ movie: { type: Object, default: null } })
</script>

<style scoped lang="scss">
.info-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.info-content__title {
    max-width: 320px;
}

.info-content__labels {
    display: flex;
    gap: 15px;
    color: #b4b3b3;
}

.info-content__text p {
    line-height: 1.3;
    max-width: 600px;
}

.info-content__actions {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
}

.button--youtube {
    background: transparent;
    color: #ff1919;
    font-size: 34px;
}

.button--alt {
    background: #ff1919;
    color: #fff;
}
</style>
