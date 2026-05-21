<template>
    <button class="admin__button button" :class="{ 'is-loading': loading }" :disabled="disabled || loading"
        @click="$emit('click')">
        <span v-if="loading">⏳ {{ $t('general.loading') }}</span>
        <span v-else>{{ label }}</span>
    </button>
</template>
  
<script setup>
const props = defineProps({
    label: String,
    disabled: Boolean,
    loading: Boolean
})
</script>
  
<style  lang="scss">
.admin__button {
    // @include flex-center;
    // padding: 0.75rem 1.2rem;
    // border: none;
    // border-radius: 8px;
    // font-family: $font-main;
    // background-color: $decor-color-third;
    // color: $primary-color;
    // cursor: pointer;
    // font-weight: 600;
    // box-shadow: $shadow-card;
    // // @include transition($decor-color-third, transform);

    // &:hover:not(:disabled) {
    //     background-color: #14ff20;
    //     transform: translateY(-1px);
    // }

    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    &.is-loading {
        background-color: rgb(199, 192, 192);
        color: $text-color;
    }
}
</style>
  