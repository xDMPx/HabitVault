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
                        <RouterLink class="px-2 :hover:" active-class="text-primary" to="/login">Log in</RouterLink>
                        <RouterLink class="px-2" active-class="text-primary" to="/register">Register</RouterLink>
                    </div>
                </nav>

            </div>
        </header>

        <div class="grow content-center ">
            <RouterView @updateAuthState="updateAuthState" />
        </div>
    </div>
</template>

<script lang="ts">
export default {
    emits: {
        updateAuthState(_auth: boolean) {
            return true
        }
    },
    methods: {
        updateAuthState() {
            this.$emit('updateAuthState', true)
        }
    }
}
</script>
