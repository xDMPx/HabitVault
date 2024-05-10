<script setup lang="ts">
import { ref, type Ref, watch } from 'vue'
import axios from 'axios'

const emit = defineEmits<{
    updateHabits: []
}>()

const props = defineProps<{
    habits?: Habit[]
}>()
const habits: Ref<Habit[]> = ref([])

if (props.habits !== undefined)
    habits.value = props.habits

watch(() => props.habits, (newHabits, _oldHabits) => {
    if (newHabits !== undefined)
        habits.value = newHabits
})

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
            emit('updateHabits')

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
        <div class="flex p-4 justify-center">
            <button class="btn" onclick="add_habit_modal.showModal()">
                <span class="material-symbols-outlined">
                    add
                </span>
            </button>
        </div>
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
