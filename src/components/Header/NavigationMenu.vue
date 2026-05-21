<template>
    <div v-if="isOpen" class="nav-menu">
        <div class="nav-menu__backdrop" @click="close">

            <transition name="panel-slide" appear>
                <div class="nav-menu__panel" v-if="isOpen" ref="panel">
                    <button class="close-btn" @click="close">✕</button>

                    <ul class="nav-menu__list">
                        <li><router-link @click="close" :to="{ name: 'NowInCinemas' }">{{
                            $t('components.AppHeader.NowInCinemas')
                        }}</router-link></li>
                        <li><router-link @click="close" :to="{ name: 'SoonInCinemas' }">{{
                            $t('components.AppHeader.SoonInCinemas')
                        }}</router-link></li>
                        <li><router-link @click="close" :to="{ name: 'Snacks' }">{{
                            $t('components.AppHeader.Snacks')
                        }}</router-link></li>
                        <li><router-link @click="close" :to="{ name: 'MapView' }">{{ $t('components.AppHeader.Cinemas')
                        }}</router-link></li>
                    </ul>
                    <div v-if="!user" class="nav-menu__auth">
                        <UserAuthComponent @close-menu="close" />
                    </div>
                    <div v-else class="nav-menu__user user">
                        <img v-if="user?.photoURL" :src="user?.photoURL" alt="User avatar" class="user__avatar" />
                        <div v-else class="user__initials">
                            {{ getInitials(user?.displayName || user?.email) }}
                        </div>
                        <div class="user__info">
                            <p class="user__email">{{ user?.email }}</p>

                            <router-link class="user__link" :to="{ name: authStore.isAdmin ? 'Admin' : 'Profile' }">
                                {{ authStore.isAdmin
                                    ? $t('components.UserDropDown.AdminPanel')
                                    : $t('components.UserDropDown.Profile') }}
                            </router-link>

                            <button @click.stop="handleLogout" class="user__logout-btn">
                                {{ $t('components.UserDropDown.LogOut') }}
                            </button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import UserAuthComponent from '@/components/Header/UserAuthComponent.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'


const authStore = useAuthStore()
const { user, isAdmin } = storeToRefs(authStore)


const props = defineProps({ isOpen: Boolean })
const emit = defineEmits(['close'])

const panel = ref(null)

function close() {
    emit('close')
}

function handleClickOutside(e) {
    if (panel.value && !panel.value.contains(e.target)) close()
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside))

function getInitials(value) {
    if (!value) return ''
    if (value.includes('@')) {
        const namePart = value.split('@')[0]
        const nameWords = namePart.split(/[\s._-]+/)
        return ((nameWords[0]?.[0] || '') + (nameWords[1]?.[0] || '')).toUpperCase()
    }
    const parts = value.trim().split(' ')
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase()
}

function handleLogout() {
    authStore.logout()
}
</script>

<style lang="scss" scoped>
.nav-menu {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    justify-content: flex-start;

    &__list {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1.3rem;

        a {
            font-size: 1.2rem;
            color: $primary-color;
            text-decoration: none;
        }
    }

    &__auth {
        margin-block-start: 1.25rem;

    }

    &__user {
        margin-block-start: 1.25rem;
    }
}

.user {

    &__avatar {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 5px rgba(61, 244, 70, 0.7);
        transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
    }

    &__initials {
        background-color: #555;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: #fff;
        font-size: 0.85rem;
    }

    &__info {
        display: flex;
        flex-direction: column;
        gap: .9375rem;
        margin-block-start: 1.25rem;
    }

    &__email {}

    &__link {
        font-size: 1.125rem;
        color: $decor-color-third;
    }

    &__logout-btn {
        color: $text-color;
        align-self: start;
        margin-block-start: 1.25rem;
    }
}

.nav-menu__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(3px);
    opacity: 1;
    transition: opacity 0.5s ease;
    z-index: 200;
}

.nav-menu__panel {
    position: relative;
    z-index: 2010;
    width: 30%;
    height: 100vh;
    background: $background-color;
    box-shadow: 2px 0 10px rgba(61, 244, 70, 0.25);
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
}

.panel-slide-enter-from {
    transform: translateX(-24px);
    opacity: 0;
}

.panel-slide-enter-active {
    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease;
}

.panel-slide-enter-to {
    transform: translateX(0);
    opacity: 1;
}

.panel-slide-leave-from {
    transform: translateX(0);
    opacity: 1;
}

.panel-slide-leave-active {
    transition: transform 0.6s ease, opacity 0.6s ease;
}

.panel-slide-leave-to {
    transform: translateX(-16px);
    opacity: 0;
}
</style>