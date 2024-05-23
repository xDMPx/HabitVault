//https://stackoverflow.com/a/38191104
export function isValidUUIDV4(uuid: string) {
    const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    return uuidRegex.test(uuid)
}

export function isValidHabitName(username: string): Boolean {
    const usernameRegex = /^[A-Z][a-zA-Z0-9.,|/\_-]{2,19}$/
    return usernameRegex.test(username)
}

export function isValidUserName(username: string): Boolean {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9._-]{3,29}$/
    return usernameRegex.test(username)
}

export function calculateStreak(dates: Date[]): number {
    const dayInMilliseconds = 24 * 60 * 60 * 1000
    let streak = 1
    if (dates.length == 0) {
        streak = 0
    }

    for (let i = 1; i < dates.length; i++) {
        const currentDate = dates[i - 1]
        const previousDate = dates[i]

        if (currentDate.getTime() === previousDate.getTime() + dayInMilliseconds) {
            streak++
        } else {
            break
        }
    }

    return streak
}

export function calculateMaxStreak(dates: Date[]): number {
    const dayInMilliseconds = 24 * 60 * 60 * 1000
    let streak = 1
    if (dates.length == 0) {
        streak = 0
    }

    let maxStreak = 0
    for (let i = 1; i < dates.length; i++) {
        const currentDate = dates[i - 1]
        const previousDate = dates[i]

        if (currentDate.getTime() === previousDate.getTime() + dayInMilliseconds) {
            streak++
            if (streak > maxStreak)
                maxStreak = streak
        } else {
            streak = 1
        }
    }

    if (streak > maxStreak)
        maxStreak = streak

    return maxStreak
}



