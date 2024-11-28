<template>
    <div class="grid grid-cols-1 gap-4">
        <div class="col-span-1">
            <BaseCard>
                <template #title>Modifier un article</template>

                <template #body v-if="editNew">
                    <div class="col-span-1">
                        <form @submit.prevent="submitPost" class="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div class="col-span-1">
                                <label class="form-label">Titre</label>
                                <BaseInput v-model="editNew.title" />
                            </div>

                            <div class="col-span-1">
                                <label class="form-label">Description</label>
                                <BaseInput v-model="editNew.snippet" />
                            </div>

                            <div class="col-span-1">
                                <label class="form-label">Url image</label>
                                <BaseInput v-model="editNew.topstory_image" />
                            </div>

                            <div class="col-span-1">
                                <label class="form-label">Mot clé (séparer par des -)</label>
                                <BaseInput v-model="editNew.link_keyword" />
                            </div>

                            <div class="col-span-full">
                                <label class="form-label">Article</label>
                                <Editor
                                    v-model="editNew.body"
                                    :api-key="runtimeConfig.public.tinymceApi"
                                    :init="{
                                        height: 500,
                                        menubar: true,
                                        plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount'],
                                        toolbar:
                                            'undo redo | blocks | ' +
                                            'bold italic underline forecolor | link unlink image | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'preview fullpage | removeformat | help',
                                        skin: 'oxide-dark',
                                        content_css: 'dark',
                                        language: 'fr_FR',
                                    }"
                                />
                            </div>

                            <div class="col-span-1">
                                <label class="form-label">Auteur</label>
                                <BaseInput v-model="editNew.author" />
                            </div>

                            <div class="col-span-1">
                                <label class="form-label">Date de mise en ligne</label>
                                <BaseInput type="datetime-local" v-model="editNew.timestamp" />
                            </div>

                            <div class="col-span-full">
                                <BaseButton primary>Sauvegarder</BaseButton>
                            </div>
                        </form>
                    </div>
                </template>
            </BaseCard>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Editor from '@tinymce/tinymce-vue'

const runtimeConfig = useRuntimeConfig()
const { showMessage } = useNotification()
const route = useRoute()

const loading = ref(false)
const editNew = ref<INew | null>(null)

try {
    const data = await $fetch<{ new: INew }>('/api/article/' + route.params.id)

    editNew.value = data.new
} catch (e) {
    console.error(e)
}

const submitPost = async () => {
    if (loading.value || !editNew.value) return

    try {
        loading.value = true

        await $fetch('/api/article', { body: editNew.value, method: 'PUT' })

        showMessage({
            message: "L'article a bien été mise à jour",
            success: true,
        })
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}

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
