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
            updateMonthHabitRecords()
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

function updateMonthHabitRecords() {

    monthRecords.value = records.value.filter((record) => {
        const date = new Date(record.date)
        return date >= monthStartDate() && date <= monthEndDate()
    })

    weeks.value = weeks.value.map((week) => {
        return week.map((day) => {
            if (monthRecords.value.map((record) => new Date(record.date).getDate()).includes(+day.day)) {
                return { day: day.day, checked: true }
            }
            else {
                return { day: day.day, checked: false }
            }
        })
    })

}

const form = computed(() => {
    return {
        name: habit.value?.name ?? '',
        description: habit.value?.description ?? ''
    }
})

const tableHeadHeaders = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
]

let monthOffset = getMonthOffset()
const month = ref(monthStartDate().toLocaleString('default', { month: 'long' }))

function getMonthOffset(): number {
    return +(route.query.month?.toString() ?? '')
}

watch(() => getMonthOffset(), (newOffset, _oldOffset) => {
    monthOffset = newOffset
    month.value = monthStartDate().toLocaleString('default', { month: 'long' })
    generateMonthWeeks()
})

function monthStartDate(): Date {
    const monthStartDate = todayDayStart()
    monthStartDate.setMonth(monthStartDate.getMonth() + monthOffset)
    monthStartDate.setDate(1)

    return monthStartDate
}

function monthEndDate(): Date {
    const monthEndDate = monthStartDate()
    monthEndDate.setMonth(monthEndDate.getMonth() + 1)
    monthEndDate.setDate(0)

    return monthEndDate
}

const weeks: Ref<MonthDay[][]> = ref([])
function generateMonthWeeks() {
    weeks.value = []
    let week = ["", "", "", "", "", "", ""]
    for (let day = monthStartDate(); day <= monthEndDate(); day.setDate(day.getDate() + 1)) {
        // Monday start of the week
        const dayOfWeek = (day.getDay() + 6) % 7
        week[dayOfWeek] = day.getDate().toString()
        if (dayOfWeek == 6) {
            weeks.value.push(week.map((w) => { return { day: w, checked: false } }))
            week = week.map(() => "")
        }
    }
    if (week[0] != "") {
        weeks.value.push(week.map((w) => { return { day: w, checked: false } }))
    }
}
generateMonthWeeks()

const monthRecords: Ref<HabitRecord[]> = ref([])
function todayDayStart(): Date {
    const today = new Date()
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)

    return today
}

interface MonthDay {
    day: string,
    checked: boolean
}

function goToPreviosuMonth() {
    router.push({ path: router.currentRoute.value.path, query: { month: monthOffset - 1 } })
}

function goToNextMonth() {
    router.push({ path: router.currentRoute.value.path, query: { month: monthOffset + 1 <= 0 ? monthOffset + 1 : 0 } })
}

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

    <div class="join min-w-full justify-center">
        <button class="flex p-4 join-item text-xl items-center" @click="goToPreviosuMonth">
            <span class="material-symbols-outlined">
                chevron_left
            </span>
        </button>
        <h2 class="flex py-4 join-item text-xl items-center"
            v-if="monthStartDate().getFullYear() === todayDayStart().getFullYear()"> {{ month }}
        </h2>
        <h2 class="flex py-4 join-item text-xl items-center" v-else>
            {{ month }} {{ monthStartDate().getFullYear() }}
        </h2>
        <button class="flex p-4 join-item text-xl items-center" @click="goToNextMonth">
            <span class="material-symbols-outlined">
                chevron_right
            </span>
        </button>
    </div>

    <div class="flex flex-nowrap p-4">
        <table class="table">
            <thead>
                <tr>
                    <th v-for="header in tableHeadHeaders" class="text-center">
                        {{ header }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="week in weeks">
                    <td v-for="day in week">
                        <div class="flex justify-center">
                            <div class="w-4 text-center" v-if="!day.checked">
                                {{ day.day }}
                            </div>
                            <div class="bg-secondary w-4 text-center" v-else>
                                {{ day.day }}
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="mr-auto">
        <h2 class="text-3xl font-bold"> Records: </h2>
        <ul class="p-4">
            <li v-for="record in records"> {{ new Date(record.date).toDateString() }} </li>
        </ul>
    </div>

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
