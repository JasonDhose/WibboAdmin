<template>
    <div class="grid grid-cols-1 gap-4">
        <div class="col-span-1">
            <form @submit.prevent="submitPost" class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div class="col-span-full">
                    <label class="form-label">Pseudo</label>
                    <BaseInput v-model.trim="postForm.username" />
                </div>

                <div class="col-span-full">
                    <label class="form-label">Room Id</label>
                    <BaseInput v-model.trim="postForm.roomid" number />
                </div>

                <div class="col-span-1">
                    <label class="form-label">Date de début</label>
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
                <template #title>Historique du chat</template>

                <template #body>
                    <BaseSpinner :loading="loading" v-if="loading" />
                    <BaseTable>
                        <template #head>
                            <BaseTableHead>#</BaseTableHead>
                            <BaseTableHead>Nom</BaseTableHead>
                            <BaseTableHead>Type</BaseTableHead>
                            <BaseTableHead>Message</BaseTableHead>
                            <BaseTableHead>Date</BaseTableHead>
                            <BaseTableHead>Appart Id</BaseTableHead>
                        </template>
                        <template #body>
                            <BaseTableBody v-for="(data, index) in chatlogs" :key="data.id">
                                <BaseTableColunm>{{ index + 1 }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.user_name }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.type }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.message }}</BaseTableColunm>
                                <BaseTableColunm>{{ filters.formatDateComplet(data.timestamp) }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.room_id }}</BaseTableColunm>
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
const postForm = ref({ username: '', roomid: -1, startdate: '', enddate: '' })
const chatlogs = ref<IChatlog[]>([])

const submitPost = async () => {
    if (loading.value) return

    try {
        loading.value = true

        const response = await $fetch<{ chatlogs: IChatlog[] }>('/api/user-chatlog', { body: postForm.value, method: 'POST' })

        chatlogs.value = response.chatlogs

        if (!chatlogs.value.length) {
            showMessage({
                message: 'Aucune log disponible pour ' + postForm.value.username,
            })
        }

        // postForm.value = { username: '', roomid: -1, startdate: '', enddate: '' }
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}

interface IChatlog {
    id: number
    user_name: string
    type: string
    message: string
    timestamp: number
    room_id: number
}
</script>
