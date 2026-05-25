<template>
    <div class="trailer-modal" @click.self="$emit('close')">
        <div class="trailer-modal__content">
            <button class="trailer-modal__close" @click="$emit('close')">
                ✕
            </button>

            <iframe :src="embedUrl" class="trailer-modal__iframe" frameborder="0" allowfullscreen></iframe>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    url: String
})

const embedUrl = computed(() => {
    if (!props.url) return ''
    const videoId = props.url.split('v=')[1]
    return `https://www.youtube.com/embed/${videoId}`
})
</script>

<style scoped lang="scss">
.trailer-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 200;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;

    &__content {
        position: relative;
        width: 100%;
        max-width: 900px;
        background: #000;
        border-radius: 12px;
        overflow: hidden;
    }

    &__close {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        color: #fff;
        font-size: 26px;
        border: none;
        cursor: pointer;
    }

    &__iframe {
        width: 100%;
        height: 500px;

        // @include breakpoint(md) {
        //     height: 400px;
        // }

        // @include breakpoint(sm) {
        //     height: 250px;
        // }
    }
}
</style>