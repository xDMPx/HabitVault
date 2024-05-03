import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

import { restrict } from '../../middlewares'

const router = Router()
const prisma = new PrismaClient()

router.get('/records', restrict, async (req: Request, res: Response) => {
    const userid = req.session.userid
    const user = await prisma.user.findFirst({
        where: { id: userid },
        include: { records: true }
    })
    res.json(user?.records)
})

module.exports = router
