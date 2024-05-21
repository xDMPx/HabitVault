<script setup lang="ts">
import UnauthorizedView from './views/UnauthorizedView.vue'
import AuthorizedView from './views/AuthorizedView.vue'

import axios from 'axios'
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminView from './views/AdminView.vue'
import { UserType } from './router'

const router = useRouter()

const userType: Ref<UserType> = ref(UserType.Unknown)

axios.get('/authorized').then(() => {
    userType.value = UserType.Normal
}).catch(() => { })

axios.get('/adminAuthorized').then(() => {
    userType.value = UserType.Admin
    router.push('/admin')
})

function updateAuthState(auth: boolean) {
    if (auth) {
        axios.get('/adminAuthorized').then(() => {
            userType.value = UserType.Admin
            router.push('/admin')
        }).catch(() => { userType.value = UserType.Normal })
    }
    else if (auth === false) {
        userType.value = UserType.Unknown
    }
}

</script>

<template>
    <div class="bg-base-300" v-if="userType === UserType.Admin">
        <AdminView @updateAuthState="updateAuthState" />
    </div>
    <div class="bg-base-300" v-else-if="userType === UserType.Unknown">
        <UnauthorizedView @updateAuthState="updateAuthState" />
    </div>
    <div class="bg-base-300" v-else>
        <AuthorizedView @updateAuthState="updateAuthState" />
    </div>
</template>
