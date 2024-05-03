import { NextFunction, Request, Response } from 'express'

declare module 'express-session' {
    interface SessionData {
        userid: number | undefined
    }
}

export function log(req: Request, _res: Response, next: NextFunction) {
    console.log(`${req.ip} ${req.method} ${req.url} => ${JSON.stringify(req.body)}`)
    next()
}

export function restrict(req: Request, res: Response, next: NextFunction) {
    if (req.session.userid !== undefined) {
        next()
    } else {
        res.status(401).json()
    }
}
