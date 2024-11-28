<template>
    <div class="grid grid-cols-1 gap-4">
        <div class="col-span-1">
            <form @submit.prevent="submitPost" enctype="multipart/form-data" class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div class="col-span-full">
                    <label class="form-label">Pseudo</label>
                    <BaseInput v-model.trim="postForm.username" />
                </div>

                <div class="col-span-1">
                    <label class="form-label">Date</label>
                    <BaseInput type="date" v-model="postForm.startdate" />
                </div>

                <div class="col-span-1">
                    <label class="form-label">Date de fin</label>
                    <BaseInput type="date" v-model="postForm.enddate" />
                </div>

                <div class="col-span-full">
                    <BaseButton primary :loading="loading">Chercher</BaseButton>
                </div>
            </form>
        </div>

        <div class="col-span-1">
            <BaseCard>
                <template #title>Historique des commandes</template>

                <template #body>
                    <BaseSpinner :loading="loading" v-if="loading" />
                    <BaseTable>
                        <template #head>
                            <BaseTableHead>#</BaseTableHead>
                            <BaseTableHead>Nom</BaseTableHead>
                            <BaseTableHead>Message</BaseTableHead>
                            <BaseTableHead>date</BaseTableHead>
                            <BaseTableHead>Appart Id</BaseTableHead>
                        </template>
                        <template #body>
                            <BaseTableBody v-for="(data, index) in cmdlogs" :key="index">
                                <BaseTableColunm>{{ index + 1 }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.user_name }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.extra_data }}</BaseTableColunm>
                                <BaseTableColunm>{{ filters.formatDateComplet(data.timestamp) }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.roomid }}</BaseTableColunm>
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
const postForm = ref({ username: '', startdate: '', enddate: '' })
const cmdlogs = ref<ICmdlog[]>([])

const submitPost = async () => {
    if (loading.value) return

    try {
        loading.value = true

        const response = await useApiFetch<{ cmd: ICmdlog[] }>('/api/v1/admin/user-command', { body: postForm.value, method: 'POST' })

        cmdlogs.value = response.cmd

        if (!cmdlogs.value.length) {
            showMessage({
                message: 'Aucune log disponible pour ' + postForm.value.username,
            })
        }

        // postForm.value = { username: '', startdate: '', enddate: '' }
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}

interface ICmdlog {
    user_name: string
    extra_data: string
    timestamp: number
    roomid: number
}
</script>
