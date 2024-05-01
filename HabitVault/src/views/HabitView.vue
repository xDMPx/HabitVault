<script setup lang="ts">
import { watch, ref, type Ref } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const habit: Ref<Habit | undefined> = ref()

const route = useRoute()
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
}

interface Habit {
    id: number
    name: string
    description: string
    userId: number
}
</script>

<template>
    <div>
        {{ habit?.name }}
        </br>
        {{ habit?.description }}
    </div>
</template>
