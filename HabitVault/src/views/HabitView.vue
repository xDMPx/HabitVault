<script setup lang="ts">
import { watch, ref, type Ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HabitForm from '@/components/HabitForm.vue'
import { type Habit, type Streak, getHabit, getHabitStreak, putHabit, deleteHabit } from '@/habit/Habit';
import { type HabitRecord, getHabitRecords } from '@/habit/HabitRecord';

const emit = defineEmits<{
    updateHabits: []
}>()

const habit: Ref<Habit | undefined> = ref()

const route = useRoute()
const router = useRouter()
let habitid = route.params.id
watch(() => route.params.id, (newId, _oldId) => {
    habitid = newId
    fetchHabit(habitid)
})
fetchHabit(habitid)

function fetchHabit(habitid: string | string[]) {
    getHabit(habitid,
        (res) => {
            if (res !== undefined)
                habit.value = res
        },
        (err) => {
            alert(err)
        })
    fetchHabitRecords(habitid)
    fetchHabitStreak(habitid)
}

const records: Ref<HabitRecord[]> = ref([])
function fetchHabitRecords(habitid: string | string[]) {
    getHabitRecords(habitid,
        (res) => {
            records.value = res
        },
        (err) => {
            alert(err)
        })
}

const streak: Ref<Streak> = ref({ streak: 0, max_streak: 0 })
function fetchHabitStreak(habitid: string | string[]) {
    getHabitStreak(habitid,
        (res) => {
            if (res !== undefined)
                streak.value = res
        },
        (err) => {
            alert(err)
        })
}

function handleDeleteHabit() {
    deleteHabit(habitid,
        () => {
            emit('updateHabits')
            router.replace('/')
        },
        (err) => {
            alert(err)
        }
    )
}

function handleEditHabit(name: string, description: string) {
    if (habit.value !== undefined) {
        habit.value.name = name
        habit.value.description = description
        putHabit(habit.value,
            (_res) => {
                fetchHabit(habitid)
                emit('updateHabits')
            },
            (err) => {
                alert(err)
            })
    }
    const modal = document.getElementById("edit_habit_modal") as HTMLDialogElement | null
    modal?.close()
}

const form = computed(() => {
    return {
        name: habit.value?.name ?? '',
        description: habit.value?.description ?? ''
    }
})
</script>

<template>
    <div>
        <div class="flex">
            <div class="hero">
                <div class="hero-content flex-col mr-auto items-start">
                    <h1 class="text-5xl font-bold"> {{ habit?.name }} </h1>
                    <p class="py-6 pl-6"> {{ habit?.description }} </p>
                </div>

            </div>
            <div>
                <div class="stats shadow bg-base-300">

                    <div class="stat place-items-center">
                        <div class="stat-title">Streak</div>
                        <div class="stat-value text-secondary">{{ streak.streak }}</div>
                    </div>

                    <div class="stat place-items-center">
                        <div class="stat-title">Max Streak</div>
                        <div class="stat-value">{{ streak.max_streak }}</div>
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
                            <span class="material-symbols-outlined" onclick="edit_habit_modal.showModal()">
                                edit_note
                            </span>
                        </li>
                        <li>
                            <span class="material-symbols-outlined" onclick="delete_habit_modal.showModal()">
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

    <dialog id="edit_habit_modal" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Edit habit</h3>
            <HabitForm @form-submitted="handleEditHabit" :habit="form" />
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>

    <dialog id="delete_habit_modal" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg text-center">
                Are you sure you want to delete this habit? <br>
                This action cannot be undone.
            </h3>
            <form @submit.prevent="handleDeleteHabit">
                <div class="flex justify-center p-4 gap-4">
                    <div class="form-control">
                        <button class="btn btn-primary">Yes</button>
                    </div>
                    <form method="dialog">
                        <button class="btn btn-neutral">No</button>
                    </form>
                </div>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>

</template>
