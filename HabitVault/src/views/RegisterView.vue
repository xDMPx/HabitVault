<template>
    <div class="create-account">
        <h1>Create Account</h1>
        <form @submit.prevent="handleAccountCreation">
            <div>
                <label for="Username">Username:</label><br>
                <input type="text" id="username" placeholder="Username" v-model="formData.username" required>
            </div>
            <div>
                <label for="Password">Password:</label><br>
                <input type="password" id="password" placeholder="Password" v-model="formData.password" required>
            </div>
            <div>
                <button type="submit">Register</button>
            </div>
        </form>
    </div>
</template>


<script lang="ts">
import axios from 'axios';

export default {
    data() {
        return {
            formData: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        handleAccountCreation() {
            axios.post('http://localhost:3000/register', this.formData)
                .then((response) => {
                    this.formData = {
                        username: '',
                        password: ''
                    }
                    console.log(response)
                })
                .catch((error) => {
                    alert("Account registration failed")
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
.create-account {
    width: 100%;
    display: grid;
    justify-content: center;

    h1,
    div {

        padding-bottom: 2mm;
    }
}
</style>
