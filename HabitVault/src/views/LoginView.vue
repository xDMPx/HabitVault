<script setup lang="ts">
</script>

<template>
    <div class="login">
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <div>
                <label for="Username">Username:</label><br>
                <input type="text" id="username" placeholder="Username" v-model="formData.username" required>
            </div>
            <div>
                <label for="Password">Password:</label><br>
                <input type="password" id="password" placeholder="Password" v-model="formData.password" required>
            </div>
            <div>
                <button type="submit">Login</button>
            </div>
        </form>
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
        handleLogin() {

            console.log(this.formData)
            axios.post('http://localhost:3000/login', this.formData)
                .then((response) => {
                    this.formData = {
                        username: '',
                        password: ''
                    }
                    console.log(response)
                    console.log(response.headers)
                    this.$emit('updateAuthState', true)
                    this.$router.push('/')
                })
                .catch((error) => {
                    alert("Login failed")
                    this.formData = {
                        username: '',
                        password: ''
                    }
                    console.error(error)
                })
        }
    }
}
</script>

<style>
.login {
    width: 100%;
    display: grid;
    justify-content: center;

    h1,
    div {

        padding-bottom: 2mm;
    }
}
</style>
