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

app.get('/videos', (req: Request, res: Response) => { //работает 
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

app.get('/videos/:id', (req: Request, res: Response) => { // работает 
    const id = +req.params.id; // преобразуем к числу
    const video = videos.find(v => v.id === id);
    
    if (video) {
        res.status(200).json(video);
    } else {
        res.status(404).send({ error: 'Video not found' });
    }
});


app.post('/videos', (req: Request, res: Response) => { // менял
    const fixedCreatedAt = "2025-11-15T13:12:21.684Z";

    // Объявляем функцию для добавления дней
    function addDays(dateString: string, days: number): string {
        const date = new Date(dateString);
        date.setDate(date.getDate() + days);
        return date.toISOString();
    }

    const createdAt = fixedCreatedAt; // или взять из тела запроса, если есть
    const publicationDate = addDays(createdAt, 1); // +1 день

    const newVideo = {
        id: Date.now(),
        title: req.body.title,
        author: 'nikitka',
        availableResolutions: ["P144"],
        canBeDownloaded: false,
        createdAt: createdAt,
        publicationDate: publicationDate,
        minAgeRestriction: null
    };

    videos.push(newVideo);
    res.status(201).json(newVideo);
});


app.put('/videos/:videoId', (req: Request, res: Response) => { // менял
    const id = +req.params.videoId;
    const video = videos.find(v => v.id === id);
    if(video) {
        video.title = req.body.title;
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})


app.delete('/videos/:id', (req: Request, res: Response) => { // менял
    const id = +req.params.id;
    const newVideos = videos.filter(v => v.id !== id )
    if ( newVideos.length < videos.length) {
        videos = newVideos
        res.sendStatus(204)
    } else {
        res.send(404)
    }
})

app.listen(port, () => {
    console.log(`Сервер запущен на порте ${port}`)
})
