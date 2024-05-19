import { Request } from 'express'
import * as core from "express-serve-static-core"

export interface TypedRequest<B, P extends core.ParamsDictionary = core.ParamsDictionary, Q extends qs.ParsedQs = qs.ParsedQs> extends Request {
    body: B
    params: P
    query: Q
}

export interface RegisterBody {
    username: string | undefined,
    password: string | undefined
}

export interface LoginBody {
    username: string | undefined,
    password: string | undefined
}

export interface HabitBody {
    name: string | undefined,
    description: string | undefined
}

export interface HabitRecordBody {
    date: string | undefined,
}

export interface Session {
    cookie: any,
    id: string,
    username: string
}
