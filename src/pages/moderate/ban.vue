<template>
    <div class="grid grid-cols-1 gap-4">
        <div class="col-span-1">
            <BaseCard>
                <template #title>Bannissement</template>

                <template #body>
                    <form @submit.prevent="submitPost" class="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div class="col-span-1">
                            <label class="form-label">Pseudo</label>
                            <BaseInput v-model.trim="postForm.username" />
                        </div>

                        <div class="col-span-1">
                            <label class="form-label">Raison</label>
                            <BaseInput v-model="postForm.reason" />
                        </div>

                        <div class="col-span-1">
                            <label class="form-label">Temps</label>
                            <BaseSelect v-model="postForm.time" :options="banList"> </BaseSelect>
                        </div>

                        <div class="col-span-1">
                            <label class="form-label">Type</label>
                            <BaseSelect v-model="postForm.type" :options="{ '1': 'Compte', '2': 'Compte + IP' }"></BaseSelect>
                        </div>

                        <div class="col-span-full">
                            <BaseButton primary :loading="loading">Bannir</BaseButton>
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
const postForm = ref({ username: '', reason: '', time: '', type: '1' })
const banList = ref({
    '1': '1 heure',
    '2': '2 heures',
    '4': '4 heures',
    '6': '6 heures',
    '8': '8 heures',
    '10': '10 heures',
    '12': '12 heures',
    '24': '1 jour',
    '48': '2 jours',
    '168': '1 semaine',
    '730': '1mois',
    '100008': 'Définitivement',
})

const submitPost = async () => {
    if (loading.value) return

    try {
        loading.value = true

        await useApiFetch('/api/v1/admin/ban', { body: postForm.value, method: 'POST' })

        showMessage({
            message: "L'utilisateur a bien été banni",
            success: true,
        })

        postForm.value = { username: '', reason: '', time: '', type: '1' }
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}
</script>
