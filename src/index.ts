import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

const port = 3000;

// Временное хранилище видео
let videos: any[] = [];
let currentId = 1;

// Эндпоинты для тестирования очистки данных
app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos = [];
    currentId = 1;
    res.sendStatus(204); // No Content
});

// Получение всех видео
app.get('/videos', (req: Request, res: Response) => {
    res.status(200).json(videos);
});

// Создание нового видео
app.post('/videos', (req: Request, res: Response) => {
    const { title, author, availableResolutions } = req.body;

    // Валидация тела запроса, например, что title существует и не null
    if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ errorsMessages: [{ message: "Title is required", field: "title" }] });
    }
    if (typeof author !== 'string' || author.trim() === '') {
        return res.status(400).json({ errorsMessages: [{ message: "Author is required", field: "author" }] });
    }
    if (!Array.isArray(availableResolutions)) {
        return res.status(400).json({ errorsMessages: [{ message: "Available resolutions must be an array", field: "availableResolutions" }] });
    }

    const newVideo = {
        id: currentId++,
        title,
        author,
        availableResolutions,
        canBeDownloaded: false,
        minAgeRestriction: null,
        publicationDate: new Date().toISOString()
    };
    videos.push(newVideo);
    res.status(201).json(newVideo);
});

// Получить видео по id
app.get('/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id;
    const video = videos.find(v => v.id === id);
    if (video) {
        res.status(200).json(video);
    } else {
        res.sendStatus(404);
    }
});

// Обновление видео по id
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

    const errors: any[] = [];

    if (typeof title !== 'string') {
        errors.push({ message: "Title must be a string", field: "title" });
    }
    if (typeof canBeDownloaded !== 'boolean') {
        errors.push({ message: "canBeDownloaded must be a boolean", field: "canBeDownloaded" });
    }
    if (typeof publicationDate !== 'string') {
        errors.push({ message: "publicationDate must be a string", field: "publicationDate" });
    }
    // Дополнительные проверки, например, что минимальные/максимальные значения и т. д.

    if (errors.length > 0) {
        return res.status(400).json({ errorsMessages: errors });
    }

    // Обновление данных
    if (title !== undefined) video.title = title;
    if (author !== undefined) video.author = author;
    if (availableResolutions !== undefined) video.availableResolutions = availableResolutions;
    if (canBeDownloaded !== undefined) video.canBeDownloaded = canBeDownloaded;
    if (minAgeRestriction !== undefined) video.minAgeRestriction = minAgeRestriction;
    if (publicationDate !== undefined) video.publicationDate = publicationDate;

    res.sendStatus(204);
});

// Удаление видео по id
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

// Обработка маршрута /testing/all-data (для тестов)
app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos = [];
    currentId = 1;
    res.sendStatus(204);
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порте ${port}`);
});