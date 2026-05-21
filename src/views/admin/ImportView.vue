<template>
    <section class="import-view">
        <!-- <h2 class="import-view__title">{{ $t('admin.import.title') }}</h2> -->

        <AdminCollectionSelect v-model="selectedCollection" />
        <AdminImportPanel @import="handleImport" />

        <p v-if="message" class="import-view__message">{{ message }}</p>
    </section>
</template>
  
<script setup>
import { ref } from 'vue'
import { useGeneralStore } from '@/stores/general'
import { importJsonToFirestore } from '@/utils/importJsonToFirestore'
import { useAuthStore } from '@/stores/auth'

import AdminCollectionSelect from '@/components/admin/AdminCollectionSelect.vue'
import AdminImportPanel from '@/components/admin/AdminImportPanel.vue'

const { generalApiOperation } = useGeneralStore()
const authStore = useAuthStore()


const selectedCollection = ref('')
const message = ref('')

async function handleImport({ fileData, customId }) {
    if (!authStore.isAdmin) {
        message.value = '⛔ Лише адміністратор може імпортувати дані.'
        return
    }

    const isSingleDocument =
        !!customId && !Array.isArray(fileData)

    await generalApiOperation(async () => {
        if (isSingleDocument) {
            await importJsonToFirestore(
                selectedCollection.value,
                fileData,
                customId
            )

            message.value = `✅ Дані імпортовано до "${selectedCollection.value}/${customId}".`
        } else {
            await importJsonToFirestore(
                selectedCollection.value,
                fileData
            )

            message.value = `✅ Дані імпортовано до "${selectedCollection.value}".`
        }
    })
}

</script>
  
<style  lang="scss" >
.import-view {
    max-width: 650px;
    margin: 3rem auto;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: $shadow-card;
    border: 3px solid $decor-color-third;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    &__title {
        text-align: center;
        font-size: 1.6rem;
        color: $primary-color;
        font-family: $font-main;
        margin-bottom: 1rem;
    }

    &__message {
        text-align: center;
        color: $text-color;
        font-style: italic;
    }
}
</style>
  