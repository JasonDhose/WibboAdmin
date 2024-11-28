<template>
    <div class="w-screen h-screen overflow-hidden antialiased text-white bg-gray-900">
        <TheTopNofitications />

        <TheNavbar v-if="$route.path != '/'" />
        <div class="w-full h-full overflow-y-overlay" :class="{ 'pl-[200px] mx-2': $route.path != '/' }" id="main">
            <div class="container my-8" :class="{ 'h-full': $route.path == '/' }">
                <NuxtPage keepalive />
            </div>
        </div>
    </div>
</template>
