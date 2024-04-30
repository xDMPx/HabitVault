<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
</script>

<template>

    <div class="drawer h-dvh lg:drawer-open">
        <input id="side-menu-drawer" type="checkbox" class="drawer-toggle" />

        <div class="drawer-side">
            <label for="side-menu-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
            <div class="p-4 w-80 min-h-full bg-base-200">
                <HelloWorld class="p-2" msg="HabitVault" />
                <div class="flex-row divide-x divide-gray-700">
                    <RouterLink class="p-2" active-class="text-primary" to="/">Home</RouterLink>
                    <RouterLink class="p-1" active-class="text-primary" @click="signOut" to="/login">Sign Out
                    </RouterLink>
                </div>
                <div class="divider" />
            </div>
        </div>

        <div class="drawer-content p-4 flex flex-col">
            <!-- Use icon -->
            <label for="side-menu-drawer" class="btn btn-ghost drawer-button lg:hidden">Open drawer</label>
            <div class="grow">
                <RouterView name="AuthorizedView" />
            </div>
        </div>

    </div>

</template>

<script lang="ts">
import axios from 'axios'
export default {
    emits: {
        updateAuthState(_auth: boolean) {
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
            })
        }
    }
}
</script>
