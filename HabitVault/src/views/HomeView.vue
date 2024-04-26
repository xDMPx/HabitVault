<script setup lang="ts">
import { ref } from 'vue'

const users = ref("")
import axios from 'axios'

axios.get('http://localhost:3000/users')
    .then((response) => {
        users.value = JSON.stringify(response.data)
        console.log(users.value)
    })
    .catch((error) => {
        alert("Error")
        console.error(error)
    })
</script>

<template>
    <div class="home">
        <h1>Home page</h1>
        <p>{{ users }}</p>
    </div>
</template>

<style>
.home {
    width: 100%;
    display: grid;
    justify-content: center;
    text-align: center;
}
</style>
