<script setup lang="ts">
defineProps<{
    msg: string
}>()
</script>

<template>
    <div class="greetings">
        <h1 class="text-5xl font-bold text-secondary">{{ msg }}</h1>
    </div>
</template>
