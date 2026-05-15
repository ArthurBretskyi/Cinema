<template>
    <div class="register-modal" @click.self="closePopup">
        <div class="register-modal__content">
            <button class="register-modal__close" @click="closePopup">×</button>

            <h1 class="register-modal__title">{{ $t('pages.Register.Title') }}</h1>

            <p class="register-modal__text">
                {{ $t('pages.Register.AlreadyHaveAccount') }}
                <router-link class="register-modal__link" :to="{ name: 'Login' }">Login</router-link>
            </p>

            <form class="register-modal__form" @submit.prevent="handleRegister">
                <input v-model="form.firstName" :placeholder="$t('pages.Register.FirstName')" class="register-modal__input"
                    required />
                <input v-model="form.lastName" :placeholder="$t('pages.Register.LastName')" class="register-modal__input"
                    required />
                <input v-model="form.email" type="email" :placeholder="$t('pages.Register.Email')"
                    class="register-modal__input" required />
                <input v-model="form.password" type="password" :placeholder="$t('pages.Register.Password')"
                    class="register-modal__input" required />
                <input v-model="form.confirmPassword" type="password" :placeholder="$t('pages.Register.ConfirmPassword')"
                    class="register-modal__input" required />

                <p v-if="localError" class="register-modal__error">{{ localError }}</p>
                <p v-if="hasError" class="register-modal__error">{{ $t('pages.Register.Error') }}</p>

                <button type="submit" class="register-modal__btn button">
                    {{ $t('pages.Register.RegisterBtn') }}
                </button>
            </form>

            <div class="register-modal__divider">{{ $t('pages.Register.Divider') }}</div>

            <button class="register-modal__btn register-modal__btn--google" @click="handleGoogleSignIn">
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
                {{ $t('pages.Register.Google') }}
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
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
})

const localError = ref(null)
const authStore = useAuthStore()
const usersStore = useUsersStore()
const generalStore = useGeneralStore()

const { isLoading, hasError, generalApiOperation } = generalStore

const handleRegister = async () => {
    localError.value = null
    if (form.value.password !== form.value.confirmPassword) {
        localError.value = t('errors.passwords_not_match')
        return
    }

    await generalApiOperation({
        operation: async () => {
            const createdUser = await authStore.registerWithEmail(form.value.email, form.value.password)
            const userData = {
                uid: createdUser.uid,
                email: form.value.email,
                username: form.value.username,
                firstName: form.value.firstName,
                lastName: form.value.lastName,
                role: 'user',
                createdAt: new Date().toISOString(),
                permissions: { isAdmin: false },
            }
            await usersStore.addItemWithCustomId({ id: createdUser.uid, data: userData })
            closePopup()
            router.push({ name: 'Home' })
        },
    })
}

const handleGoogleSignIn = async () => {
    localError.value = null
    await generalApiOperation({
        operation: async () => {
            const userCredential = await authStore.loginWithGoogleAccount()
            const user = userCredential
            const exists = await usersStore.checkUserExists(user.uid)
            if (!exists) {
                await usersStore.addItemWithCustomId({
                    id: user.uid,
                    data: {
                        uid: user.uid,
                        email: user.email,
                        username: user.displayName,
                        firstName: '',
                        lastName: '',
                        role: 'user',
                        createdAt: new Date().toISOString(),
                        permissions: { isAdmin: false },
                    },
                })
            }
            closePopup()
            router.push({ name: 'Home' })
        },
    })
}

const closePopup = () => router.push({ name: 'Home' })
</script>
  
<style lang="scss" scoped>
.register-modal {
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
            color: $text-color ;
        }
    }

    &__error {
        color: red;
        font-size: 0.875rem;
        text-align: center;
    }

    &__btn {
        width: 100%;
        margin-top: 1rem;
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
            gap: .625rem;
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
  