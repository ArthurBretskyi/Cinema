<template>
    <div class="header">
        <div class="header__container">
            <div class="header__left">
                <BurgerComponent @toggle-menu='isMenuOpen = !isMenuOpen' />
                <NavigationMenu :isOpen="isMenuOpen" @close="isMenuOpen = false" />
            </div>
            <div class="header__center">
                <nav class="header__menu menu">
                    <ul class="menu__list">
                        <li class="menu__item"><router-link :to="{ name: 'NowInCinemas' }" class="menu__link">{{
                            $t("components.AppHeader.NowInCinemas") }}</router-link></li>
                        <li class="menu__item"><router-link :to="{ name: 'SoonInCinemas' }" class="menu__link">{{
                            $t("components.AppHeader.SoonInCinemas") }}</router-link></li>
                        <li class="menu__item"><router-link :to="{ name: 'Snacks' }" class="menu__link">{{
                            $t("components.AppHeader.Snacks") }}</router-link>
                        </li>
                        <li class="menu__item"><router-link :to="{ name: 'MapView' }" class="menu__link">{{
                            $t("components.AppHeader.Cinemas") }}</router-link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class="header__right">
                <LocationSelectorComponent @update:location="selectedLocation = $event" />
                <UserAuthComponent v-if="!user" />
                <UserDropDownComponent v-else />
            </div>
        </div>
    </div>
</template>

<script setup>
import BurgerComponent from '@/components/Header/BurgerComponent.vue'
import NavigationMenu from '@/components/Header/NavigationMenu.vue';
import LocationSelectorComponent from '@/components/Header/LocationSelectorComponent.vue';
import UserAuthComponent from '@/components/Header/UserAuthComponent.vue';
import UserDropDownComponent from '@/components/Header/UserDropDownComponent.vue'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.getUser())

const isMenuOpen = ref(false)
const selectedLocation = ref(null)
</script>

<style lang="scss" scoped>
.header {
    color: #fff;
    padding: 1.2rem 0;
    background-color: transparent;
    box-shadow: 0 2px 8px rgba(61, 244, 70, 0.5);
    position: relative;
    z-index: 10;
    transition: all 2s ease-in-out;

    &__container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        column-gap: 20px;
    }

    &__left {}

    &__center {}

    &__menu {}

    &__right {
        display: flex;
        align-items: center;
        justify-self: end;
        gap: 1.5rem;
    }
}

.menu {
    overflow: hidden;
    white-space: nowrap;
    position: relative;

    &__list {
        display: flex;
        flex-wrap: wrap;
        column-gap: 40px;
        align-items: center;
        animation: marquee 20s linear infinite;

        &:hover {
            animation-play-state: paused;
        }
    }

    &__item {
        text-transform: uppercase;
        color: $primary-color;
        transition: color 0.5s ease-in-out;

        &:hover {
            color: $decor-color-third;
        }

    }

    &__link {}

    @keyframes marquee {
        0% {
            transform: translateX(-100%);
        }

        100% {
            transform: translateX(100%);
        }
    }
}
</style>