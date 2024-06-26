<template>
    <div class="hero-content grid mx-auto">
        <h1 class="text-5xl font-bold">Create Account</h1>
        <div role="alert" class="alert flex alert-error" v-if="showAlert">
            <div class="grow">
                <p v-for="alert in alertText">
                    {{ alert }}
                </p>
            </div>
            <button class="flex">
                <span class="grow material-symbols-outlined" @click="showAlert = false">
                    close
                </span>
            </button>
        </div>
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
            },
            showAlert: false,
            alertText: ['']
        }
    },
    methods: {
        handleAccountCreation() {
            if (!isValidUserName(this.formData.username)) {
                this.showAlert = true
                this.alertText = ["Invalid Username",
                    "Length between 4 to 30 characters.",
                    "Must start with a letter.",
                    "Can only be made up of letters, numbers, periods, underscores, and hyphens."]
            }
            else if (!isValidPassword(this.formData.password)) {
                this.showAlert = true
                this.alertText = ["Invalid Password",
                    "Length between 8 to 20 characters.",
                    "At least one uppercase letter",
                    "At least one lowercase letter",
                    "At least one digit",
                    "At least one special character: @,$,!,%,*,?,&"]
            } else if (this.formData.password !== this.formData.password2) {
                this.showAlert = true
                this.alertText = ["The password confirmation does not match"]
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
                        this.showAlert = true
                        this.alertText = error
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

export function isValidPassword(password: string): Boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return passwordRegex.test(password)
}
</script>
