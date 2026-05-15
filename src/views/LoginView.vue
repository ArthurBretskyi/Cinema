<template>
    <div class="login-modal" @click.self="closePopup">
        <div class="login-modal__content">
            <button class="login-modal__close" @click="closePopup">×</button>

            <h1 class="login-modal__title">{{ $t('pages.Login.Title') }}</h1>

            <p class="login-modal__text">
                {{ $t('pages.Login.NoAccount') }}
                <router-link class="login-modal__link" :to="{ name: 'Register' }">Register</router-link>
            </p>

            <form class="login-modal__form" @submit.prevent="handleLogin">
                <input v-model="form.email" type="email" :placeholder="$t('pages.Login.Email')" class="login-modal__input"
                    required />
                <input v-model="form.password" type="password" :placeholder="$t('pages.Login.Password')"
                    class="login-modal__input" required />

                <p v-if="localError" class="login-modal__error">{{ localError }}</p>
                <p v-if="hasError" class="login-modal__error">{{ $t('errors.smthWrong') }}</p>

                <button type="submit" class="login-modal__btn button">
                    {{ $t('pages.Login.LogInBtn') }}
                </button>
            </form>

            <div class="login-modal__divider">{{ $t('pages.Login.Or') }}</div>

            <button class="login-modal__btn login-modal__btn--google" @click="handleGoogleSignIn">
                <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {{ $t('pages.Login.Google') }}
            </button>

            <LoadingComponent v-if="isLoading" />
        </div>
    </div>
</template>
  
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { useGeneralStore } from '@/stores/general'

// import LoadingComponent from '@/components/LoadingComponent.vue'

const { t } = useI18n()
const router = useRouter()

const form = ref({
    email: '',
    password: '',
})

const localError = ref(null)
const authStore = useAuthStore()
const usersStore = useUsersStore()
const generalStore = useGeneralStore()

const { isLoading, hasError, generalApiOperation } = generalStore

const handleLogin = async () => {
    localError.value = null

    await generalApiOperation({
        operation: async () => {
            const user = await authStore.loginWithEmail(form.value.email, form.value.password)

            const exists = await usersStore.checkUserExists(user.uid)
            if (!exists) {
                localError.value = t('pages.login.user_not_found')
                await authStore.logout()
                return
            }

            await authStore.fetchUserRole(user.uid)
            closePopup()
            router.push({ name: 'Home' })
        },
    })
}

const handleGoogleSignIn = async () => {
    localError.value = null

    await generalApiOperation({
        operation: async () => {
            const user = await authStore.loginWithGoogleAccount()
            const uid = user?.uid
            if (!uid) throw new Error('Google login failed')

            const exists = await usersStore.checkUserExists(uid)
            if (!exists) {
                const userData = {
                    uid,
                    email: user.email || '',
                    username: user.displayName || '',
                    firstName: '',
                    lastName: '',
                    createdAt: new Date().toISOString(),
                }
                await usersStore.addItemWithCustomId({ id: uid, data: userData })
            }

            await authStore.fetchUserRole(uid)
            closePopup()
            router.push({ name: 'Home' })
        },
    })
}

const closePopup = () => router.push({ name: 'Home' })
</script>
  
<style lang="scss" scoped>
.login-modal {
    @include flex-center;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 10px;
    z-index: 1000;
    overflow-y: auto;

    &__content {
        background-color: rgba(0, 0, 0, 0.5);
        color: $primary-color;
        border: 3px solid $decor-color-third;
        padding: 1rem 3rem;
        border-radius: 1rem;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        position: relative;
        animation: fadeIn 0.3s ease;
    }

    &__close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: $text-color;
        cursor: pointer;
    }

    &__title {
        text-align: center;
        margin-bottom: 1rem;
    }

    &__text {
        text-align: center;
        margin-bottom: 1rem;
        color: $text-color;
    }

    &__link {
        color: $decor-color-first;
        font-size: 18px;
        font-weight: bold;
        margin-left: 0.25rem;
    }

    &__form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    &__input {
        padding: 0.4rem;
        border: 1px solid $decor-color-third;
        border-radius: 0.5rem;
        color: $primary-color;

        &::placeholder {
            font-size: .875rem;
            color: $text-color;
        }
    }

    &__error {
        color: red;
        font-size: 0.875rem;
        text-align: center;
    }

    &__btn {
        font-size: 1.125rem;
        width: 100%;
        background-color: transparent;
        color: $decor-color-third;
        border: 1px solid transparent;
        padding: 10px 20px;
        transition: all 0.5s ease-in-out;

        &:hover {
            border: 1px solid $decor-color-third;
            color: $primary-color;
        }

        &--google {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            border: none;
            color: #fff;

            &:hover {
                color: $decor-color-first;
                border: none;
            }
        }
    }

    &__divider {
        display: flex;
        align-items: center;
        text-align: center;

        &::before,
        &::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid rgb(40.4, 40.4, 40.4);
            margin: 0 10px;
        }
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
  