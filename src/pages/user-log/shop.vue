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
                <template #title>Historique des achats</template>

                <template #body>
                    <BaseSpinner :loading="loading" v-if="loading" />
                    <BaseTable>
                        <template #head>
                            <BaseTableHead>#</BaseTableHead>
                            <BaseTableHead>Info</BaseTableHead>
                            <BaseTableHead>Prix</BaseTableHead>
                            <BaseTableHead>Date</BaseTableHead>
                        </template>
                        <template #body>
                            <BaseTableBody v-for="(data, index) in achat" :key="index">
                                <BaseTableColunm>{{ index + 1 }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.content }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.price }}</BaseTableColunm>
                                <BaseTableColunm>{{ filters.formatDateComplet(data.date) }}</BaseTableColunm>
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

const achat = ref<IBoutiqueLog[]>([])
const loading = ref(false)
const postForm = ref({ username: '' })

const submitPost = async () => {
    if (loading.value) return

    try {
        loading.value = true

        const response = await $fetch<{ achat: IBoutiqueLog[] }>('/api/user-shop', { body: postForm.value, method: 'POST' })

        achat.value = response.achat

        if (!achat.value.length) {
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

interface IBoutiqueLog {
    price: number
    content: string
    date: number
}
</script>
