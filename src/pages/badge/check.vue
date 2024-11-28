<template>
    <div class="grid grid-cols-1 gap-4">
        <div class="col-span-1">
            <BaseCard>
                <template #title>Nombre de personne possédant un badge</template>

                <template #body>
                    <form @submit.prevent="submitPost" class="grid grid-cols-1 gap-3">
                        <div class="col-span-1">
                            <label class="form-label">Badge</label>
                            <BaseInput v-model.trim="postForm.code" />
                        </div>

                        <div class="col-span-1">
                            <BaseButton primary :loading="loading">Chercher</BaseButton>
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
const postForm = ref({ code: '' })

const submitPost = async () => {
    if (loading.value) return

    try {
        loading.value = true

        const response = await $fetch<{ count: number }>('/api/badge-count', { body: postForm.value, method: 'POST' })

        const count = response.count

        showMessage({
            message: count ? `${count} utilisateurs possèdent le badge` : 'Aucun utilisateur ne possède ce badge',
            success: true,
        })

        postForm.value = { code: '' }
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}
</script>
