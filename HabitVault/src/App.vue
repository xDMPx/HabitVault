<script setup lang="ts">
import UnauthorizedView from './views/UnauthorizedView.vue'
import AuthorizedView from './views/AuthorizedView.vue'

import axios from 'axios'
import { ref } from 'vue'

const authorized = ref(false)
axios.get('/authorized').then(() => {
    authorized.value = true
}).catch(() => { })

function updateAuthState(auth: boolean) {
    authorized.value = auth
}
</script>

<template>
    <div class="bg-base-300" v-if="!authorized">
        <UnauthorizedView @updateAuthState="updateAuthState" />
    </div>
    <div class="bg-base-300" v-else>
        <AuthorizedView @updateAuthState="updateAuthState" />
    </div>
</template>
