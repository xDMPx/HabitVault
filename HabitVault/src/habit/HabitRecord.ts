import axios from 'axios'

export interface HabitRecord {
    id: number
    date: string
    habitId: number
    userId: number
}

export interface HabitRecordParams {
    from: Date
    to: Date
}

export async function getHabitRecords(habitid: string | string[], then: (res: HabitRecord[]) => void, error: (err: any) => undefined) {
    axios.get<HabitRecord[] | undefined>(`/user/habits/${habitid}/records`)
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

export async function getRecords(params: HabitRecordParams | undefined = undefined,
    then: (res: HabitRecord[]) => void, error: (err: any) => undefined
) {
    axios.get<HabitRecord[] | undefined>('/user/records', { params: params })
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
