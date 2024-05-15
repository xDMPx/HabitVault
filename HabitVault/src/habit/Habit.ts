import axios from 'axios'

export interface Habit {
    id: string
    name: string
    description: string
    userId: number
}

export interface HabitPost {
    name: string
    description: string
}

export interface Streak {
    streak: number,
    max_streak: number
}

export async function getHabits(then: (res: Habit[]) => void, error: (err: any) => undefined) {
    axios.get<Habit[] | undefined>('/user/habits')
        .then((response) => {
            if (response.data !== undefined) {
                then(response.data)
            } else {
                then([])
            }
        })
        .catch((err) => {
            console.error(err)
            error(err)
        })
}

export async function getHabit(habitid: string | string[], then: (res: Habit | undefined) => void, error: (err: any) => undefined) {
    axios.get<Habit | undefined>(`/user/habits/${habitid}`)
        .then((response) => {
            if (response.data !== undefined) {
                then(response.data)
            } else {
                then(undefined)
            }
        })
        .catch((err) => {
            console.error(err)
            error(err)
        })
}

export async function postHabit(habit: HabitPost, then: (res: Habit) => void, error: (err: any) => undefined) {
    axios.post<Habit | undefined>('/user/habits', habit)
        .then((response) => {
            console.log(response)
            if (response.data !== undefined) {
                then(response.data)
            } else {
                console.error(undefined)
                error(undefined)
            }

        })
        .catch((err) => {
            console.error(err)
            error(err)
        })
}

export async function putHabit(habit: Habit, then: (res: Habit) => void, error: (err: any) => undefined) {
    axios.put(`/user/habits/${habit.id}`, { name: habit.name, description: habit.description })
        .then((response) => {
            console.log(response)
            if (response.data !== undefined) {
                then(response.data)
            } else {
                console.error(undefined)
                error(undefined)
            }

        })
        .catch((err) => {
            console.error(err)
            error(err)
        })
}

export async function deleteHabit(habitid: string | string[], then: () => void, error: (err: any) => undefined) {
    axios.delete(`/user/habits/${habitid}`)
        .then((_response) => {
            then()
        })
        .catch((err) => {
            console.error(err)
            error(err)
        })
}

export async function getHabitStreak(habitid: string | string[], then: (res: Streak | undefined) => void, error: (err: any) => undefined) {
    axios.get<Streak | undefined>(`/user/habits/${habitid}/streak`)
        .then((response) => {
            if (response.data !== undefined) {
                then(response.data)
            } else {
                then(undefined)
            }
        })
        .catch((err) => {
            console.error(err)
            error(err)
        })
}

