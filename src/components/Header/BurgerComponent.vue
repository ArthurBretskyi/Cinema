<template>
    <div class="burger" @click="$emit('toggle-menu')">
        <div class="burger__lines">
            <span class="burger__line line1"></span>
            <span class="burger__line line2"></span>
            <span class="burger__line line3"></span>
        </div>
        <span class="burger__text">{{ $t("components.BurgerComponent.OpenMenu") }}</span>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.burger {
    @include flex-center;
    gap: 0.8rem;
    background: none;
    border: none;
    cursor: pointer;
    color: $text-color;
    position: relative;

    &__lines {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 1.4rem;
    }

    &__line {
        display: block;
        height: 2px;
        background-color: $text-color;
        border-radius: 2px;
        transition: all 0.5s ease-in-out;
    }

    .line1 {
        width: 26px;
    }

    .line2 {
        width: 20px;
    }

    .line3 {
        width: 14px;
    }

    &__text {
        opacity: 0;
        font-size: 1.125rem;
        color: $decor-color-third;
        transform: translateX(-5px);
        transition: all 0.5s ease-in-out;
    }

    &:hover {
        .line1 {
            // background-color: $decor-color-first;
            width: 14px;
        }

        .line2 {
            // background-color: $decor-color-second;
            width: 20px;
        }

        .line3 {
            // background-color: $decor-color-third;
            width: 26px;
        }

        .burger__text {
            opacity: 1;
            transform: translateX(0);
        }
    }
}
</style>