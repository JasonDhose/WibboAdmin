<template>
    <div class="grid grid-cols-1 gap-4">
        <div class="col-span-1">
            <BaseCard>
                <template #title>Importer une image</template>

                <template #body>
                    <form @submit.prevent="submitPost" enctype="multipart/form-data" class="grid grid-cols-1 gap-3">
                        <div class="col-span-1">
                            <label class="form-label">Image</label>
                            <BaseUploadFile accept="image/*" @upload="handleFileUpload" />
                        </div>

                        <div class="col-span-1">
                            <BaseButton primary :loading="loading">Importer</BaseButton>
                        </div>
                    </form>
                </template>
            </BaseCard>
        </div>
    </div>
</template>

<script lang="ts" setup>
const { showMessage } = useNotification()

const loading = ref(false)
const file = ref<File | null>(null)

const handleFileUpload = (fileUploads: FileList) => (file.value = fileUploads[0])

const submitPost = async () => {
    if (loading.value || !file.value) return

    try {
        loading.value = true

        const formData = new FormData()
        formData.append('file', file.value)

        const response = await useApiFetch<{ url: string }>('/api/v1/admin/upload-image', { body: formData, method: 'POST', headers: { 'Content-Type': 'multipart/form-data' } })

        const url = response.url

        showMessage({
            message: 'Votre image a été ajouté !',
            success: true,
            copy: url,
        })
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}
</script>
