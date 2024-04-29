<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

import axios from 'axios'
import { ref } from 'vue';

const authorized = ref(false)
axios.get('/authorized').then(() => {
    authorized.value = true
}).catch(() => { })

function signOut() {
    axios.get('/signout').then(() => useRouter().push('login'))
    updateAuthState(false)
}

function updateAuthState(auth: boolean) {
    authorized.value = auth
}
</script>

<template>
    <header>
        <div class="wrapper">
            <HelloWorld class="p-2" msg="HabitVault" />

            <nav class="p-2 px-4">
                <div class="flex-row space-x-4 " v-if="authorized">
                    <RouterLink class="p-2" active-class="text-primary" to="/">Home</RouterLink>
                    <RouterLink class="p-1" active-class="text-primary" @click="signOut" to="/login">Sign Out
                    </RouterLink>
                </div>
                <div class="flex-row divide-x divide-gray-700" v-else>
                    <RouterLink class="px-2 :hover:" active-class="text-primary" to="/login">Log in</RouterLink>
                    <RouterLink class="px-2" active-class="text-primary" to="/register">Register</RouterLink>
                </div>
            </nav>

        </div>
    </header>

    <div class="grow content-center ">
        <RouterView @updateAuthState="updateAuthState" />
    </div>
</template>
