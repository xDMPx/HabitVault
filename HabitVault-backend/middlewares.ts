import { NextFunction, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import * as jwt from "jsonwebtoken"
import { jwtSecret, redis } from './app'

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
        const token = getJWT(req)
        if (token === null) {
            restrict(req, res, next)
            return
        }

        const username = decodeJWT(token)
        if (username === null) {
            res.status(401).json()
            return
        }

        const validToken = await isValidToken(token, username)

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

export async function adminRestrictJWT(req: Request, res: Response, next: NextFunction) {
    try {
        const token = getJWT(req)
        if (token === null) {
            adminRestrict(req, res, next)
            return
        }

        const username = decodeJWT(token)
        if (username === null) {
            res.status(401).json()
            return
        }

        const validToken = await isValidToken(token, username)

        if (validToken) {
            const admin = await prisma.user.findFirst({
                where: {
                    username: username,
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
    } catch (err) {
        next(err)
    }
}

function getJWT(req: Request): string | null {
    let token = req.cookies.authToken as string || undefined

    if (token === undefined) {
        const authHeader = req.headers['authorization']
        if (authHeader === undefined || !authHeader.startsWith('Bearer ')) {
            return null
        } else {
            token = authHeader.split(' ')[1]
        }
    }
    return token
}

function decodeJWT(token: string): string | null {
    const decoded = jwt.verify(token, jwtSecret)
    if (typeof (decoded) !== 'object') {
        return null
    }

    const username = decoded.username
    return username
}

async function isValidToken(token: string, username: string): Promise<boolean> {
    const lastID = +(await redis.get(`${username}:lastID`) ?? 'NaN')
    let firstID = +(await redis.get(`${username}:firstID`) ?? '0')
    let validToken = true
    if (!isNaN(lastID)) {
        for (let i = firstID; i <= lastID; i++) {
            const blacklistedToken = await redis.get(`${username}:${i}`)
            if (blacklistedToken === null) {
                firstID = i
            }
            if (blacklistedToken === token) {
                validToken = false
                break
            }
        }

        await redis.set(`${username}:firstID`, firstID)
    }
    return validToken
}
