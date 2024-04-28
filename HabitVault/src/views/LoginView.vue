<script setup lang="ts">
</script>

<template>
    <div class="hero-content grid px-4 my-auto mx-auto">
        <h1 class="text-5xl font-bold">Login</h1>
        <div class="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form @submit.prevent="handleLogin" class="card-body">
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Username</span>
                    </label>
                    <input type="username" placeholder="username" v-model="formData.username"
                        class="input input-bordered" required />
                </div>
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Password</span>
                    </label>
                    <input type="password" placeholder="password" v-model="formData.password"
                        class="input input-bordered" required />
                </div>
                <div class="form-control mt-6">
                    <button class="btn btn-primary">Login</button>
                </div>
            </form>
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
