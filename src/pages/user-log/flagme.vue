<template>
    <div class="grid grid-cols-1 gap-4">
        <div class="col-span-1">
            <form @submit.prevent="submitPost" class="grid grid-cols-1 gap-3">
                <div class="col-span-1">
                    <label class="form-label">Pseudo</label>
                    <BaseInput v-model.trim="postForm.username" />
                </div>

                <div class="col-span-1">
                    <BaseButton primary :loading="loading">Chercher</BaseButton>
                </div>
            </form>
        </div>
        <div class="col-span-1">
            <BaseCard>
                <template #title>Historique des changements de pseudonyme</template>

                <template #body>
                    <BaseSpinner :loading="loading" v-if="loading" />
                    <BaseTable>
                        <template #head>
                            <BaseTableHead>#</BaseTableHead>
                            <BaseTableHead>Ancien nom</BaseTableHead>
                            <BaseTableHead>Nouveau nom</BaseTableHead>
                            <BaseTableHead>Date</BaseTableHead>
                        </template>
                        <template #body>
                            <BaseTableBody v-for="(data, index) in logs" :key="index">
                                <BaseTableColunm>{{ index + 1 }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.oldusername }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.newusername }}</BaseTableColunm>
                                <BaseTableColunm>{{ filters.formatDateComplet(data.time) }}</BaseTableColunm>
                            </BaseTableBody>
                        </template>
                    </BaseTable>
                </template>
            </BaseCard>
        </div>
    </div>
</template>

<script lang="ts" setup>
import * as filters from '~/utils/filters'

const { showMessage } = useNotification()

const loading = ref(false)
const postForm = ref({ username: '' })
const logs = ref<IFlagme[]>([])

const submitPost = async () => {
    if (loading.value) return

    try {
        loading.value = true

        const response = await $fetch<{ logs: IFlagme[] }>('/api/user-flagme', { body: postForm.value, method: 'POST' })

        logs.value = response.logs

        if (!logs.value || !logs.value.length) {
            showMessage({
                message: 'Aucune log disponible pour ' + postForm.value.username,
            })
        }

        // postForm.value = { username: '' }
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}

interface IFlagme {
    oldusername: string
    newusername: string
    time: number
}
</script>
