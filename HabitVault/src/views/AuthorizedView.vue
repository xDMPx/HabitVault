<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import DrawerSideContent from '../components/DrawerSideContent.vue'
import axios from 'axios'

const emit = defineEmits<{
    updateAuthState: [auth: boolean]
}>()

function signOut() {
    axios.post('/signout').then(() => {
        emit('updateAuthState', false)
    })
}

const habits: Ref<Habit[]> = ref([])
fetchHabits()
function fetchHabits() {
    axios.get<Habit[] | undefined>('/user/habits')
        .then((response) => {
            if (response.data !== undefined) {
                habits.value = response.data
            }
        })
        .catch((error) => {
            alert("Error")
            console.error(error)
        })
}

interface Habit {
    id: number
    name: string
    description: string
    userId: number
}

</script>

<template>

    <div class="drawer h-dvh lg:drawer-open">
        <input id="side-menu-drawer" type="checkbox" class="drawer-toggle" @click="fetchHabits" />

        <div class="drawer-side z-40">
            <label for="side-menu-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
            <div class="p-4 w-80 min-h-full bg-base-200">
                <HelloWorld class="p-2" msg="HabitVault" />
                <div class="flex-row divide-x divide-gray-700">
                    <RouterLink class="p-2" active-class="text-primary" to="/">Home</RouterLink>
                    <RouterLink class="p-1" active-class="text-primary" @click="signOut" to="/login">Sign Out
                    </RouterLink>
                </div>
                <div class="divider" />
                <DrawerSideContent :habits="habits" @updateHabits="fetchHabits" />
            </div>
        </div>

        <div class="drawer-content p-4 flex flex-col">
            <!-- Use icon -->
            <label for="side-menu-drawer" class="btn btn-ghost drawer-button lg:hidden">Open drawer</label>
            <div class="grow">
                <RouterView :habits="habits" name="AuthorizedView" />
            </div>
        </div>

    </div>

</template>
