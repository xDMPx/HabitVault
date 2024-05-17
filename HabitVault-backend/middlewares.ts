import { NextFunction, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

declare module 'express-session' {
    interface SessionData {
        username: string | undefined
    }
}

export function log(req: Request, _res: Response, next: NextFunction) {
    console.log(`${req.ip} ${req.method} ${req.url} => ${JSON.stringify(req.body)}`)
    next()
}

export function restrict(req: Request, res: Response, next: NextFunction) {
    if (req.session.username !== undefined) {
        next()
    } else {
        res.status(401).json()
    }
}

export async function adminRestrict(req: Request, res: Response, next: NextFunction) {
    if (req.session.username !== undefined) {
        const admin = await prisma.user.findFirst({
            where: {
                username: req.session.username,
            },
            select: {
                admin: true
            }
        })

        if (admin?.admin) {
            next()
        } else {
            res.status(401).json()
        }

    } else {
        res.status(401).json()
    }
}
