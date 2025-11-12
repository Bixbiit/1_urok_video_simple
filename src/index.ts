import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json()); // парсинг JSON тела

let videos: any[] = [];

/** Валидация тела при создании/обновлении видео */
function validateVideoBody(body: any, isUpdate = false) {
    const errors: { message: string; field: string }[] = [];

    // Проверка title
    if (!isUpdate || ('title' in body)) {
        if (typeof body.title !== 'string' || body.title.trim() === '') {
            errors.push({ message: 'Title is required and must be a non-empty string', field: 'title' });
        }
    }

    // Проверка author
    if (!isUpdate || ('author' in body)) {
        if (typeof body.author !== 'string' || body.author.trim() === '') {
            errors.push({ message: 'Author is required and must be a non-empty string', field: 'author' });
        }
    }

    // Проверка availableResolutions
    if (!isUpdate || ('availableResolutions' in body)) {
        if (!Array.isArray(body.availableResolutions) || body.availableResolutions.length === 0) {
            errors.push({ message: 'availableResolutions must be a non-empty array', field: 'availableResolutions' });
        } else {
            // Можно дополнительно проверить допустимые значения resolutions
        }
    }

    // Проверка canBeDownloaded (если предоставлено)
    if (!isUpdate || ('canBeDownloaded' in body)) {
        if (typeof body.canBeDownloaded !== 'boolean') {
            errors.push({ message: 'canBeDownloaded must be a boolean', field: 'canBeDownloaded' });
        }
    }

    // Проверка minAgeRestriction (если предоставлено)
    if (!isUpdate || ('minAgeRestriction' in body)) {
        if (!(body.minAgeRestriction === null || typeof body.minAgeRestriction === 'number')) {
            errors.push({ message: 'minAgeRestriction must be a number or null', field: 'minAgeRestriction' });
        }
    }

    // Проверка publicationDate (если предоставлено)
    if (!isUpdate || ('publicationDate' in body)) {
        if (typeof body.publicationDate !== 'string' || isNaN(Date.parse(body.publicationDate))) {
            errors.push({ message: 'publicationDate must be a valid ISO string', field: 'publicationDate' });
        }
    }

    // Проверка всего тела при обновлении, если оно пустое
    if (isUpdate && Object.keys(body).length === 0) {
        errors.push({ message: 'No fields to update', field: 'body' });
    }

    return errors;
}

// Очистка всех данных
app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos = [];
    res.sendStatus(204);
});

// Получение всех видео
app.get('/videos', (req: Request, res: Response) => {
    res.status(200).json(videos);
});

// Создание видео
app.post('/videos', (req: Request, res: Response) => {
    const body = req.body;
    const errors = validateVideoBody(body);
    if (errors.length > 0) {
        return res.status(400).json({ errorsMessages: errors });
    }

    const id = Date.now() + Math.random(); // простое уникальное id
    const createdAt = new Date().toISOString();
    const publicationDate = new Date().toISOString();

    const newVideo = {
        id,
        title: body.title,
        author: body.author,
        availableResolutions: body.availableResolutions,
        createdAt,
        canBeDownloaded: true, // по умолчанию true
        minAgeRestriction: null,
        publicationDate,
    };
    videos.push(newVideo);
    res.status(201).json(newVideo);
});

// Получение видео по id
app.get('/videos/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const video = videos.find(v => v.id === id);
    if (video) {
        res.json(video);
    } else {
        res.sendStatus(404);
    }
});

// Обновление видео по id
app.put('/videos/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const index = videos.findIndex(v => v.id === id);
    if (index === -1) return res.sendStatus(404);

    const body = req.body;
    const errors = validateVideoBody(body, true);
    if (errors.length > 0) {
        return res.status(400).json({ errorsMessages: errors });
    }

    const video = videos[index];

    if ('title' in body) video.title = body.title;
    if ('author' in body) video.author = body.author;
    if ('availableResolutions' in body) video.availableResolutions = body.availableResolutions;
    if ('canBeDownloaded' in body) video.canBeDownloaded = body.canBeDownloaded;
    if ('minAgeRestriction' in body) video.minAgeRestriction = body.minAgeRestriction;
    if ('publicationDate' in body) {
        // Обновим дату только если валидная
        if (typeof body.publicationDate === 'string' && !isNaN(Date.parse(body.publicationDate))) {
            video.publicationDate = body.publicationDate;
        }
    }

    res.sendStatus(204);
});

// Удаление видео по id
app.delete('/videos/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const lengthBefore = videos.length;
    videos = videos.filter(v => v.id !== id);
    if (videos.length < lengthBefore) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

// Обработка ошибок для несуществующих путей
app.use((req, res) => {
    res.status(404).send(`<html><body><pre>Cannot ${req.method} ${req.originalUrl}</pre></body></html>`);
});

app.listen(port, () => {
    console.log(`Сервер запущен на порте ${port}`);
});