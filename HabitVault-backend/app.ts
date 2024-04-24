import express, { Express, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()
app.use(express.json())
const port = 3000

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.get('/users', async (req: Request, res: Response) => {
    console.log(`${req.method} ${req.url}`)
    const users = await prisma.user.findMany()
    res.json(users)
})

app.post('/addUser', async (req: Request, res: Response) => {
    const data = JSON.stringify(req.body);
    console.log(`${req.method} ${req.path} => ${data}`)
    res.json(JSON.stringify(req.body))
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
