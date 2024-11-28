<template>
    <nav class="absolute top-0 bottom-0 left-0 z-10 flex flex-col h-full gap-1 p-2 bg-base-100 shadow shadow-gray-600 w-[200px] overflow-y-auto" v-show="isOpen" :key="isOpen ? 'yes' : 'no'">
        <div class="flex justify-between mb-2">
            <span class="font-bold">Admin</span>

            <div class="flex items-center gap-1">
                <div class="cursor-pointer" @click="logout()">
                    <IconLogout class="w-4 h-4" />
                </div>
            </div>
        </div>
        <div v-for="nav in userNav" :key="nav.name">
            <div class="flex items-center justify-between mb-2 border-b-2 cursor-pointer" @click="nav.open = !nav.open">
                <span>{{ nav.name }}</span> <IconSortDown class="w-4 h-4 transition-transform duration-300" :class="{ '-rotate-180': nav.open }" />
            </div>
            <transition
                enter-active-class="duration-300 select-none"
                enter-from-class="-translate-y-5 opacity-0"
                enter-to-class="translate-y-0 opacity-100"
                leave-active-class="duration-300 select-none"
                leave-from-class="translate-y-0 opacity-100"
                leave-to-class="-translate-y-5 opacity-0"
                mode="out-in"
            >
                <ul class="flex flex-col gap-1 overflow-hidden" v-show="nav.open">
                    <li
                        :class="{ 'bg-gray-600': subNav.link === $route.path }"
                        class="w-full px-4 transition-colors rounded cursor-pointer hover:bg-gray-600"
                        @click="navigateTo(subNav.link)"
                        v-for="(subNav, index) of userNavLink(nav.links)"
                        :key="index"
                    >
                        {{ subNav.text }}
                    </li>
                </ul>
            </transition>
        </div>
    </nav>
</template>

<script lang="ts" setup>
const { authUser, logout } = useAuth()

const isOpen = ref(true)

const defaultNavClose = true

const navList = ref<INav[]>([
    {
        name: 'Article',
        links: [
            {
                link: '/article/create',
                text: 'Crée un article',
                minRank: 7,
            },
            {
                link: '/article/list',
                text: 'Articles',
                minRank: 8,
            },
        ],
        open: defaultNavClose,
    },
    {
        name: 'Modération',
        links: [
            {
                link: '/moderate/last-users',
                text: 'Derniers inscrits',
            },
            {
                link: '/moderate/ban',
                text: 'Bannissement',
            },
            {
                link: '/moderate/deban',
                text: 'Débannissement',
                minRank: 8,
            },
            {
                link: '/moderate/flagme',
                text: 'Délivrer un pseudonyme',
                minRank: 11,
            },
        ],
        open: defaultNavClose,
    },
    {
        name: 'Importation',
        links: [
            {
                link: '/upload/badge',
                text: 'Badge',
                minRank: 8,
            },
            {
                link: '/upload/image',
                text: 'Image',
                minRank: 7,
            },
            {
                link: '/upload/mp3',
                text: 'MP3',
                minRank: 8,
            },
            {
                link: '/upload/page',
                text: 'Page HTML',
                minRank: 8,
            },
        ],
        open: defaultNavClose,
    },
    {
        name: 'Badge',
        links: [
            {
                link: '/badge/give',
                text: 'Envoyer',
                minRank: 8,
            },
            {
                link: '/badge/delete',
                text: 'Supprimer',
                minRank: 8,
            },
            {
                link: '/badge/check',
                text: 'Quota par joueur',
            },
        ],
        open: defaultNavClose,
    },
    {
        name: 'Staff',
        links: [
            {
                link: '/staff/ip',
                text: 'IP Staff',
                minRank: 11,
            },
            {
                link: '/staff/list',
                text: 'Staffs',
                minRank: 8,
            },
            {
                link: '/staff/rank',
                text: 'Grader',
                minRank: 8,
            },
            {
                link: '/staff/derank',
                text: 'Rétrograder',
                minRank: 8,
            },
        ],
        open: defaultNavClose,
    },
    {
        name: 'Navigateur',
        links: [
            {
                link: '/navigator/create',
                text: 'Ajouter',
                minRank: 8,
            },
            {
                link: '/navigator/list',
                text: 'Liste',
                minRank: 8,
            },
        ],
        open: defaultNavClose,
    },
    {
        name: 'Roleplay',
        links: [
            {
                link: '/roleplay/create',
                text: 'Ajouter',
                minRank: 8,
            },
            {
                link: '/roleplay/list',
                text: 'Liste',
                minRank: 8,
            },
        ],
        open: defaultNavClose,
    },
    {
        name: 'Historique joueur',
        links: [
            {
                link: '/user-log/command',
                text: 'Commandes',
                minRank: 8,
            },
            {
                link: '/user-log/shop',
                text: 'Achat',
                minRank: 11,
            },
            {
                link: '/user-log/ban',
                text: 'Bannissements',
                minRank: 6,
            },
            {
                link: '/user-log/account',
                text: 'Multicompte',
            },
            {
                link: '/user-log/flagme',
                text: 'Pseudo',
            },
            {
                link: '/user-log/chatlog',
                text: 'Tchatlog',
            },
        ],
        open: defaultNavClose,
    },
    {
        name: 'Historique global',
        links: [
            {
                link: '/global-logs/command',
                text: 'Commandes',
                minRank: 8,
            },
            {
                link: '/global-logs/shop',
                text: 'Achat',
                minRank: 11,
            },
            {
                link: '/global-logs/ban',
                text: 'Bannissements',
            },
            {
                link: '/global-logs/online',
                text: 'Statistique',
                minRank: 8,
            },
            {
                link: '/global-logs/staff',
                text: 'Administration',
                minRank: 8,
            },
        ],
        open: defaultNavClose,
    },
])

const userNav = computed(() => navList.value.filter((x) => x.links.filter((x) => !x.minRank || x.minRank <= userRank.value).length))

const userNavLink = (links: INavLink[]) => links.filter((x) => !x.minRank || x.minRank <= userRank.value)

const userRank = computed(() => authUser.value?.rank || 1)

interface INav {
    name: string
    links: INavLink[]
    open: boolean
}

interface INavLink {
    link: string
    text: string
    minRank?: number
}
</script>
