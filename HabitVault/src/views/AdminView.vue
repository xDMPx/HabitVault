<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue';
import axios from 'axios'
import { ref, type Ref } from 'vue'

const users: Ref<User[]> = ref([])
axios.get<User[] | undefined>('/users').then((response) => {
    if (response.data !== undefined)
        users.value = response.data
})

const emit = defineEmits<{
    updateAuthState: [auth: boolean]
}>()

function signOut() {
    axios.post('/signout').then(() => {
        emit('updateAuthState', false)
    })
}

interface User {
    username: string,
    password: string,
    admin: boolean,
}

</script>

<template>

    <div class="drawer h-dvh lg:drawer-open">
        <input id="side-menu-drawer" type="checkbox" class="drawer-toggle" />

        <div class="drawer-side z-40">
            <label for="side-menu-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
            <div class="flex flex-col p-4 w-80 min-h-full bg-base-200">
                <HelloWorld class="p-2" msg="HabitVault" />
                <div class="divider" />
                <div class="flex-row divide-x divide-gray-700">
                    <RouterLink class="p-1" active-class="text-primary" @click="signOut" to="/login">Sign Out
                    </RouterLink>
                </div>
                <div class="grow">
                </div>
                <label class="flex cursor-pointer gap-2">
                    <span class="material-symbols-outlined">
                        dark_mode
                    </span>
                    <input type="checkbox" value="light" class="toggle theme-controller" />
                    <span class="material-symbols-outlined">
                        light_mode
                    </span>
                </label>
            </div>
        </div>

        <div class="drawer-content p-4 flex flex-col">
            <label for="side-menu-drawer" class="btn btn-ghost drawer-button lg:hidden justify-start">
                <span class="material-symbols-outlined">
                    menu
                </span>
            </label>
            <div class="grow">
                <div class="overflow-x-auto">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Admin</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in users">
                                <td> {{ user.username }} </td>
                                <td>
                                    <input type="checkbox" :checked="user.admin" class="checkbox" disabled />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>

</template>
