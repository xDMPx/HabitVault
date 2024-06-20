<script setup lang="ts">
import { ref, type Ref, watch } from 'vue'
import HabitForm from './HabitForm.vue'
import { postHabit, type Habit } from '@/habit/Habit';

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

    requestToAddHabit()
})

const alertText = ref("")
function handleAddHabit(name: string, description: string) {
    postHabit({ name: name, description: description }, (_res) => {
        emit('updateHabits')
    }, (err) => {
        alertText.value = `${err.response.data.error}\n`
        const modal = document.getElementById("error_habit_modal") as HTMLDialogElement | null
        modal?.showModal()
    })
    const modal = document.getElementById("add_habit_modal") as HTMLDialogElement | null
    modal?.close()
}

function requestToAddHabit() {
    if (habits.value.length === 0) {
        const modal = document.getElementById("add_habit_modal") as HTMLDialogElement | null
        modal?.showModal()
    }
}
requestToAddHabit()
</script>

<template>
    <ul class="grow menu p-4 bg-base-200 text-base-content">
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
    <label class="flex cursor-pointer gap-2">
        <span class="material-symbols-outlined">
            dark_mode
        </span>
        <input type="checkbox" value="light" class="toggle theme-controller" />
        <span class="material-symbols-outlined">
            light_mode
        </span>
    </label>

    <dialog id="add_habit_modal" class="modal transition-none">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Add habit</h3>
            <HabitForm @form-submitted="handleAddHabit" />
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>

    <dialog id="error_habit_modal" class="modal transition-none">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Error</h3>
            <div role="alert" class="alert flex alert-error">
                <div class="grow">
                    <p> {{ alertText }} </p>
                </div>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>

</template>
