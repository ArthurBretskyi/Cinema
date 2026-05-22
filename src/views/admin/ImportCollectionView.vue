<template>
    <section class="import-collection">
        <div class="import-collection__select select-collection">
            <label class="select-collection__label">
                {{ $t('pages.ImportCollection.SelectLabel') }}
            </label>

            <select v-model="selectedCollection" class="select-collection__input">
                <option disabled value="">
                    {{ $t('pages.ImportCollection.PlaceholderSelect') }}
                </option>

                <option v-for="col in collections" :key="col.value" :value="col.value">
                    {{ col.icon }} {{ col.label }}
                </option>
            </select>
        </div>

        <div class="import-collection__file">
            <input ref="fileInputRef" type="file" accept=".json" @change="handleFileUpload($event)"
                class="import-collection__file-input" />
        </div>

        <div class="import-collection__document-name document-name">
            <label for="documentName" class="document-name__label">{{ $t('pages.ImportCollection.DocumentNameLabel')
            }}</label>
            <input id="documentName" v-model="documentName" type="text"
                :placeholder="$t('pages.ImportCollection.PlaceholderInput')" class="document-name__input" />
        </div>

        <AdminActionButton :disabled="!fileData" :label="$t('pages.ImportCollection.ImportButton')" :loading="isLoading"
            @click="handleImport" />

        <p v-if="message" class="import-collection__message">{{ message }}</p>
    </section>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCollectionsStore } from '@/stores/collections'
import { useGeneralStore } from '@/stores/general'
import { importJsonToFirestore } from '@/utils/importJsonToFirestore'
import { useAuthStore } from '@/stores/auth'
import AdminActionButton from '@/components/admin/AdminActionButton.vue'

const { generalApiOperation, isLoading } = useGeneralStore()
const authStore = useAuthStore()

const store = useCollectionsStore()

onMounted(() => {
    if (Object.keys(store.collections).length === 0) {
        store.loadCollections()
    }
})

const collections = computed(() => store.getCollectionsArray)

const selectedCollection = ref('')

const fileData = ref(null)

const fileInputRef = ref(null)

function handleFileUpload(event) {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
        try {
            fileData.value = JSON.parse(e.target.result)
        } catch {
            alert('❌ Невірний формат JSON.')
        }
    }
    reader.readAsText(file)
}

const documentName = ref('')

const message = ref('')

let messageTimer = null

async function handleImport() {
    if (!authStore.isAdmin) {
        message.value = '⛔ Лише адміністратор може імпортувати дані.'
        return
    }
    const isSingleDocument = !!documentName.value && !Array.isArray(fileData.value)
    await generalApiOperation(async () => {
        const collectionName = selectedCollection.value
        const docName = documentName.value
        clearTimeout(messageTimer)
        if (isSingleDocument) {
            await importJsonToFirestore(collectionName, fileData.value, docName)
            message.value = `Дані імпортовано до "${collectionName}/${docName}".`

        } else {
            await importJsonToFirestore(collectionName, fileData.value)
            message.value = `Дані імпортовано до "${collectionName}".`
        }
        messageTimer = setTimeout(() => { message.value = '' }, 3000)

        selectedCollection.value = ''
        fileData.value = null
        documentName.value = ''
        if (fileInputRef.value) fileInputRef.value.value = ''
    })
}

</script>
  
<style  lang="scss" >
.import-collection {
    max-width: 650px;
    margin: 3rem auto;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: $shadow-card;
    border: 3px solid $decor-color-third;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    &__select {
        @include flex-label-input-select
    }

    &__file {}

    &__file-input {}

    &__document-name {
        @include flex-label-input-select
    }

    &__message {
        text-align: center;
        color: $text-color;
        font-style: italic;
    }
}

.select-collection {

    &__label {
        font-weight: 600;
        color: $creamy-color;
    }

    &__input {
        @include input-admin($creamy-color, $font-main, $primary-color);
        color: $text-color;
        cursor: pointer;

        &:focus {
            outline: none;
            border-color: $decor-color-third;
            box-shadow: 0 0 0 2px rgba($decor-color-third, 0.2);
        }
    }
}

.document-name {

    &__label {
        font-weight: 600;
        color: $creamy-color;
    }

    &__input {
        @include input-admin($creamy-color, $font-main, $primary-color)
    }
}
</style>
  