<template>
    <footer class="footer">
        <p>&copy; {{ new Date().getFullYear() }} Cinema. All rights reserved.</p>
    </footer>
</template>
  
<script setup>
</script>
  
<style scoped lang="scss">
.footer {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1rem 1.5rem;
    font-size: 0.85rem;
    color: #fff;
    // background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(6px);
    box-shadow: 0 2px 8px rgba(61, 244, 70, 0.5);


    @media (max-width: 600px) {
        font-size: 0.75rem;
        padding: 0.75rem 1rem;
    }
}
</style>