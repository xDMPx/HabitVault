import { Router, Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'

import { restrict } from '../../../middlewares'
import { TypedRequest, HabitBody, HabitRecordBody } from '../../../interfaces'
import { isValidHabitName, calculateStreak, calculateMaxStreak, isValidUUIDV4, isStartOfDay } from '../../../utils'

const router = Router()
const prisma = new PrismaClient()

router.get('/', restrict, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userid = req.session.username
        const user_habits = await prisma.user.findFirst({
            where: { username: userid },
            include: { habits: true }
        })
        res.json(user_habits?.habits)
    } catch (err) {
        next(err)
    }
})

router.post('/', restrict, async (req: TypedRequest<HabitBody>, res: Response, next: NextFunction) => {
    try {
        const userid = req.session.username
        const name = req.body.name
        const description = req.body.description

        const habit_count = await prisma.habit.count({
            where: {
                userId: userid,
                name: name
            }
        })

        if (name === undefined) {
            res.status(400).json({
                error: "Habit name not provided"
            })
            return
        }
        else if (description === undefined) {
            res.status(400).json({
                error: "Habit description not provided"
            })
            return
        }
        else if (habit_count !== 0) {
            res.status(400).json({
                error: "Habit name already taken"
            })
            return
        }
        else if (description.length > 140) {
            res.status(400).json({
                error: "Habit description too long"
            })
            return
        }
        else if (!isValidHabitName(name)) {
            res.status(400).json({
                error: "Invalid habit name"
            })
            return
        }

        if (userid !== undefined) {
            const habit = await prisma.habit.create({
                data: {
                    name: name.trim(),
                    description: description.trim(),
                    userId: userid
                }
            })
            res.json(habit)
        } else {
            res.status(400).json()
        }
    } catch (err) {
        next(err)
    }
})

router.get('/:id', restrict, async (req: TypedRequest<any, { id: string }>, res: Response, next: NextFunction) => {
    try {
        const userid = req.session.username
        const habitid = req.params.id

        if (habitid === undefined) {
            res.status(400).json({
                error: "Habit ID not provided"
            })
            return
        }
        else if (!isValidUUIDV4(habitid)) {
            res.status(400).json({
                error: "Invalid habit ID"
            })
            return
        }

        if (userid !== undefined) {
            const habit = await prisma.habit.findFirst({
                where: {
                    id: habitid,
                    userId: userid
                },
            })
            if (habit !== null) {
                res.json(habit)
            } else {
                res.status(400).json({
                    error: "Invalid habit ID"
                })
            }
        } else {
            res.status(400).json()
        }
    } catch (err) {
        next(err)
    }
})

router.put('/:id', restrict, async (req: TypedRequest<HabitBody, { id: string }>, res: Response, next: NextFunction) => {
    try {
        const userid = req.session.username
        const habitid = req.params.id
        const name = req.body.name
        const description = req.body.description

        if (name === undefined) {
            res.status(400).json({
                error: "Habit name not provided"
            })
            return
        }
        else if (description === undefined) {
            res.status(400).json({
                error: "Habit description not provided"
            })
            return
        }
        else if (habitid === undefined) {
            res.status(400).json({
                error: "Habit ID not provided"
            })
            return
        }
        else if (description.length > 140) {
            res.status(400).json({
                error: "Habit description too long"
            })
            return
        }
        else if (!isValidHabitName(name)) {
            res.status(400).json({
                error: "Invalid habit name"
            })
            return
        }
        else if (!isValidUUIDV4(habitid)) {
            res.status(400).json({
                error: "Invalid habit ID"
            })
            return
        }
        if (userid !== undefined) {
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
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', restrict, async (req: TypedRequest<HabitBody, { id: string }>, res: Response, next: NextFunction) => {
    try {
        const habitid = req.params.id
        const userid = req.session.username

        if (habitid === undefined) {
            res.status(400).json({
                error: "Habit ID not provided"
            })
            return
        }
        else if (!isValidUUIDV4(habitid)) {
            res.status(400).json({
                error: "Invalid habit ID"
            })
            return
        }

        if (userid !== undefined) {
            const habit = await prisma.habit.delete({
                where: {
                    id: habitid,
                    userId: userid
                },
            })
            res.json(habit)
        } else {
            res.status(400).json()
        }
    } catch (err) {
        next(err)
    }
})

router.get('/:id/streak', restrict, async (req: TypedRequest<any, { id: string }>, res: Response, next: NextFunction) => {
    try {
        const userid = req.session.username
        const habitid = req.params.id

        if (habitid === undefined) {
            res.status(400).json({
                error: "Habit ID not provided"
            })
            return
        }
        else if (!isValidUUIDV4(habitid)) {
            res.status(400).json({
                error: "Invalid habit ID"
            })
            return
        }

        if (userid !== undefined) {
            const dates = await prisma.habitRecord.findMany({
                where: { habitId: habitid, userId: userid },
                select: { date: true },
                orderBy: { date: 'desc' }
            })
            const d = dates.map(d => d.date)
            res.json({ streak: calculateStreak(d), max_streak: calculateMaxStreak(d) })
        }
        else {
            res.status(400).json()
        }
    } catch (err) {
        next(err)
    }
})

router.get('/:id/records', restrict, async (req: TypedRequest<any, { id: string }>, res: Response, next: NextFunction) => {
    try {
        const userid = req.session.username
        const habitid = req.params.id


        if (habitid === undefined) {
            res.status(400).json({
                error: "Habit ID not provided"
            })
            return
        }
        else if (!isValidUUIDV4(habitid)) {
            res.status(400).json({
                error: "Invalid habit ID"
            })
            return
        }

        if (userid !== undefined) {
            const habit = await prisma.habit.findFirst({
                where: { id: habitid, userId: userid },
                include: { records: true }
            })
            res.json(habit?.records)
        }
        else {
            res.status(400).json()
        }
    } catch (err) {
        next(err)
    }
})

router.post('/:id/records/', restrict, async (req: TypedRequest<HabitRecordBody, { id: string }>, res: Response, next: NextFunction) => {
    try {
        const userid = req.session.username
        const habitid = req.params.id
        const date = req.body.date !== undefined ? new Date(req.body.date) : undefined

        if (habitid === undefined) {
            res.status(400).json({
                error: "Habit ID not provided"
            })
            return
        }
        else if (!isValidUUIDV4(habitid)) {
            res.status(400).json({
                error: "Invalid habit ID"
            })
            return
        }
        else if (date === undefined) {
            res.status(400).json({
                error: "Date not provided"
            })
            return
        }
        else if (isNaN(date.getTime()) || !isStartOfDay(date)) {
            res.status(400).json({
                error: "Invalid date provided"
            })
            return
        }

        const record_count = await prisma.habitRecord.count({
            where: {
                habitId: habitid,
                date: date,
                userId: userid,
            }
        })
        if (record_count > 0) {
            res.status(400).json({
                error: "Record exists"
            })
            return
        }

        if (userid !== undefined) {
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
    } catch (err) {
        next(err)
    }
})

router.delete('/:id/records/:recordid', restrict, async (req: TypedRequest<any, { id: string, recordid: string }>,
    res: Response, next: NextFunction) => {
    try {
        const userid = req.session.username
        const habitid = req.params.id
        const recordid = req.params.recordid


        if (habitid === undefined) {
            res.status(400).json({
                error: "Habit ID not provided"
            })
            return
        }
        else if (!isValidUUIDV4(habitid)) {
            res.status(400).json({
                error: "Invalid habit ID"
            })
            return
        }
        if (habitid === undefined) {
            res.status(400).json({
                error: "Record ID not provided"
            })
            return
        }
        else if (!isValidUUIDV4(habitid)) {
            res.status(400).json({
                error: "Invalid record ID"
            })
            return
        }

        if (userid !== undefined) {
            const habit = await prisma.habitRecord.delete({
                where: { id: recordid, habitId: habitid, userId: userid },
            })
            res.json(habit)
        } else {
            res.status(400).json()
        }
    } catch (err) {
        next(err)
    }
})

module.exports = router;
