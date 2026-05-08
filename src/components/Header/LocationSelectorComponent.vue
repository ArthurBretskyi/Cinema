<template>
    <div class="location-selector" role="navigation">
        <font-awesome-icon class="location-icon" icon="fa-solid fa-location-dot" />
        <!-- <button class="location-link" @click="toggleOverlay" :aria-label="ariaLabel" type="button">
            {{ displayCity }}
        </button> -->
        <button class="location-link" :aria-label="ariaLabel" type="button">{{ $t("components.LocationSelector.ChooseCity")
        }}</button>
        <!-- <CityCinemaOverlay v-if="showOverlay" :is-open="showOverlay" @close="showOverlay = false" /> -->
    </div>
</template>
  
<script setup>
// import { ref, computed, onMounted, watch } from 'vue'
// import { useI18n } from 'vue-i18n'
// // import { useCitiesStore } from '@/stores/cities'
// // import CityCinemaOverlay from '@/components/CityCinemaOverlay.vue'

// const LS_KEY = 'selectedCity'
// const { t } = useI18n()
// // const citiesStore = useCitiesStore()

// const showOverlay = ref(false)
// const displayCity = computed(() => citiesStore.selectedCity || t('components.location.chooseCity'))
// const ariaLabel = computed(() => t('components.location.chooseCity'))

// onMounted(() => {
//     const saved = localStorage.getItem(LS_KEY)
//     if (saved) citiesStore.selectedCity = saved
// })

// watch(
//     () => citiesStore.selectedCity,
//     (val) => {
//         if (val) localStorage.setItem(LS_KEY, val)
//         else localStorage.removeItem(LS_KEY)
//     }
// )

// function toggleOverlay() {
//     showOverlay.value = true
// }
</script>
  
  

<style scoped lang="scss">
.location-selector {
    display: flex;
    align-items: center;
    column-gap: 0.5rem;
    border-right: 1px solid $text-color;
    padding-right: 0.8rem;
    cursor: pointer;
    position: relative;
    transition: all 0.4s ease;

    &:hover {
        border-right: 1px solid $decor-color-third;

        .location-icon {
            color: $decor-color-third;
        }
    }

    .location-icon {
        font-size: 18px;
        transition: all 0.4s ease;
    }

    .location-text {
        font-size: 18px;
    }

    .location-dropdown {
        position: absolute;
        top: 120%;
        left: 0;
        background: #fff;
        color: $text-color;
        border-radius: 6px;
        padding: 0.5rem 0;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
        z-index: 20;
        max-height: 200px;
        overflow-y: auto;

        li {
            padding: 0.4rem 1rem;
            white-space: nowrap;

            &:hover {
                background: $decor-color-third;
                color: #fff;
            }
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
