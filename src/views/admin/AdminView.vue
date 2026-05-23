<template>
    <section class="admin-view">
        <h1 class="admin-view__title">{{ $t('pages.Admin.Title') }}</h1>

        <nav class="admin-view__nav">
            <RouterLink to="/admin/import" class="admin-view__link">
                {{ $t('pages.Admin.ImportCollection') }}
            </RouterLink>
            <!-- <div class="decor">|</div> -->
            <RouterLink to="/admin/collections" class="admin-view__link">
                {{ $t('pages.Admin.Collections') }}
            </RouterLink>
        </nav>

        <router-view />
    </section>
</template>
  
<script setup>
import { RouterLink } from 'vue-router'
</script>
  
<style  lang="scss">
.admin-view {
    padding: 2rem;
    background-color: $background-color;
    min-height: 100vh;

    &__title {
        text-align: center;
        font-size: $title-size;
        margin-bottom: 2rem;
        color: $decor-color-third;
    }

    &__nav {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    &__link {
        color: $primary-color;
        font-weight: 600;
        text-decoration: none;

        &:not(:last-child) {
            &::after {
                content: "|";
                padding-left: 1rem;
                width: 1px;
                height: 100%;
                color: $decor-color-third;

            }
        }

        &:hover {
            color: $creamy-color;
        }

        &.router-link-exact-active {
            color: $decor-color-third;
        }
    }
}

.decor {
    width: 1px;
    height: 100%;
    color: $decor-color-third;
}
</style>
  