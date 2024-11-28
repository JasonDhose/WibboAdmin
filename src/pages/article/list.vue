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
                <template #title>Liste des articles</template>
                <template #body>
                    <BaseSpinner :loading="loading" v-if="loading" />
                    <BaseTable>
                        <template #head>
                            <BaseTableHead>#</BaseTableHead>
                            <BaseTableHead>Titre</BaseTableHead>
                            <BaseTableHead>Description</BaseTableHead>
                            <BaseTableHead>Date</BaseTableHead>
                            <BaseTableHead>Action</BaseTableHead>
                        </template>
                        <template #body>
                            <BaseTableBody v-for="row in rowsSearch" :key="row.id">
                                <BaseTableColunm>
                                    <div class="w-full px-4 py-2">{{ row.id }}</div>
                                </BaseTableColunm>
                                <BaseTableColunm>{{ row.title }}</BaseTableColunm>
                                <BaseTableColunm>{{ row.snippet }}</BaseTableColunm>
                                <BaseTableColunm>{{ filters.formatDateComplet(row.timestamp) }}</BaseTableColunm>
                                <BaseTableColunm class="flex gap-2">
                                    <BaseButton primary little @click.native="deleteRow(row.id)">Supprimer</BaseButton>
                                    <BaseButton primary little @click.native="$router.push({ path: '/article/' + row.id })">Editer</BaseButton>
                                </BaseTableColunm>
                            </BaseTableBody>
                        </template>
                    </BaseTable>
                    <BasePagination :page-id="pageCurrent" :page-count="pageCount" @pageCurrent="updatePageCurrent" class="float-right" />
                </template>
            </BaseCard>
        </div>
    </div>
</template>

<script lang="ts" setup>
import * as filters from '~/utils/filters'

const { showMessage } = useNotification()

const loading = ref(false)
const rows = ref<INew[]>([])

const pageSearch = ref('')
const pageCount = ref(1)
const pageCurrent = ref(1)

const updatePageCurrent = (pageId: number) => {
    pageCurrent.value = pageId
    navigateTo({ query: { page: pageId } })
    getRows()
}

const getRows = async () => {
    if (loading.value) return

    loading.value = true
    try {
        const data = await useApiFetch<{ news: INew[]; totalPage: number }>('/api/v1/admin/article?page=' + pageCurrent.value)

        pageCount.value = data.totalPage
        rows.value = data.news
    } catch (e) {
        console.error(e)
    }
    loading.value = false
}

onMounted(() => getRows())

const deleteRow = async (id: number) => {
    if (loading.value) return

    try {
        loading.value = true

        await useApiFetch('/api/v1/admin/article/' + id, { method: 'DELETE' })

        rows.value = rows.value.filter((x) => x.id != id)

        showMessage({
            message: "L'article a été supprimé",
            success: true,
        })
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}

const rowsSearch = computed(() => rows.value.filter((x) => Object.values(x).some((k) => k != null && k.toString().toLowerCase().includes(pageSearch.value.toLowerCase()))))

interface INew {
    id: number
    title: string
    snippet: string
    topstory_image: string
    body: string
    link_keyword: string
    author: string
    timestamp: number
}
</script>
