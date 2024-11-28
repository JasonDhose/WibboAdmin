<template>
    <label class="w-full my-2 form-control" @drop.prevent="dropHandler" @dragover.prevent="inDrag = true" @dragleave="inDrag = false" @dragend.prevent>
        <input type="file" class="w-full file-input file-input-bordered" ref="upload" :accept="accept" @change="onChange()" :multiple="multiple" />
    </label>
</template>

<script lang="ts" setup>
defineProps({
    accept: { type: String, default: '' },
    multiple: { type: Boolean, default: false },
})

const emit = defineEmits(['upload'])

const fileUploads = ref<FileList | null>(null)
const inDrag = ref(false)
const upload = ref<HTMLInputElement | null>(null)

const reset = () => (fileUploads.value = null)

defineExpose({ reset })

const onChange = () => {
    if (!upload.value || !upload.value.files) return

    const files = upload.value.files

    if (!files) return

    fileUploads.value = files

    sendUploadFiles(files)
}

const dropHandler = (ev: DragEvent) => {
    inDrag.value = false

    const files = ev.dataTransfer?.files

    if (!files || !upload.value) return

    fileUploads.value = files
    upload.value.files = files

    sendUploadFiles(files)
}

const sendUploadFiles = async (files: FileList) => {
    emit('upload', files)
}
</script>
