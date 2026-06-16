<template>
    <div>
        <AppHeaderVue />
        <main class="main">
            <router-view />
        </main>
        <FloatingBubbles />
        <FooterComponent />
    </div>
</template>

<script setup>
import AppHeaderVue from "@/components/Header/AppHeader.vue";
import FloatingBubbles from '@/components/FloatingBubbles.vue';
import FooterComponent from "@/components/FooterComponent.vue";
</script>

<style lang="scss" scoped></style>