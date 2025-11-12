import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

let videos: any[] = [];
let currentId = 1;
const port = 3000;

/* --- Очистка всех данных для тестов --- */
app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos = [];
    currentId = 1;
    res.sendStatus(204);
});

/* --- Получить все видео --- */
app.get('/videos', (req: Request, res: Response) => {
    res.status(200).json(videos);
});

/* --- Создать новое видео --- */
app.post('/videos', (req: Request, res: Response) => {
    const { title, author, availableResolutions } = req.body;

    // Валидация
    const errors: any[] = [];

    if (typeof title !== 'string' || !title.trim()) {
        errors.push({ message: "Title is required", field: "title" });
    }
    if (typeof author !== 'string' || !author.trim()) {
        errors.push({ message: "Author is required", field: "author" });
    }
    if (!Array.isArray(availableResolutions)) {
        errors.push({ message: "Available resolutions must be an array", field: "availableResolutions" });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errorsMessages: errors });
    }

    const newVideo = {
        id: currentId++,
        title,
        author,
        availableResolutions,
        canBeDownloaded: false,
        minAgeRestriction: null,
        publicationDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
    };

    videos.push(newVideo);
    res.status(201).json(newVideo);
});

/* --- Получить видео по id --- */
app.get('/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id;
    const video = videos.find(v => v.id === id);
    if (video) {
        res.status(200).json(video);
    } else {
        res.sendStatus(404);
    }
});

/* --- Обновить видео по id --- */
app.put('/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id;
    const video = videos.find(v => v.id === id);
    if (!video) {
        return res.sendStatus(404);
    }

    const {
        title,
        author,
        availableResolutions,
        canBeDownloaded,
        minAgeRestriction,
        publicationDate
    } = req.body;

    // Валидация
    const errors: any[] = [];

    if (title !== undefined && typeof title !== 'string') {
        errors.push({ message: "Title must be a string", field: "title" });
    }
    if (author !== undefined && typeof author !== 'string') {
        errors.push({ message: "Author must be a string", field: "author" });
    }
    if (availableResolutions !== undefined && !Array.isArray(availableResolutions)) {
        errors.push({ message: "Available resolutions must be an array", field: "availableResolutions" });
    }
    if (canBeDownloaded !== undefined && typeof canBeDownloaded !== 'boolean') {
        errors.push({ message: "canBeDownloaded must be a boolean", field: "canBeDownloaded" });
    }
    if (minAgeRestriction !== undefined && (typeof minAgeRestriction !== 'number' || minAgeRestriction < 1 || minAgeRestriction > 18)) {
        errors.push({ message: "minAgeRestriction must be a number between 1 and 18", field: "minAgeRestriction" });
    }
    if (publicationDate !== undefined && typeof publicationDate !== 'string') {
        errors.push({ message: "publicationDate must be a string", field: "publicationDate" });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errorsMessages: errors });
    }

    // Обновляем поля, если они есть
    if (title !== undefined && typeof title === 'string') {
        video.title = title;
    }
    if (author !== undefined && typeof author === 'string') {
        video.author = author;
    }
    if (availableResolutions !== undefined && Array.isArray(availableResolutions)) {
        video.availableResolutions = availableResolutions;
    }
    if (canBeDownloaded !== undefined && typeof canBeDownloaded === 'boolean') {
        video.canBeDownloaded = canBeDownloaded;
    }
    if (minAgeRestriction !== undefined && typeof minAgeRestriction === 'number') {
        video.minAgeRestriction = minAgeRestriction;
    }
    if (publicationDate !== undefined && typeof publicationDate === 'string') {
        video.publicationDate = publicationDate;
    }

    // Обновляем дату публикации
    video.publicationDate = new Date().toISOString();

    res.sendStatus(204);
});

/* --- Удалить видео по id --- */
app.delete('/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id;
    const index = videos.findIndex(v => v.id === id);
    if (index !== -1) {
        videos.splice(index, 1);
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

/* --- Запуск сервера --- */
app.listen(port, () => {
    console.log(`Сервер запущен на порте ${port}`);
});