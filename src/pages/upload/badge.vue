<template>
    <div class="grid grid-cols-1 gap-4">
        <div class="col-span-1">
            <BaseCard>
                <template #title>Importer un badge</template>
                <template slot="description">Cette page vousu permet d'implémenter un badge au sein du serveur</template>

                <template #body>
                    <form @submit.prevent="submitPost" enctype="multipart/form-data" class="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div class="col-span-full">
                            <label class="form-label">Image GIF de 40x40</label>
                            <BaseUploadFile accept="image/gif" @upload="handleFileUpload" />
                        </div>
                        <div class="col-span-full">
                            <label class="form-label">Code</label>
                            <BaseInput v-model.trim="postForm.code" />
                        </div>
                        <div class="col-span-1">
                            <label class="form-label">Titre</label>
                            <BaseInput v-model="postForm.title" />
                        </div>
                        <div class="col-span-1">
                            <label class="form-label">Description</label>
                            <BaseInput v-model="postForm.desc" />
                        </div>

                        <div class="col-span-full">
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
const postForm = ref({ code: '', title: '', desc: '' })
const file = ref<File | null>(null)

const handleFileUpload = (fileUploads: FileList) => (file.value = fileUploads[0])

const submitPost = async () => {
    if (loading.value || !file.value) return

    try {
        loading.value = true

        const formData = new FormData()
        formData.append('file', file.value)
        formData.append('code', postForm.value.code)
        formData.append('title', postForm.value.title)
        formData.append('desc', postForm.value.desc)

        await useApiFetch('/api/v1/admin/upload-badge', { body: formData, method: 'POST', headers: { 'Content-Type': 'multipart/form-data' } })

        showMessage({
            message: 'Votre badge a été ajouté !',
            success: true,
        })

        postForm.value = { code: '', title: '', desc: '' }
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}
</script>
