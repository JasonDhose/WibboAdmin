<template>
    <input type="checkbox" class="toggle" :checked="value" :id="id" />
</template>

<script lang="ts" setup>
defineProps({
    value: { type: Boolean, default: false },
    id: { type: String, required: true },
})
</script>
