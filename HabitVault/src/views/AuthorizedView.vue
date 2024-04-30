<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
</script>

<template>
    <div class="flex flex-col h-dvh p-4 bg-base-300">
        <header>
            <div class="wrapper">
                <HelloWorld class="p-2" msg="HabitVault" />

                <nav class="p-2 px-4">
                    <div class="flex-row divide-x divide-gray-700">
                        <RouterLink class="p-2" active-class="text-primary" to="/">Home</RouterLink>
                        <RouterLink class="p-1" active-class="text-primary" @click="signOut" to="/login">Sign Out
                        </RouterLink>
                    </div>
                </nav>

            </div>
        </header>

        <div class="grow content-center ">
            <RouterView />
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios'
export default {
    emits: {
        updateAuthState(_auth: boolean) {
            console.log(`AuthorizedView: updateAuthState ${_auth}`)
            return true
        }
    },
    data() {
        return {
            formData: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        signOut() {
            axios.post('/signout').then(() => {
                this.$emit('updateAuthState', false)
                this.$router.push('/')
            })
        }
    }
}
</script>
