<script setup lang="ts">
import { ref, type Ref } from 'vue'
import axios from 'axios'

const habits: Ref<Habit[]> = ref([])
fetchUserHabits()

function fetchUserHabits() {
    axios.get<Habit[] | undefined>('/user/habits')
        .then((response) => {
            if (response.data !== undefined)
                habits.value = response.data
        })
        .catch((error) => {
            alert("Error")
            console.error(error)
        })
}

interface Habit {
    id: number
    name: string
    description: string
    userId: number
}

const formData = ref({
    name: "",
    description: ""
})

function handleAddHabit() {
    axios.post('/user/habits', formData.value)
        .then((response) => {
            formData.value = {
                name: '',
                description: ''
            }

            console.log(response)
            fetchUserHabits()

        })
        .catch((error) => {
            alert("Adding habit failed")
            formData.value = {
                name: '',
                description: ''
            }
            console.error(error)
        })

    const modal = document.getElementById("add_habit_modal") as HTMLDialogElement | null
    modal?.close()
}
</script>

<template>
    <ul class="menu p-4 min-h-full bg-base-200 text-base-content">
        <RouterLink v-for="habit in habits" class="p-2 join-item" active-class="text-primary"
            :to="{ path: `/habit/${habit.id}` }"> {{
                habit.name
            }} </RouterLink>
        <button class="btn btn-secondary mr-auto" onclick="add_habit_modal.showModal()">Add habit</button>
    </ul>

    <dialog id="add_habit_modal" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Add habit</h3>
            <form @submit.prevent="handleAddHabit">
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Name</span>
                    </label>
                    <input type="name" placeholder="name" class="input input-bordered" v-model="formData.name"
                        required />
                </div>
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Description</span>
                    </label>
                    <textarea placeholder="Description" class="textarea textarea-bordered textarea-lg w-full"
                        v-model="formData.description" required></textarea>
                </div>
                <div class="form-control mt-6">
                    <button class="btn btn-primary">Add habit</button>
                </div>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>

</template>
