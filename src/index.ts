import express, {Request, Response} from 'express';
const app = express();
const port = 3000;

app.use(express.json())

const videos = [{id: 1, title: 'Rembo', year: 1990 }, {id: 2, title: 'Matrica', year: 1995 }]

app.get('/', (req: Request, res: Response) => {
    let helloMessage = 'Hello wolrd$!!'
    res.send(helloMessage)
})

app.get('/videos', (req: Request, res: Response) => {
    res.send(videos)
})

app.get('/videos/:id', (req: Request, res: Response) => {
    let video = videos.find(v => v.id === +req.params.id)
    if(video) {
        res.send(video)
    } else {
        res.send(404)
    }
})

app.delete('/videos/:id', (req: Request, res: Response) => {
    for(let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1)
            res.send(204)
            return
        }
    }
    res.send(404)
})

app.post('/videos', (req: Request, res: Response) => {
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        year: req.body.year
    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
})

app.put('/videos/:id', (req: Request, res: Response) => {
    let video = videos.find(v => v.id === +req.params.id)
    if(video) {
        video.title = req.body.title
        video.year = req.body.year
        res.send(video)
    } else {
        res.send(404)
    }
})

app.listen(port, () => {
    console.log(`Сервер запущен на порте ${port}`)
})
