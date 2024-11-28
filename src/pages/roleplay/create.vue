<template>
    <div class="grid grid-cols-1 gap-4">
        <div class="col-span-1">
            <BaseCard>
                <template #title>Ajouter un Item RP</template>

                <template #body>
                    <form @submit.prevent="submitPost" enctype="multipart/form-data" class="grid grid-cols-1 gap-3 md:grid-cols-1">
                        <div class="col-span-full">
                            <label class="form-label">Image PNG de 40x40</label>
                            <BaseUploadFile accept="image/png" @upload="handleFileUpload" />
                        </div>

                        <div class="col-span-1">
                            <label class="form-label">Nom du fichier (PNG)</label>
                            <BaseInput v-model.trim="postForm.name" />
                        </div>

                        <div class="col-span-1">
                            <label class="form-label">Description</label>
                            <BaseInput v-model="postForm.desc" />
                        </div>

                        <div class="col-span-1">
                            <label class="form-label">Prix</label>
                            <BaseInput v-model="postForm.price" />
                        </div>

                        <div class="col-span-1">
                            <label class="form-label">Valeur</label>
                            <BaseInput v-model="postForm.value" />
                        </div>

                        <div class="col-span-1">
                            <label class="form-label">Posséder plusieurs</label>
                            <BaseSelect v-model="postForm.allowstack" :options="{ '0': 'Désactiver', '1': 'Activer' }"></BaseSelect>
                        </div>

                        <div class="col-span-1">
                            <label class="form-label">Type</label>
                            <BaseSelect
                                v-model="postForm.type"
                                :options="{
                                    none: 'None',
                                    munition: 'Munition',
                                    health: 'Health',
                                    energy: 'Energy',
                                    weapon_cac: 'Weapon_cac',
                                    weapon_far: 'Weapon_far',
                                    money: 'Money',
                                    healthenergy: 'Healthenergy',
                                    healthtired: 'Healthtired',
                                    openpage: 'Openpage',
                                }"
                            >
                            </BaseSelect>
                        </div>

                        <div class="col-span-1">
                            <label class="form-label">Catégorie</label>
                            <BaseSelect v-model="postForm.category" :options="{ EQUIP: 'Equipement', UTIL: 'Utilitaire', RESSOURCE: 'Ressource', QUETE: 'Quête' }"></BaseSelect>
                        </div>

                        <div class="col-span-full">
                            <BaseButton primary :loading="loading">Crée</BaseButton>
                        </div>
                    </form>
                </template>
            </BaseCard>
        </div>
    </div>
</template>

<script lang="ts" setup>
const { showMessage } = useNotification()

const loading = ref(false)
const postForm = ref({ name: '', desc: '', price: '0', value: '', allowstack: '0', type: 'none', category: 'QUETE' })
const file = ref<File | null>(null)

const handleFileUpload = (fileUploads: FileList) => (file.value = fileUploads[0])

const submitPost = async () => {
    if (loading.value || !file.value) return

    try {
        loading.value = true

        const formData = new FormData()
        formData.append('file', file.value)
        formData.append('name', postForm.value.name)
        formData.append('desc', postForm.value.desc)
        formData.append('price', postForm.value.price)
        formData.append('value', postForm.value.value)
        formData.append('allowstack', postForm.value.allowstack)
        formData.append('type', postForm.value.type)
        formData.append('category', postForm.value.category)

        await await useApiFetch('/api/v1/admin/roleplayitem', { body: formData, method: 'POST', headers: { 'Content-Type': 'multipart/form-data' } })

        showMessage({
            message: 'Votre object a bien été ajouter',
            success: true,
        })

        postForm.value = { name: '', desc: '', price: '', value: '', allowstack: '', type: '', category: '' }
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}
</script>
