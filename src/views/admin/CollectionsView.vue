<template>
    <section class="collections">
        <!-- <h2 class="admin__title">{{ $t('pages.admin.collections.title') }}</h2> -->

        <div class="collections__list">
            <div v-for="(col, key) in collectionsStore.collections" :key="key" class="collections__item">
                <span class="collections__icon">{{ col.icon }}</span>
                <span class="collections__label">{{ col.label }}</span>
                <p class="collections__desc">{{ col.description }}</p>
            </div>
        </div>

        <div class="collections__action">
            <AdminActionButton label="🔄 Оновити з Firestore" @click="collectionsStore.loadCollections" />
        </div>
    </section>
</template>
  
<script setup>
import { onMounted } from 'vue'
import { useCollectionsStore } from '@/stores/collections'
import AdminActionButton from '@/components/admin/AdminActionButton.vue'

const collectionsStore = useCollectionsStore()

onMounted(() => {
    collectionsStore.loadCollections()
})
</script>
  
<style scoped lang="scss">
.collections {
    padding: 2rem;
    color: $text-color;

    &__list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    &__item {
        border: 1px solid rgba($creamy-color, 0.3);
        border-radius: 8px;
        padding: 1rem;
        background-color: rgba($background-color, 0.3);
    }

    &__icon {
        font-size: 1.5rem;
    }

    &__label {
        font-weight: bold;
        margin-left: 0.5rem;
    }

    &__desc {
        font-size: 0.9rem;
        opacity: 0.7;
    }

    &__action {
        margin-block-start: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        justify-content: center;
        align-items: center;
    }
}
</style>
  