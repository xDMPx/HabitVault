import { NextFunction, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import * as jwt from "jsonwebtoken"
import { redis } from './app'

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
        res.locals.username = req.session.username
        next()
    } else {
        res.status(401).json()
    }
}

export async function restrictJWT(req: Request, res: Response, next: NextFunction) {
    try {

        let token = req.cookies.authToken as string || undefined

        if (token === undefined) {
            const authHeader = req.headers['authorization']
            if (authHeader === undefined || !authHeader.startsWith('Bearer ')) {
                res.status(401).json()
                return
            } else {
                token = authHeader.split(' ')[1]
            }
        }

        const decoded = jwt.verify(token, "testKey")
        if (typeof (decoded) !== 'object') {
            res.status(401).json()
            return
        }

        const username = decoded.username
        const lastID = +(await redis.get(`${username}:lastID`) ?? 'NaN')
        let validToken = true
        if (!isNaN(lastID)) {
            for (let i = 0; i <= lastID; i++) {
                const blacklistedToken = await redis.get(`${username}:${i}`)
                if (blacklistedToken === token) {
                    validToken = false
                    break
                }
            }
        }

        if (validToken) {
            res.locals.username = username
            next()
        } else {
            res.status(401).json()
        }
    } catch (err) {
        next(err)
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
        }).catch((err) => next(err))

        if (admin?.admin) {
            res.locals.username = req.session.username
            next()
        } else {
            res.status(401).json()
        }

    } else {
        res.status(401).json()
    }
}
