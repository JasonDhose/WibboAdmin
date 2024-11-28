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
                <template #title>Historique de bannissement</template>

                <template #body>
                    <BaseSpinner :loading="loading" v-if="loading" />
                    <BaseTable>
                        <template #head>
                            <BaseTableHead>#</BaseTableHead>
                            <BaseTableHead>Nom/IP</BaseTableHead>
                            <BaseTableHead>Raison</BaseTableHead>
                            <BaseTableHead>Par</BaseTableHead>
                            <BaseTableHead>Date</BaseTableHead>
                            <BaseTableHead>Expire</BaseTableHead>
                        </template>
                        <template #body>
                            <BaseTableBody v-for="(data, index) in bans" :key="index">
                                <BaseTableColunm>{{ index + 1 }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.value }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.reason }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.added_by }}</BaseTableColunm>
                                <BaseTableColunm>{{ filters.formatDateComplet(data.added_date) }}</BaseTableColunm>
                                <BaseTableColunm>{{ filters.formatDateComplet(data.expire) }}</BaseTableColunm>
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
const bans = ref<IBan[]>([])

const submitPost = async () => {
    if (loading.value) return

    try {
        loading.value = true

        const response = await $fetch<{ bans: IBan[] }>('/api/user-ban', { body: postForm.value, method: 'POST' })

        bans.value = response.bans

        if (!bans.value.length) {
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

interface IBan {
    value: string
    reason: string
    added_by: string
    added_date: number
    expire: number
}
</script>
