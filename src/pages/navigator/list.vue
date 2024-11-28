<template>
    <div class="grid grid-cols-1 gap-4">
        <div class="col-span-1">
            <label class="text-xl font-bold">Recherche</label>
            <BaseInput placeholder="Filter les resultats de la page" v-model="pageSearch" :delay="500" />
        </div>

        <div class="col-span-1">
            <label class="text-xl font-bold">Choisir une option</label>
            <div class="flex flex-row gap-2 mt-2">
                <BaseButton @click="getRows">Recharger la page</BaseButton>
            </div>
        </div>

        <div class="col-span-1">
            <BaseCard>
                <template #title>Listes des appartements se trouvant dans le navigateur</template>

                <template #body>
                    <BaseSpinner :loading="loading" v-if="loading" />
                    <BaseTable>
                        <template #head>
                            <BaseTableHead>Id</BaseTableHead>
                            <BaseTableHead>Image</BaseTableHead>
                            <BaseTableHead>Type</BaseTableHead>
                            <BaseTableHead>Action</BaseTableHead>
                        </template>
                        <template #body>
                            <BaseTableBody v-for="data in rowsSearch" :key="data.room_id">
                                <BaseTableColunm>
                                    <div class="w-full px-4 py-2">{{ data.room_id }}</div>
                                </BaseTableColunm>
                                <BaseTableColunm>
                                    <img :src="runtimeConfig.public.urlAssets + 'c_images/' + data.image_url" />
                                </BaseTableColunm>
                                <BaseTableColunm>{{ data.category_type }}</BaseTableColunm>
                                <BaseTableColunm><BaseButton primary :loading="loading" little @click.native="deleteNav(data.room_id)">Supprimer</BaseButton></BaseTableColunm>
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
const runtimeConfig = useRuntimeConfig()

const rows = ref<INav[]>([])
const loading = ref(false)

const pageSearch = ref('')

const rowsSearch = computed(() => rows.value.filter((x) => Object.values(x).some((k) => k != null && k.toString().toLowerCase().includes(pageSearch.value.toLowerCase()))))

const getRows = async () => {
    if (loading.value) return

    loading.value = true
    try {
        const data = await $fetch<{ nav: INav[] }>('/api/navigator')

        rows.value = data.nav
    } catch (e) {
        console.error(e)
    }
    loading.value = false
}

onMounted(() => getRows())

const deleteNav = async (id: number) => {
    if (loading.value) return

    try {
        loading.value = true

        await $fetch('/api/navigator/' + id, { method: 'DELETE' })

        rows.value = rows.value.filter((x) => x.room_id)

        showMessage({
            message: "L'appartement a bien été supprimé du navigateur",
            success: true,
        })
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}

interface INav {
    image_url: string
    room_id: number
    category_type: string
}
</script>
