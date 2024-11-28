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
                <template #title>Historique des bannissements</template>

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
                            <BaseTableBody v-for="(data, index) in rowsSearch" :key="index">
                                <BaseTableColunm
                                    ><div class="w-full px-4 py-2">{{ index + 1 }}</div></BaseTableColunm
                                >
                                <BaseTableColunm>{{ data.value }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.reason }}</BaseTableColunm>
                                <BaseTableColunm>{{ data.added_by }}</BaseTableColunm>
                                <BaseTableColunm>{{ filters.formatDateComplet(data.added_date) }}</BaseTableColunm>
                                <BaseTableColunm>{{ filters.formatDateComplet(data.expire) }}</BaseTableColunm>
                            </BaseTableBody>
                        </template>
                    </BaseTable>
                    <BasePagination :page-id="pageCurrent" :page-count="pageCount" @pageCurrent="updatePageCurrent" class="float-right" />
                </template>
            </BaseCard>
            <BasePagination :page-id="pageCurrent" :page-count="pageCount" @pageCurrent="updatePageCurrent" class="float-right" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import * as filters from '~/utils/filters'

const loading = ref(false)
const rows = ref<IBan[]>([])

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
        const data = await useApiFetch<{ bans: IBan[]; totalPage: number }>('/api/v1/admin/global-ban?page=' + pageCurrent.value)

        pageCount.value = data.totalPage
        rows.value = data.bans
    } catch (e) {
        console.error(e)
    }
    loading.value = false
}

onMounted(() => getRows())

const rowsSearch = computed(() => rows.value.filter((x) => Object.values(x).some((k) => k != null && k.toString().toLowerCase().includes(pageSearch.value.toLowerCase()))))

interface IBan {
    value: string
    reason: string
    added_by: string
    added_date: number
    expire: number
}
</script>
