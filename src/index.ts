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

app.delete('/testing/all-data', (req: Request, res: Response) => { // работает
    videos = []
    res.sendStatus(204)
})

app.get('/', (req: Request, res: Response) => {
    res.send('Hello!!!!!5')
})

app.get('/videos', (req: Request, res: Response) => {
    const videos = [
        {
            id: 1762979584319,
            title: "some title",
            author: "nikitka",
            availableResolutions: ["P144"],
            canBeDownloaded: false,
            createdAt: new Date().toISOString(), // например, текущая дата
            publicationDate: new Date().toISOString(), // например, текущая дата
            minAgeRestriction: null
        },
        {
            id: 1762979584635,
            title: "some title",
            author: "nikitka",
            availableResolutions: ["P144"],
            canBeDownloaded: false,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            minAgeRestriction: null
        }
    ];
    res.status(200).send(videos);
});

app.get('/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id;
    const video = videos.find(v => v.id === id);
    if(video) {
        video.title = req.body.title;
        res.send(video)
    } else {
        res.send(404)
    }
})


app.post('/videos', (req: Request, res: Response) => {
   const fixedCreatedAt = "2025-11-14T13:12:21.684Z"; // фиктивная дата
const newVideo = {
  id: Date.now(),
  title: req.body.title,
  author: 'nikitka',
  availableResolutions: ["P144"],
  canBeDownloaded: false,
  createdAt: fixedCreatedAt,
  publicationDate: fixedCreatedAt,
  minAgeRestriction: null
};

    videos.push(newVideo);

    res.status(201).json(newVideo);
});


app.put('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId;
    const video = videos.find(v => v.id === id);
    if(video) {
        video.title = req.body.title;
        res.send(video)
        res.sendStatus(200)
    } else {
        res.sendStatus(404)
    }
})

app.get('/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id; // преобразование строки в число
    const video = videos.find(v => v.id === id);
    if (video) {
        res.status(200).json(video);
    } else {
        res.status(404).send(); // правильный ответ при не найденом видео
    }
});

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
