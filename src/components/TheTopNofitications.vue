<template>
    <div class="absolute bottom-10 right-1/2 translate-x-1/2 z-50 flex flex-col gap-2">
        <TransitionGroup enterActiveClass="duration-300" enterFromClass="opacity-0" enterToClass="opacity-100" leaveActiveClass="duration-300" leaveFromClass="opacity-100" leaveToClass="opacity-0">
            <div role="alert" class="alert cursor-pointer" :class="notif.success ? 'alert-success' : 'alert-error'" v-for="notif in notifications" :key="'message' + notif.id" @click="onClose(notif.id, notif.copy)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24" v-if="notif.success">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24" v-else>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ notif.message }}</span>
                <div class="flex justify-center gap-1">
                    <button @click="onCopyText(notif.copy)" v-if="notif.copy">
                        <svg class="h-5 w-5 shrink-0 stroke-current" fill="none" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0 1919.887h1467.88V452.008H0v1467.88ZM1354.965 564.922v1242.051H112.914V564.922h1242.051ZM1920 0v1467.992h-338.741v-113.027h225.827V112.914H565.035V338.74H452.008V0H1920ZM338.741 1016.93h790.397V904.016H338.74v112.914Zm0 451.062h790.397v-113.027H338.74v113.027Zm0-225.588h564.57v-112.913H338.74v112.913Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                    <button @click="onClose(notif.id)"><IconClose class="w-6 h-6" /></button>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script lang="ts" setup>
const { notifications, showMessage } = useNotification()

const onCopyText = (text: string) => navigator.clipboard.writeText(text)

const onClose = (id: number, copy?: string) => {
    if (copy) onCopyText(copy)

    notifications.value = notifications.value.filter((x) => x.id !== id)
}
</script>
