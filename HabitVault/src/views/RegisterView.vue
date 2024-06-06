<template>
    <div class="hero-content grid mx-auto">
        <h1 class="text-5xl font-bold">Create Account</h1>
        <div class="card shrink-0 w-max-w-sm shadow-2xl bg-base-100">
            <form @submit.prevent="handleAccountCreation" class="card-body">
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
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Confirm Password</span>
                    </label>
                    <input type="password" placeholder="password" v-model="formData.password2"
                        class="input input-bordered" required />
                </div>
                <div class="form-control mt-6">
                    <button class="btn btn-primary">Register</button>
                </div>
            </form>
        </div>
    </div>
</template>


<script lang="ts">
import axios from 'axios'

export default {
    data() {
        return {
            formData: {
                username: '',
                password: '',
                password2: ''
            }
        }
    },
    methods: {
        handleAccountCreation() {
            if (!isValidUserName(this.formData.username)) {
                alert("Invalid username")
            } else if (this.formData.password !== this.formData.password2) {
                alert("The password confirmation does not match")
            }
            else {
                axios.post('/register', this.formData)
                    .then((response) => {
                        this.formData = {
                            username: '',
                            password: '',
                            password2: ''
                        }
                        this.$router.push('/login')

                        console.log(response)

                    })
                    .catch((error) => {
                        alert("Account registration failed")
                        this.formData = {
                            username: '',
                            password: '',
                            password2: ''
                        }
                        console.error(error)
                    })
            }
        }
    }
}

export function isValidUserName(username: string): Boolean {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9._-]{3,29}$/
    return usernameRegex.test(username)
}
</script>
