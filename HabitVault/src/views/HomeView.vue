<script setup lang="ts">
import { ref, type Ref, computed } from 'vue'
import axios from 'axios'

const habits: Ref<Habit[]> = ref([])
axios.get<Habit[] | undefined>('/user/habits')
    .then((response) => {
        if (response.data !== undefined) {
            habits.value = response.data
        }
    })
    .catch((error) => {
        alert("Error")
        console.error(error)
    })

const records: Ref<HabitRecord[]> = ref([])
fetchRecords()

function fetchRecords() {
    axios.get<HabitRecord[] | undefined>('/user/records')
        .then((response) => {
            if (response.data !== undefined) {
                records.value = response.data.filter((record) => {
                    const date = new Date(record.date)
                    return date >= weekStartDate() && date <= weekEndDate()
                })
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
</script>

<template>
    <div class="overflow-x-auto">
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
                            class="checkbox" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
