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
                <template #title>Mettre à jour un Staff</template>

                <template #body>
                    <BaseSpinner :loading="loading" v-if="loading" />
                    <BaseTable>
                        <template #head>
                            <BaseTableHead>Id</BaseTableHead>
                            <BaseTableHead>Nom</BaseTableHead>
                            <BaseTableHead>Fonction</BaseTableHead>
                            <BaseTableHead>Mise à jour</BaseTableHead>
                        </template>
                        <template #body>
                            <BaseTableBody v-for="data in staffs" :key="data.userid">
                                <BaseTableColunm>{{ data.userid }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.username }}</BaseTableColunm>
                                <BaseTableColunm><BaseInput v-model="data.function" text-to-edit /></BaseTableColunm>
                                <BaseTableColunm><BaseButton primary :loading="loading" little @click.native="updateStaff(data)">Mettre à jour</BaseButton></BaseTableColunm>
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

const staffs = ref<IStaff[]>([])
const loading = ref(false)

const getRows = async () => {
    if (loading.value) return

    loading.value = true
    try {
        const data = await $fetch<{ staffs: IStaff[] }>('/api/staffs')

        staffs.value = data.staffs
    } catch (e) {
        console.error(e)
    }
    loading.value = false
}

onMounted(() => getRows())

const updateStaff = async (data: IStaff) => {
    if (loading.value) return

    try {
        loading.value = true

        await $fetch('/api/staffs', { body: data, method: 'POST' })

        showMessage({
            message: 'Mise à jour réussi',
            success: true,
        })
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}

interface IStaff {
    userid: number
    username: string
    function: string
    social_insta: string
    social_discord: string
}
</script>
