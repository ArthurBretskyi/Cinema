<template>
    <div class="header__auth-container">
        <div v-if="!user" class="header__auth">
            <font-awesome-icon class="auth-icon" icon="fa-solid fa-user" />
            <router-link :to="{ name: 'Register' }" class="auth-link">
                {{ $t('components.UserAuth.Register') }}
            </router-link>
            <span>/</span>
            <router-link :to="{ name: 'Login' }" class="auth-link">
                {{ $t('components.UserAuth.LogIn') }}
            </router-link>
        </div>

        <div v-else>
            <UserDropDownComponent />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import UserDropDownComponent from '@/components/Header/UserDropDownComponent.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.getUser())

</script>

<style lang="scss" scoped>
.header__auth-container {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.header__auth {
    display: flex;
    align-items: center;
    font-size: 1.125rem;
    column-gap: 0.5rem;
    text-decoration: none;

    .auth-icon {
        transition: all 0.5s ease-in-out;
    }

    span {
        transition: all 0.5s ease-in-out;
    }

    &:hover {
        .auth-icon {
            color: $decor-color-third;
        }

        span {
            color: $decor-color-third;
        }
    }
}
</style>