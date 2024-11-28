<template>
    <div class="grid grid-cols-1 gap-4">
        <div class="col-span-1">
            <form @submit.prevent="submitPost" class="grid grid-cols-1 gap-3">
                <div class="col-span-1">
                    <label class="form-label">Pseudo ou Adresse IP</label>
                    <BaseInput v-model.trim="postForm.search" />
                </div>

                <div class="col-span-1">
                    <BaseButton primary :loading="loading">Chercher</BaseButton>
                </div>
            </form>
        </div>
        <div class="col-span-1">
            <BaseCard>
                <template #title>Recherche de multi-comptes</template>

                <template #body>
                    <BaseSpinner :loading="loading" v-if="loading" />
                    <BaseTable>
                        <template #head>
                            <BaseTableHead>Id</BaseTableHead>
                            <BaseTableHead>Nom</BaseTableHead>
                            <BaseTableHead>Pays</BaseTableHead>
                            <BaseTableHead>Status</BaseTableHead>
                        </template>
                        <template #body>
                            <BaseTableBody v-for="data in users" :key="data.id">
                                <BaseTableColunm>{{ data.id }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.username }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.ipcountry }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.online == '1' ? 'En ligne' : 'Hors ligne' }}</BaseTableColunm>
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

const users = ref<IUser[]>([])
const loading = ref(false)
const postForm = ref({ search: '' })

const submitPost = async () => {
    if (loading.value) return

    try {
        loading.value = true

        const response = await useApiFetch<{ users: IUser[] }>('/api/v1/admin/user-account', { body: postForm.value, method: 'POST' })

        users.value = response.users

        if (!users.value.length) {
            showMessage({
                message: 'Aucune log disponible pour ' + postForm.value.search,
            })
        }

        // postForm.value = { search: '' }
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}

interface IUser {
    id: number
    username: string
    ipcountry: string
    online: string
}
</script>
