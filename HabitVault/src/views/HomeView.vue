<script setup lang="ts">
import { ref, type Ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

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

let weekOffset: number = getWeekOffset()
const weekStart = ref(weekStartDate().toDateString())
const weekEnd = ref(weekEndDate().toDateString())
const todayDayIndex = ref(dateToDayOfWeek(todayDayStart()))
watch(() => getWeekOffset(), (newOffset, _oldOffset) => {
    weekOffset = newOffset
    weekStart.value = weekStartDate().toDateString()
    weekEnd.value = weekEndDate().toDateString()
    todayDayIndex.value = dateToDayOfWeek(todayDayStart())
    fetchRecords()
})


function getWeekOffset(): number {
    return +(route.query.week?.toString() ?? '')
}

const records: Ref<HabitRecord[]> = ref([])
fetchRecords()

function fetchRecords() {
    axios.get<HabitRecord[] | undefined>('/user/records', { params: { from: weekStartDate(), to: weekEndDate() } })
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

const habitRecordRow = computed((): HabitRecordRow[] => {
    return habits.value.map((habit) => {
        const habit_records = records.value
            .filter((record) => record.habitId === habit.id)

        const checked = habitRecordsToChecked(habit_records)

        return {
            habitid: habit.id,
            name: habit.name,
            checked: checked
        }
    })
})

function habitRecordsToChecked(habitRecord: HabitRecord[]): Checked[] {
    const records = habitRecord.map((record) => {
        return {
            recordId: record.id,
            dayOfWeek: dateToDayOfWeek(new Date(record.date))
        }
    })

    const checked: Checked[] = tableHeadHeaders.map(() => {
        return {
            recordid: undefined,
            checked: false
        }
    })

    records.forEach((record) => {
        checked[record.dayOfWeek] = {
            recordid: record.recordId,
            checked: true
        }
    })

    return checked
}

const tableHeadHeaders = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
]

function dateToDayOfWeek(date: Date): number {
    // Monday start of the week
    const dayOfWeek = (date.getDay() + 6) % 7
    return dayOfWeek
}

function weekStartDate(): Date {
    const today = todayDayStart()
    // Monday start of the week
    const dayOfWeek = (today.getDay() + 6) % 7
    today.setDate(today.getDate() - (dayOfWeek))
    return today
}

function weekEndDate(): Date {
    const today = todayDayStart()
    // Monday start of the week
    const dayOfWeek = (today.getDay() + 6) % 7
    today.setDate(today.getDate() + (6 - dayOfWeek))
    return today
}

function todayDayStart(): Date {
    const today = new Date()
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)
    if (!isNaN(weekOffset) && weekOffset < 0)
        today.setDate(today.getDate() + (7 * weekOffset))

    return today
}

interface Habit {
    id: number
    name: string
    description: string
    userId: number
}

interface HabitRecordRow {
    habitid: number
    name: string
    checked: Checked[]
}

interface Checked {
    recordid: number | undefined
    checked: boolean
}

interface HabitRecord {
    id: number
    date: string
    habitId: number
    userId: number
}

function handleCheckBoxStateChange(habit_id: number, day_index: number, recordid: number | undefined) {
    const today = todayDayStart()
    // Monday start of the week
    const dayOfWeek = (today.getDay() + 6) % 7
    const recordDate = todayDayStart()
    recordDate.setDate(recordDate.getDate() - (dayOfWeek - day_index))

    if (recordid === undefined) {
        axios.post(`/user/habits/${habit_id}/records`, { date: recordDate })
            .then((_response) => {
                fetchRecords()
            })
            .catch((error) => {
                alert("Error")
                console.error(error)
            })
    } else {
        axios.delete(`/user/habits/${habit_id}/records/${recordid}`)
            .then((_response) => {
                fetchRecords()
            })
            .catch((error) => {
                alert("Error")
                console.error(error)
            })
    }
}

function goToPreviosuWeek() {
    router.push({ name: 'home', query: { week: weekOffset - 1 } })
}

function goToNextWeek() {
    router.push({ name: 'home', query: { week: weekOffset + 1 <= 0 ? weekOffset + 1 : 0 } })
}
</script>

<template>
    <div class="overflow-x-auto">
        <div class="join min-w-full justify-center">
            <button class="flex p-4 join-item text-xl items-center" @click="goToPreviosuWeek">
                <span class="material-symbols-outlined">
                    chevron_left
                </span>
            </button>
            <h2 class="flex py-4 join-item text-xl items-center"> {{ weekStart }} - {{ weekEnd }}
            </h2>
            <button class="flex p-4 join-item text-xl items-center" @click="goToNextWeek">
                <span class="material-symbols-outlined">
                    chevron_right
                </span>
            </button>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th></th>
                    <th v-for="header in tableHeadHeaders">
                        {{ header }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in habitRecordRow">
                    <th>
                        <RouterLink active-class="text-primary" :to="{ path: `/habit/${row.habitid}` }">
                            {{ row.name }}
                        </RouterLink>
                    </th>
                    <td v-for="(checked, day_index) in row.checked">
                        <input type="checkbox" :checked="checked.checked"
                            @click="handleCheckBoxStateChange(row.habitid, day_index, checked.recordid)"
                            class="checkbox" v-if="weekOffset == 0 && day_index <= todayDayIndex" />
                        <input type="checkbox" :checked="checked.checked"
                            @click="handleCheckBoxStateChange(row.habitid, day_index, checked.recordid)"
                            class="checkbox" v-else disabled />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
