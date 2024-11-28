<template>
    <div class="grid grid-cols-1 gap-4">
        <div class="col-span-1">
            <BaseCard>
                <template #title>Grader un utilisateur</template>

                <template #body>
                    <form @submit.prevent="submitPost" class="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div class="col-span-1">
                            <label class="form-label">Pseudonyme</label>
                            <BaseInput v-model.trim="postForm.username" />
                        </div>
                        <div class="col-span-1">
                            <label class="form-label">Poste</label>
                            <BaseSelect v-model="postForm.rank" :options="rankList"></BaseSelect>
                        </div>

                        <div class="col-span-full">
                            <BaseButton primary :loading="loading">Promouvoir</BaseButton>
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
const postForm = ref({ username: '', rank: 'modo' })

const rankList = ref({
    admin: 'Administration',
    event: 'Evènementiel',
    animateur: 'Animation',
    'animateur-casino': 'Animation Casino',
    modo: 'Modération',
    graphiste: 'Créations artistiques et visuelles',
    helper: 'Assistance',
    arch: 'Créations architecturales',
    wired: 'Créations technologiques',
    croupier: 'Casino',
})

const submitPost = async () => {
    if (loading.value) return

    try {
        loading.value = true

        await useApiFetch('/api/v1/admin/rank', { body: postForm.value, method: 'POST' })

        showMessage({
            message: "L'utilisateur a été rang",
            success: true,
        })

        postForm.value = { username: '', rank: '' }
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}
</script>
