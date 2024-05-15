import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

import { restrict } from '../../../middlewares'
import { TypedRequest, HabitBody, HabitRecordBody } from '../../../interfaces'

const router = Router()
const prisma = new PrismaClient()

router.get('/', restrict, async (req: Request, res: Response) => {
    const userid = req.session.userid
    const user_habits = await prisma.user.findFirst({
        where: { id: userid },
        include: { habits: true }
    })
    res.json(user_habits?.habits)
})

//TODO: data validation, check if habit already exists 
router.post('/', restrict, async (req: TypedRequest<HabitBody>, res: Response) => {
    const userid = req.session.userid
    const name = req.body.name
    const description = req.body.description
    if (name !== undefined && description !== undefined && userid !== undefined) {
        const habit = await prisma.habit.create({
            data: {
                name: name,
                description: description,
                userId: userid
            }
        })
        res.json(habit)
    } else {
        res.status(400).json()
    }
})

//TODO: check if it's user's habit
router.get('/:id', restrict, async (req: TypedRequest<any, { id: string }>, res: Response) => {
    const userid = req.session.userid
    const habitid = req.params.id
    if (userid !== undefined && habitid !== undefined) {
        const habit = await prisma.habit.findFirst({
            where: { id: habitid },
        })
        res.json(habit)
    } else {
        res.status(400).json()
    }
})

//TODO: data validation, check if it's user's habit
router.put('/:id', restrict, async (req: TypedRequest<HabitBody, { id: string }>, res: Response) => {
    const userid = req.session.userid
    const habitid = req.params.id
    const name = req.body.name
    const description = req.body.description
    if (name !== undefined && description !== undefined && habitid !== undefined) {
        const habit = await prisma.habit.update({
            where: { id: habitid },
            data: {
                name: name,
                description: description,
                userId: userid
            }
        })
        res.json(habit)
    }
    else {
        res.status(400).json()
    }
})

//TODO: data validation, check if it's user's habit
router.delete('/:id', restrict, async (req: TypedRequest<HabitBody, { id: string }>, res: Response) => {
    const habitid = req.params.id
    if (habitid !== undefined) {
        const habit = await prisma.habit.delete({
            where: { id: habitid },
        })
        res.json(habit)
    } else {
        res.status(400).json()
    }
})

router.get('/:id/streak', restrict, async (req: TypedRequest<any, { id: string }>, res: Response) => {
    const userid = req.session.userid
    const habitid = req.params.id
    const dates = await prisma.habitRecord.findMany({
        where: { habitId: habitid, userId: userid },
        select: { date: true },
        orderBy: { date: 'desc' }
    })
    const d = dates.map(d => d.date)
    res.json({ streak: calculateStreak(d), max_streak: calculateMaxStreak(d) })
})

function calculateStreak(dates: Date[]): number {
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

function calculateMaxStreak(dates: Date[]): number {
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

router.get('/:id/records', restrict, async (req: TypedRequest<any, { id: string }>, res: Response) => {
    const userid = req.session.userid
    const habitid = req.params.id
    const habit = await prisma.habit.findFirst({
        where: { id: habitid, userId: userid },
        include: { records: true }
    })
    res.json(habit?.records)
})

//TODO: data validation, check if record already exists 
router.post('/:id/records/', restrict, async (req: TypedRequest<HabitRecordBody, { id: string }>, res: Response) => {
    const userid = req.session.userid
    const habitid = req.params.id
    const date = req.body.date
    if (date !== undefined && userid !== undefined && habitid !== undefined) {
        const habit = await prisma.habitRecord.create({
            data: {
                habitId: habitid,
                date: date,
                userId: userid
            }
        })
        res.json(habit)
    } else {
        res.status(400).json()
    }
})

//TODO: data validation 
router.delete('/:id/records/:recordid', restrict, async (req: TypedRequest<any, { id: string, recordid: string }>,
    res: Response) => {
    const userid = req.session.userid
    const habitid = req.params.id
    const recordid = req.params.recordid
    if (habitid !== undefined && recordid !== undefined) {
        const habit = await prisma.habitRecord.delete({
            where: { id: recordid, habitId: habitid },
        })
        res.json(habit)
    } else {
        res.status(400).json()
    }
})

module.exports = router;
