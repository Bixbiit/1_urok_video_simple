import express, { Request, Response } from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express();

const corsMiddleware = cors();
app.use(corsMiddleware)
const jsonBodyMiddleware = bodyParser.json();
app.use(jsonBodyMiddleware);

const port = process.env.PORT || 5000;

let videos = [
  { id: 1, title: "Video 1" },
  { id: 2, title: "Video 2" }, 
  { id: 3, title: "Video 3" },
  { id: 4, title: "Video 4" }
]

app.get('/', (req: Request, res: Response) => {
    res.send('Hello!!!!!5')
})

app.get('/videos', (req: Request, res: Response) => {
    res.send(videos)
})

app.post('/videos', (req: Request, res: Response) => {
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: 'nikitka'
    }
    videos.push(newVideo)

    res.status(202).send(newVideo)
})

app.put('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId;
    const video = videos.find(v => v.id === id);
    if(video) {
        video.title = req.body.title;
        res.send(video)
    } else {
        res.send(404)
    }
})

app.get('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId;
    const video = videos.find(v => v.id === id);
    if(video) {
        video.title = req.body.title;
        res.send(video)
    } else {
        res.send(404)
    }
})

app.delete('/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id;
    const newVideos = videos.filter(v => v.id !== id )
    if ( newVideos.length < videos.length) {
        videos = newVideos
        res.send(204)
    } else {
        res.send(404)
    }
})

app.listen(port, () => {
    console.log(`Сервер запущен на порте ${port}`)
})
