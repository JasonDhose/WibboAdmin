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
                            <BaseTableBody v-for="(data, index) in rowsSearch" :key="index">
                                <BaseTableColunm>
                                    <div class="w-full px-4 py-2">{{ data.id }}</div>
                                </BaseTableColunm>
                                <BaseTableColunm>{{ data.user_name }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.extra_data }}</BaseTableColunm>
                                <BaseTableColunm>{{ filters.formatDateComplet(data.timestamp) }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.roomid }}</BaseTableColunm>
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

const loading = ref(false)
const rows = ref<ICmdlog[]>([])

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
        const data = await useApiFetch<{ cmdlogs: ICmdlog[]; totalPage: number }>('/api/v1/admin/global-command?page=' + pageCurrent.value)

        pageCount.value = data.totalPage
        rows.value = data.cmdlogs
    } catch (e) {
        console.error(e)
    }
    loading.value = false
}

onMounted(() => getRows())

const rowsSearch = computed(() => rows.value.filter((x) => Object.values(x).some((k) => k != null && k.toString().toLowerCase().includes(pageSearch.value.toLowerCase()))))

interface ICmdlog {
    id: number
    user_name: string
    extra_data: string
    timestamp: number
    roomid: number
}
</script>
