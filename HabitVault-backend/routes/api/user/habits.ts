import { Router, Request, Response } from 'express'
import * as core from "express-serve-static-core"
import { PrismaClient } from '@prisma/client'

import { restrict } from '../../../middlewares'

const router = Router()
const prisma = new PrismaClient()


interface HabitBody {
    name: string | undefined,
    description: string | undefined
}

interface TypedRequest<B, P extends core.ParamsDictionary = core.ParamsDictionary> extends Request {
    body: B
    params: P
}

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
    const habitid: number = +req.params.id
    if (userid !== undefined && !isNaN(habitid)) {
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
    const habitid: number = +req.params.id
    const name = req.body.name
    const description = req.body.description
    if (name !== undefined && description !== undefined && !isNaN(habitid)) {
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
    const habitid: number = +req.params.id
    if (!isNaN(habitid)) {
        const habit = await prisma.habit.delete({
            where: { id: habitid },
        })
        res.json(habit)
    } else {
        res.status(400).json()
    }
})

interface HabitRecordBody {
    date: string | undefined,
}


router.get('/:id/records', restrict, async (req: TypedRequest<any, { id: string }>, res: Response) => {
    const userid = req.session.userid
    const habitid: number = +req.params.id
    const habit = await prisma.habit.findFirst({
        where: { id: habitid, userId: userid },
        include: { records: true }
    })
    res.json(habit?.records)
})

//TODO: data validation, check if record already exists 
router.post('/:id/records/', restrict, async (req: TypedRequest<HabitRecordBody, { id: string }>, res: Response) => {
    const userid = req.session.userid
    const habitid: number = +req.params.id
    const date = req.body.date
    if (date !== undefined && userid !== undefined && !isNaN(habitid)) {
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
    const habitid: number = +req.params.id
    const recordid: number = +req.params.recordid
    if (!isNaN(habitid) && !isNaN(recordid)) {
        console.log(`${habitid} | ${recordid}`)
        const habit = await prisma.habitRecord.delete({
            where: { id: recordid, habitId: habitid },
        })
        res.json(habit)
    } else {
        res.status(400).json()
    }
})

module.exports = router;
