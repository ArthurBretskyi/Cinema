<template>
    <div class="admin__select">
        <label class="admin__label">
            {{ $t('components.AdminCollectionSelect.Title') }}
        </label>

        <select v-model="model" class="admin__select-input">
            <option disabled value="">
                {{ $t('components.AdminCollectionSelect.Placeholder') }}
            </option>

            <option v-for="col in collections" :key="col.value" :value="col.value">
                {{ col.icon }} {{ col.label }}
            </option>
        </select>
    </div>
</template>
  
<script setup>
import { computed, onMounted } from 'vue'
import { useCollectionsStore } from '@/stores/collections'

const props = defineProps({ modelValue: String })
const emit = defineEmits(['update:modelValue'])

const store = useCollectionsStore()

onMounted(() => {
    if (Object.keys(store.collections).length === 0) {
        store.loadCollections()
    }
})

const collections = computed(() => store.getCollectionsArray)


const model = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
})
</script>

  
<style  lang="scss">
.admin__select {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .admin__label {
        font-weight: 600;
        color: $creamy-color;
    }

    .admin__select-input {
        padding: 0.6rem 0.8rem;
        border: 1px solid $creamy-color;
        border-radius: 8px;
        font-family: $font-main;
        background-color: transparent;
        color: $text-color;
        cursor: pointer;

        // @include transition(border-color);

        &:focus {
            outline: none;
            border-color: $decor-color-third;
            box-shadow: 0 0 0 2px rgba($decor-color-third, 0.2);
        }
    }
}
</style>
  