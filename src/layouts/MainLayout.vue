<template>
    <div>
        <AppHeaderVue />
        <main class="main">
            <router-view />
        </main>
        <FloatingBubbles />
    </div>
</template>

<script setup>
import AppHeaderVue from "@/components/Header/AppHeader.vue";
import FloatingBubbles from '@/components/FloatingBubbles.vue';
</script>

<style lang="scss" scoped></style>