<template>
    <div ref="userDropdownRef" class="user-dropdown" @click.stop="toggleDropdown">
        <div class="user-main">
            <img v-if="user.photoURL" :src="user.photoURL" alt="User avatar" class="avatar" />
            <div v-else class="initials">
                {{ getInitials(user.displayName || user.email) }}
            </div>
        </div>

        <transition name="dropdown-fade">
            <div v-if="showDropdown" class="dropdown">
                <p class="dropdown-email">{{ user.email }}</p>

                <router-link class="dropdown-link">
                    {{ $t('components.UserDropDown.Profile') }}
                </router-link>

                <button @click.stop="handleLogout" class="logout-btn">
                    {{ $t('components.UserDropDown.LogOut') }}
                </button>
            </div>
        </transition>
    </div>
</template>
  
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.getUser())

const showDropdown = ref(false)
const userDropdownRef = ref(null)

function toggleDropdown(e) {
    e.stopPropagation()
    showDropdown.value = !showDropdown.value
}

function handleClickOutside(e) {
    if (userDropdownRef.value && !userDropdownRef.value.contains(e.target)) {
        showDropdown.value = false
    }
}

onMounted(() => {
    window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    window.removeEventListener('click', handleClickOutside)
})

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
  
<style scoped lang="scss">
.user-dropdown {
    position: relative;

    .user-main {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .avatar,
    .initials {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 5px rgba(61, 244, 70, 0.7);
        transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;

        &:hover {
            transform: scale(1.05);
        }
    }

    .initials {
        background-color: #555;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: #fff;
        font-size: 0.85rem;
    }


    .dropdown {
        position: absolute;
        top: 64px;
        right: 0;
        background-color: rgba(0, 0, 0, 0.8);
        color: $primary-color;
        backdrop-filter: blur(4px);
        border-radius: 8px;
        padding: 1rem;
        z-index: 10;
        box-shadow: 0 4px 12px rgba(61, 244, 70, 0.8);

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
        justify-content: center;

        .dropdown-email {
            font-size: 1rem;
        }

        .dropdown-link {
            text-align: center;
            color: $decor-color-third;
            text-decoration: none;

            padding: 0.5rem 0.5rem;
            border-radius: 30px;
            transition: all 0.5s ease-in-out;

            &:hover {
                color: $creamy-color;
            }
        }

        .logout-btn {
            color: $text-color;
            background: transparent;
            border: none;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;

            &:hover {
                transform: scale(1.05);
            }
        }
    }

    /* --- transition styles --- */
    .dropdown-fade-enter-active,
    .dropdown-fade-leave-active {
        transition: all 0.25s ease-out;
    }

    .dropdown-fade-enter-from,
    .dropdown-fade-leave-to {
        opacity: 0;
        transform: translateY(-10px) scale(0.97);
    }

    .dropdown-fade-enter-to,
    .dropdown-fade-leave-from {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
</style>
  