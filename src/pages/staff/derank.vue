<template>
    <div class="grid grid-cols-1 gap-4">
        <div class="col-span-1">
            <BaseCard>
                <template #title>Rétrograder un Staff</template>

                <template #body>
                    <form @submit.prevent="submitPost" class="grid grid-cols-1 gap-3">
                        <div class="col-span-1">
                            <label class="form-label">Pseudo</label>
                            <BaseInput v-model.trim="postForm.username" />
                        </div>

                        <div class="col-span-1">
                            <BaseButton primary :loading="loading">Dé-rang</BaseButton>
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
const postForm = ref({ username: '' })

const submitPost = async () => {
    if (loading.value) return

    try {
        loading.value = true

        await useApiFetch('/api/v1/admin/rank/' + postForm.value.username, { method: 'DELETE' })

        showMessage({
            message: "L'utilisateur a été dérang",
            success: true,
        })

        postForm.value = { username: '' }
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}
</script>
