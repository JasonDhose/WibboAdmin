<template>
    <div class="grid grid-cols-1 gap-4">
        <div class="col-span-1">
            <label class="text-xl font-bold">Choisir une option</label>
            <div class="flex flex-row gap-2 mt-2">
                <BaseButton @click="getRows">Recharger la page</BaseButton>
            </div>
        </div>

        <div class="col-span-1">
            <BaseCard>
                <template #title>Les 50 dernières inscriptions</template>

                <template #body>
                    <BaseSpinner :loading="loading" v-if="loading" />
                    <BaseTable>
                        <template #head>
                            <BaseTableHead>Id</BaseTableHead>
                            <BaseTableHead>Nom</BaseTableHead>
                            <BaseTableHead>Pays</BaseTableHead>
                            <BaseTableHead>Statut</BaseTableHead>
                            <BaseTableHead>Action</BaseTableHead>
                        </template>
                        <template #body>
                            <BaseTableBody v-for="data in users" :key="data.id">
                                <BaseTableColunm>{{ data.id }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.username }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.ipcountry }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.online === 1 ? 'En ligne' : 'Hors ligne' }}</BaseTableColunm>
                                <BaseTableColunm><BaseButton primary little @click.native="banUser(data)">Bannir IP + compte</BaseButton></BaseTableColunm>
                            </BaseTableBody>
                        </template>
                    </BaseTable>
                </template>
            </BaseCard>
        </div>
    </div>
</template>

<script lang="ts" setup>
const { showMessage } = useNotification()

const loading = ref(false)
const users = ref<IUser[]>([])

const getRows = async () => {
    if (loading.value) return

    loading.value = true
    try {
        const data = await $fetch<{ users: IUser[] }>('/api/user/last')

        users.value = data.users
    } catch (e) {
        console.error(e)
    }
    loading.value = false
}

onMounted(() => getRows())

const banUser = (user: IUser) => {
    if (loading.value) return

    try {
        loading.value = true

        const formData = new FormData()
        formData.append('username', user.username)
        formData.append('reason', 'Non respect du règlement')
        formData.append('time', '100008')
        formData.append('type', '2')

        $fetch('/api/ban', { body: formData, method: 'POST' })

        showMessage({
            message: "L'utilisateur a bien été banni",
            success: true,
        })
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}

interface IUser {
    id: number
    username: string
    rank: number
    online: number
    ipcountry: string
}
</script>
