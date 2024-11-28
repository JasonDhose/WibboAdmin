<template>
    <div class="grid grid-cols-1 gap-4">
        <div class="col-span-1">
            <BaseCard>
                <template #title>Crée un article</template>

                <template #body>
                    <form @submit.prevent="submitPost" class="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div class="col-span-1">
                            <label class="form-label">Titre</label>
                            <BaseInput v-model="postForm.title" />
                        </div>

                        <div class="col-span-1">
                            <label class="form-label">Description</label>
                            <BaseInput v-model="postForm.desc" />
                        </div>

                        <div class="col-span-1">
                            <label class="form-label">Url image</label>
                            <BaseInput v-model="postForm.url" />
                        </div>

                        <div class="col-span-1">
                            <label class="form-label">Mot clé (séparer par des -)</label>
                            <BaseInput v-model="postForm.keyword" />
                        </div>

                        <div class="col-span-full">
                            <label class="form-label">Article</label>
                            <Editor
                                v-model="postForm.content"
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
                            <label class="form-label">Rédacteur</label>
                            <BaseInput v-model="postForm.author" />
                        </div>

                        <div class="col-span-1">
                            <label class="form-label">Date de publication</label>
                            <BaseInput type="datetime-local" v-model="postForm.time" />
                        </div>

                        <div class="col-span-full">
                            <BaseButton primary :loading="loading">Ajouter</BaseButton>
                        </div>
                    </form>
                </template>
            </BaseCard>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Editor from '@tinymce/tinymce-vue'

const runtimeConfig = useRuntimeConfig()
const { showMessage } = useNotification()

const loading = ref(false)
const postForm = ref({ title: '', desc: '', url: '', content: '', author: '', keyword: '', time: '' })

const submitPost = async () => {
    if (loading.value) return

    try {
        loading.value = true

        await $fetch('/api/article', { body: postForm.value, method: 'POST' })

        showMessage({
            message: "L'article est publié !",
            success: true,
        })

        postForm.value = { title: '', desc: '', url: '', content: '', author: '', keyword: '', time: '' }
    } catch (e) {
        console.error(e)
    }

    loading.value = false
}
</script>
