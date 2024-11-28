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
            <label class="text-xl font-bold">Recherche</label>
            <BaseInput placeholder="Filter les resultats" v-model="pageSearch" :delay="500" />
        </div>
        <div class="col-span-1">
            <BaseCard>
                <template #title>Historique des actions effectuées dans l'administration</template>
                <template #body>
                    <BaseSpinner :loading="loading" v-if="loading" />
                    <BaseTable>
                        <template #head>
                            <BaseTableHead>#</BaseTableHead>
                            <BaseTableHead>Nom</BaseTableHead>
                            <BaseTableHead>Message</BaseTableHead>
                            <BaseTableHead>Date</BaseTableHead>
                        </template>
                        <template #body>
                            <BaseTableBody v-for="(log, index) in rowsSearch" :key="index">
                                <BaseTableColunm>{{ index }}</BaseTableColunm>
                                <BaseTableColunm>{{ log.pseudo }}</BaseTableColunm>
                                <BaseTableColunm>{{ log.action }}</BaseTableColunm>
                                <BaseTableColunm>{{ filters.formatDateComplet(log.date) }}</BaseTableColunm>
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
const rows = ref<IStaff[]>([])

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
        const data = await $fetch<{ logs: IStaff[]; totalPage: number }>('/api/global-history?page=' + pageCurrent.value)

        pageCount.value = data.totalPage
        rows.value = data.logs
    } catch (e) {
        console.error(e)
    }
    loading.value = false
}

onMounted(() => getRows())

const rowsSearch = computed(() => rows.value.filter((x) => Object.values(x).some((k) => k != null && k.toString().toLowerCase().includes(pageSearch.value.toLowerCase()))))

interface IStaff {
    pseudo: string
    action: string
    date: number
}
</script>
