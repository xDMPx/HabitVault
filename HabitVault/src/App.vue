<script setup lang="ts">
import UnauthorizedView from './views/UnauthorizedView.vue'
import AuthorizedView from './views/AuthorizedView.vue'

import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminView from './views/AdminView.vue'

const router = useRouter()

const authorized = ref(false)
axios.get('/authorized').then(() => {
    authorized.value = true
}).catch(() => { })

const admin = ref(false)
axios.get('/adminAuthorized').then(() => {
    authorized.value = false
    admin.value = true
    router.push('/admin')
}).catch(() => { admin.value = false })

function updateAuthState(auth: boolean) {
    authorized.value = auth
    admin.value = false
    if (auth !== false) {
        axios.get('/adminAuthorized').then(() => {
            authorized.value = false
            admin.value = true
            router.push('/admin')
        }).catch(() => { admin.value = false })
    }
}
</script>

<template>
    <div class="bg-base-300" v-if="admin">
        <AdminView @updateAuthState="updateAuthState" />
    </div>
    <div class="bg-base-300" v-else-if="!authorized">
        <UnauthorizedView @updateAuthState="updateAuthState" />
    </div>
    <div class="bg-base-300" v-else="!admin">
        <AuthorizedView @updateAuthState="updateAuthState" />
    </div>
</template>
