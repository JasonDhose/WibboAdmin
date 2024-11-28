<template>
    <div class="grid grid-cols-1 gap-4">
        <div class="col-span-1">
            <BaseCard>
                <template #title>Envoyer un badge</template>

                <template #body>
                    <form @submit.prevent="submitPost" class="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div class="col-span-1">
                            <label class="form-label">Pseudo</label>
                            <BaseInput v-model.trim="postForm.username" />
                        </div>

                        <div class="col-span-1">
                            <label class="form-label">Code du badge</label>
                            <BaseInput v-model.trim="postForm.code" />
                        </div>

                        <div class="col-span-full">
                            <BaseButton primary :loading="loading">Envoyer</BaseButton>
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
const postForm = ref({ username: '', code: '' })

const submitPost = async () => {
    if (loading.value) return

    try {
        loading.value = true

        await useApiFetch('/api/v1/admin/badge', { body: postForm.value, method: 'POST' })

        showMessage({
            message: 'Le badge a été envoyé !',
            success: true,
        })

        postForm.value = { username: '', code: '' }
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}
</script>
