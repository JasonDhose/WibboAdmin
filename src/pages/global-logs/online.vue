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
                <template #title>Statistiques des connectés</template>

                <template #body>
                    <LineChart :chart-data="datacollection" :options="{ responsive: true, maintainAspectRatio: false }" />
                    <LineChart :chart-data="datacollectionTwo" :options="{ responsive: true, maintainAspectRatio: false }" />
                </template>
            </BaseCard>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Chart, registerables } from 'chart.js'
import { LineChart } from 'vue-chart-3'
import * as filters from '~/utils/filters'

Chart.register(...registerables)

const loading = ref(false)
const now = ref<IStat[]>([])
const lastweek = ref<IStat[]>([])

const getRows = async () => {
    if (loading.value) return

    loading.value = true
    try {
        const data = await useApiFetch<{ now: IStat[]; lastweek: IStat[] }>('/api/v1/admin/stats')

        now.value = data.now
        lastweek.value = data.lastweek
    } catch (e) {
        console.error(e)
    }
    loading.value = false
}

onMounted(() => getRows())

const datacollection = computed(() => chartData(now.value))
const datacollectionTwo = computed(() => chartData(lastweek.value))

const chartData = (stats: IStat[]) => {
    return {
        labels: [...stats.map((x) => filters.formatDateComplet(x.time))],
        datasets: [
            {
                label: 'Appart',
                backgroundColor: '#ff0202',
                pointBackgroundColor: '#5f0000',
                borderColor: '#5f0000',
                lineTension: 0,
                borderWidth: 1,
                data: [...stats.map((x) => x.room)],
            },
            {
                label: 'Connectés',
                backgroundColor: '#0452c6',
                pointBackgroundColor: '#002c6d',
                borderColor: '#002c6d',
                lineTension: 0,
                borderWidth: 1,
                data: [...stats.map((x) => x.online)],
            },
        ],
    }
}

interface IStat {
    id: number
    online: number
    room: number
    time: number
}
</script>
