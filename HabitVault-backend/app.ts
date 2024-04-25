import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()
app.use(express.json())
const port = 3000

app.get('/users', async (req: Request, res: Response) => {
    console.log(`${req.method} ${req.url}`)

    const users = await prisma.user.findMany()
    res.json(users)
})

interface RegisterBody {
    username: string | undefined,
    password: string | undefined

}
interface TypedRequest<T> extends Request {
    body: T
}

//TODO: data validation, check if username already taken
app.post('/register', async (req: TypedRequest<RegisterBody>, res: Response) => {
    console.log(`${req.method} ${req.path} => ${JSON.stringify(req.body)}`)

    const username = req.body.username
    const password = req.body.password
    if (username !== undefined && password !== undefined) {
        const user = await prisma.user.create({
            data: {
                username: username,
                password: password

            }
        })
        console.log(user)
        res.json(user)

    } else {
        res.status(400).json()
    }

})


app.listen(port, () => {
    console.log(`HabitVault backend listening on port ${port}`)
})
