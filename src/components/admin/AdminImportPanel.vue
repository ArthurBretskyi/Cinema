<template>
    <div class="admin__panel">
        <input type="file" accept=".json" @change="handleFileUpload($event)" class="admin__file-input input" />
        <div class="admin__custom-id">
            <label for="customId">{{ $t('components.AdminImportPanel.DocumentNameLabel') }}</label>
            <input id="customId" v-model="customId" type="text" placeholder="Enter document's name" class="input" />
        </div>

        <AdminActionButton :disabled="!fileData" :label="$t('pages.admin.importPanel.importButton')"
            :loading="loading" @click="emitImport" />
    </div>
</template>
  
<script setup>
import { ref } from 'vue'
import AdminActionButton from '@/components/admin/AdminActionButton.vue'

const emit = defineEmits(['import'])
const fileData = ref(null)
const loading = ref(false)
const customId = ref('')

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
function emitImport() {
    emit('import', { fileData: fileData.value, customId: customId.value.trim() })
}
</script>
  
<style  lang="scss">
.admin__panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .admin__custom-id {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }
}
</style>
  