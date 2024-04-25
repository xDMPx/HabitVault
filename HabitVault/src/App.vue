<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
    <header>
        <div class="wrapper">
            <HelloWorld msg="HabitVault" />

            <nav>
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink>
            </nav>
        </div>
    </header>

    <div class="router">
        <RouterView />
    </div>
</template>

<style scoped>
header {
    line-height: 1.5;
    max-height: 100vh;
}

nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

.router {
    padding-top: 1vh;
    flex-grow: 1;
    display: flex;
    align-items: center;
}
</style>
