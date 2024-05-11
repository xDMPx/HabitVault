<script setup lang="ts">
import { watch, ref, type Ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const emit = defineEmits<{
    updateHabits: []
}>()

const habit: Ref<Habit | undefined> = ref()

const route = useRoute()
const router = useRouter()
const habitid = route.params.id
watch(() => route.params.id, (newId, _oldId) => {
    const habitid = newId
    fetchHabit(habitid)
})
fetchHabit(habitid)

function fetchHabit(habitid: string | string[]) {
    axios.get<Habit | undefined>(`/user/habits/${habitid}`)
        .then((response) => {
            if (response.data !== undefined)
                habit.value = response.data
        })
        .catch((error) => {
            alert("Error")
            console.error(error)
        })
    fetchHabitRecords(habitid)
}

const records: Ref<HabitRecord[]> = ref([])
function fetchHabitRecords(habitid: string | string[]) {
    axios.get<HabitRecord[] | undefined>(`/user/habits/${habitid}/records`)
        .then((response) => {
            if (response.data !== undefined) {
                records.value = response.data
            }
        })
        .catch((error) => {
            alert("Error")
            console.error(error)
        })
}

function deleteHabit() {
    axios.delete(`/user/habits/${habitid}`)
        .then((_response) => {
            emit('updateHabits')
            router.replace('/')
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

interface HabitRecord {
    id: number
    date: string
    habitId: number
    userId: number
}
</script>

<template>
    <div>
        <div class="flex">
            <div class="hero">
                <div class="hero-content flex-col mr-auto">
                    <div>
                        <h1 class="text-5xl font-bold"> {{ habit?.name }} </h1>
                        <p class="py-6"> {{ habit?.description }} </p>
                    </div>
                </div>
            </div>
            <div>
                <div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-ghost rounded-btn">
                        <span class="material-symbols-outlined">
                            more_vert
                        </span>
                    </div>
                    <ul tabindex="0" class="dropdown-content z-40 menu p-2 shadow rounded-box">
                        <li>
                            <span class="material-symbols-outlined" @click="deleteHabit">
                                delete_forever
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <h2 class="text-3xl font-bold"> Records: </h2>
    <ul class="p-4">
        <li v-for="record in records"> {{ new Date(record.date).toDateString() }} </li>
    </ul>
</template>
