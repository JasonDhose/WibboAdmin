<template>
    <div class="grid grid-cols-1 gap-4">
        <div class="col-span-1">
            <BaseCard>
                <template #title>Ajout d'un appartement dans le navigateurr</template>

                <template #body>
                    <form @submit.prevent="submitPost" enctype="multipart/form-data" class="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div class="col-span-full">
                            <label class="form-label">Image de 110x110</label>
                            <BaseUploadFile accept="image/PNG" @upload="handleFileUpload" />
                        </div>
                        <div class="col-span-1">
                            <label class="form-label">Id de l'appartement</label>
                            <BaseInput v-model.trim="postForm.roomid" />
                        </div>

                        <div class="col-span-1">
                            <label class="form-label">Catégorie</label>
                            <BaseSelect v-model="postForm.category" :options="categoryList"></BaseSelect>
                        </div>

                        <div class="col-span-full">
                            <BaseButton primary :loading="loading">Ajouter</BaseButton>
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
const postForm = ref({ roomid: '', category: 'featured' })
const file = ref<File | null>(null)
const categoryList = {
    featured: 'Lieux publics',
    featured_new: 'Nouveautés',
    featured_help_security: 'Aide & Sécurité',
    featured_game: 'Jeux',
    featured_run: 'Runs',
}

const handleFileUpload = (fileUploads: FileList) => (file.value = fileUploads[0])

const submitPost = async () => {
    if (loading.value || file.value == null) return

    try {
        loading.value = true

        const formData = new FormData()
        formData.append('file', file.value)
        formData.append('roomid', postForm.value.roomid)
        formData.append('category', postForm.value.category)

        await useApiFetch('/api/v1/admin/navigator', { body: formData, method: 'POST', headers: { 'Content-Type': 'multipart/form-data' } })

        showMessage({
            message: 'Votre appart a bien été ajouter au navigateur',
            success: true,
        })

        postForm.value = { roomid: '', category: 'featured' }
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}
</script>
