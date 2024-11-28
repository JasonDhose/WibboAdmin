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
                <template #title>Liste des items RP</template>

                <template #body>
                    <BaseSpinner :loading="loading" v-if="loading" />
                    <BaseTable>
                        <template #head>
                            <BaseTableHead>Id</BaseTableHead>
                            <BaseTableHead>Nom</BaseTableHead>
                            <BaseTableHead>Description</BaseTableHead>
                            <BaseTableHead>Prix</BaseTableHead>
                            <BaseTableHead>Type</BaseTableHead>
                            <BaseTableHead>Valeur</BaseTableHead>
                            <BaseTableHead>Allowstack</BaseTableHead>
                            <BaseTableHead>Catégorie</BaseTableHead>
                            <BaseTableHead>Edité</BaseTableHead>
                        </template>
                        <template #body>
                            <BaseTableBody v-for="data in rowsSearch" :key="data.id">
                                <BaseTableColunm>{{ data.id }}</BaseTableColunm>
                                <BaseTableColunm><img :src="runtimeConfig.public.urlCdn + `items/${data.name}.png`" /></BaseTableColunm>
                                <BaseTableColunm><BaseInput v-model="data.desc" text-to-edit /></BaseTableColunm>
                                <BaseTableColunm><BaseInput v-model="data.price" text-to-edit /></BaseTableColunm>
                                <BaseTableColunm>
                                    <BaseSelect
                                        v-model="data.type"
                                        :options="{
                                            none: 'Rien',
                                            munition: 'Munition',
                                            health: 'Vie',
                                            energy: 'Energie',
                                            energytired: 'Energie retirer',
                                            weapon_cac: 'Arme cac',
                                            weapon_far: 'Arme distante',
                                            money: 'Monnaie',
                                            healthenergy: 'Vie et énergie',
                                            healthtired: 'Vie retirer',
                                            openpage: 'Openpage',
                                        }"
                                    >
                                    </BaseSelect>
                                </BaseTableColunm>
                                <BaseTableColunm><BaseInput v-model="data.value" text-to-edit /></BaseTableColunm>
                                <BaseTableColunm>
                                    <BaseInput v-model="data.allowstack" boolean text-to-edit></BaseInput>
                                </BaseTableColunm>
                                <BaseTableColunm>
                                    <BaseSelect v-model="data.category" :options="{ EQUIP: 'Equipement', UTIL: 'Utilitaire', RESSOURCE: 'Ressource', QUETE: 'Quête' }"></BaseSelect>
                                </BaseTableColunm>
                                <BaseTableColunm><BaseButton primary :loading="loading" little @click.native="updateItem(data)">Editer</BaseButton></BaseTableColunm>
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
const { showMessage } = useNotification()
const runtimeConfig = useRuntimeConfig()

const rows = ref<IRpItem[]>([])
const loading = ref(false)

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
        const data = await $fetch<{ items: IRpItem[]; totalPage: number }>('/api/roleplayitem?page=' + pageCurrent.value)

        pageCount.value = data.totalPage
        rows.value = data.items
    } catch (e) {
        console.error(e)
    }
    loading.value = false
}

onMounted(() => getRows())

const rowsSearch = computed(() => rows.value.filter((x) => Object.values(x).some((k) => k != null && k.toString().toLowerCase().includes(pageSearch.value.toLowerCase()))))

const updateItem = async (data: IRpItem) => {
    if (loading.value) return

    try {
        loading.value = true

        await $fetch('/api/roleplayitem/' + data.id, { body: data, method: 'PUT' })

        showMessage({
            message: 'Mise à jour réussi',
            success: true,
        })
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}

interface IRpItem {
    id: number
    name: string
    desc: string
    price: number
    type: string
    value: string
    allowstack: boolean
    category: string
}
</script>
