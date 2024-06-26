<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue';
import axios, { AxiosError } from 'axios'
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router';

const alertText = ref("")
const showAlert = ref(false)

const router = useRouter()
const users: Ref<User[]> = ref([])
fetchUsers()

const emit = defineEmits<{
    updateAuthState: [auth: boolean]
}>()

function signOut() {
    axios.post('/signout').then(() => {
        emit('updateAuthState', false)
    })
}

const userToDelete = ref("")
function handleDeleteUser(username: string) {
    userToDelete.value = username
    const deleteUserModal = document.getElementById("delete_user_modal") as HTMLDialogElement | null
    deleteUserModal?.show()
}

function deleteUser(username: string) {
    axios.delete(`admin/user/${username}`)
        .then(() => { fetchUsers() })
        .catch((err: AxiosError) => {
            const data = err.response?.data as { error: string }

            alertText.value = `${err.message}\n${data.error}`
            showAlert.value = true
        })
    const deleteUserModal = document.getElementById("delete_user_modal") as HTMLDialogElement | null
    deleteUserModal?.close()
}

const userToBan = ref("")
function handleBanUser(username: string) {
    userToBan.value = username
    const banUserModal = document.getElementById("ban_user_modal") as HTMLDialogElement | null
    banUserModal?.show()
}

function banUser(username: string) {
    axios.post(`admin/user/${username}/ban`)
        .then(() => { fetchUsers() })
        .catch((err: AxiosError) => {
            const data = err.response?.data as { error: string }

            alertText.value = `${err.message}\n${data.error}`
            showAlert.value = true
        })
    const banUserModal = document.getElementById("ban_user_modal") as HTMLDialogElement | null
    banUserModal?.close()
}

function handleUnBanUser(username: string) {
    userToBan.value = username
    const unbanUserModal = document.getElementById("unban_user_modal") as HTMLDialogElement | null
    unbanUserModal?.show()
}

function unbanUser(username: string) {
    axios.post(`admin/user/${username}/unban`)
        .then(() => { fetchUsers() })
        .catch((err: AxiosError) => {
            const data = err.response?.data as { error: string }

            alertText.value = `${err.message}\n${data.error}`
            showAlert.value = true
        })
    const unbanUserModal = document.getElementById("unban_user_modal") as HTMLDialogElement | null
    unbanUserModal?.close()
}

function fetchUsers() {
    axios.get<User[] | undefined>('admin/users').then((response) => {
        if (response.data !== undefined)
            users.value = response.data
    })
}

function patchUser(username: string, admin: boolean) {
    axios.patch(`admin/user/${username}/admin`, { admin: admin })
        .then(() => { fetchUsers() })
        .catch((err: AxiosError) => {
            const data = err.response?.data as { error: string }

            alertText.value = `${err.message}\n${data.error}`
            showAlert.value = true
        })
}

interface User {
    username: string,
    password: string,
    admin: boolean,
    banned: boolean
}

</script>

<template>

    <div class="drawer min-h-dvh lg:drawer-open">
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
            <div role="alert" class="alert alert-error" v-if="showAlert">
                <span>{{ alertText }}</span>
                <button class="flex ml-auto">
                    <span class="grow material-symbols-outlined" @click="showAlert = false">
                        close
                    </span>
                </button>
            </div>

            <div class="grow">
                <div class="overflow-x-auto">
                    <table class="table">
                        <thead>
                            <tr class="text-center">
                                <th>Username</th>
                                <th>Admin</th>
                                <th>Banned</th>
                                <th>Ban</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in users">
                                <td> {{ user.username }} </td>
                                <td class="text-center">
                                    <input type="checkbox" :checked="user.admin" class="checkbox"
                                        @click="patchUser(user.username, !user.admin)" />
                                </td>
                                <td class="text-center" v-if="user.banned">
                                    <input type="checkbox" :checked="user.banned" class="checkbox"
                                        @click="handleUnBanUser(user.username)" />
                                </td>
                                <td class="text-center" v-else>
                                    <input type="checkbox" :checked="user.banned" class="checkbox" disabled />
                                </td>
                                <td class="text-center" v-if="user.banned">
                                    <button class="btn btn-ghost" disabled>
                                        <span class="material-symbols-outlined">
                                            gavel
                                        </span>
                                    </button>
                                </td>
                                <td class="text-center" v-else>
                                    <button class="btn btn-ghost" @click="handleBanUser(user.username)">
                                        <span class="material-symbols-outlined">
                                            gavel
                                        </span>
                                    </button>
                                </td>
                                <td class="text-center">
                                    <button class="btn btn-ghost" @click="handleDeleteUser(user.username)">
                                        <span class="material-symbols-outlined">
                                            delete_forever
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>

    <dialog id="delete_user_modal" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg text-center">
                Are you sure you want to delete this user? <br>
                This action cannot be undone.
            </h3>
            <form @submit.prevent="deleteUser(userToDelete)">
                <div class="flex justify-center p-4 gap-4">
                    <div class="form-control">
                        <button class="btn btn-primary">Yes</button>
                    </div>
                    <form method="dialog">
                        <button class="btn btn-neutral">No</button>
                    </form>
                </div>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>

    <dialog id="ban_user_modal" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg text-center">
                Are you sure you want to ban this user?
            </h3>
            <form @submit.prevent="banUser(userToBan)">
                <div class="flex justify-center p-4 gap-4">
                    <div class="form-control">
                        <button class="btn btn-primary">Yes</button>
                    </div>
                    <form method="dialog">
                        <button class="btn btn-neutral">No</button>
                    </form>
                </div>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>

    <dialog id="unban_user_modal" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg text-center">
                Are you sure you want to unban this user?
            </h3>
            <form @submit.prevent="unbanUser(userToBan)">
                <div class="flex justify-center p-4 gap-4">
                    <div class="form-control">
                        <button class="btn btn-primary">Yes</button>
                    </div>
                    <form method="dialog">
                        <button class="btn btn-neutral">No</button>
                    </form>
                </div>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>

</template>
