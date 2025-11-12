import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json()); // для разбора JSON тела

// Изначально видео: пустой массив
let videos: any[] = [];

// Вспомогательная функция для валидации тела при создании/обновлении
function validateVideoBody(body: any, isUpdate = false) {
    const errors: { message: string; field: string }[] = [];

    if (!isUpdate || ('title' in body)) {
        if (typeof body.title !== 'string' || body.title.trim() === '') {
            errors.push({ message: 'Title is required and must be a non-empty string', field: 'title' });
        }
    }

    if (!isUpdate || ('author' in body)) {
        if (typeof body.author !== 'string' || body.author.trim() === '') {
            errors.push({ message: 'Author is required and must be a non-empty string', field: 'author' });
        }
    }

    if (!isUpdate || ('availableResolutions' in body)) {
        if (!Array.isArray(body.availableResolutions) || body.availableResolutions.length === 0) {
            errors.push({ message: 'availableResolutions must be a non-empty array', field: 'availableResolutions' });
        } else {
            // Можно добавить проверку допустимых значений resolutions, если нужно
        }
    }

    // Дополнительные проверки для обновления
    if (isUpdate) {
        // Например, если тело не содержит ни одного поля, возвращаем ошибку
        if (Object.keys(body).length === 0) {
            errors.push({ message: 'No fields to update', field: 'body' });
        }
    }

    return errors;
}

// Дополнительный маршрут для очистки всех данных
app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos = [];
    res.sendStatus(204);
});

// Получение всех видео
app.get('/videos', (req: Request, res: Response) => {
    res.status(200).json(videos);
});

// Создание нового видео
app.post('/videos', (req: Request, res: Response) => {
    const body = req.body;
    const errors = validateVideoBody(body);
    if (errors.length > 0) {
        return res.status(400).json({ errorsMessages: errors });
    }

    const id = Date.now() + Math.random(); // более уникальный id
    const createdAt = new Date().toISOString();
    const newVideo = {
        id,
        title: body.title,
        author: body.author,
        availableResolutions: body.availableResolutions,
        createdAt,
        canBeDownloaded: false,
        minAgeRestriction: null,
        publicationDate: new Date().toISOString(),
    };
    videos.push(newVideo);
    res.status(201).json(newVideo);
});

// Получить видео по id
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
    if (index === -1) {
        return res.sendStatus(404);
    }

    const body = req.body;
    const errors = validateVideoBody(body, true);
    if (errors.length > 0) {
        return res.status(400).json({ errorsMessages: errors });
    }

    // Обновляем только переданные поля
    if ('title' in body) videos[index].title = body.title;
    if ('author' in body) videos[index].author = body.author;
    if ('availableResolutions' in body) videos[index].availableResolutions = body.availableResolutions;
    // Можно обновлять другие поля по аналогии (можно оставить неизменными)

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

// Обработка ошибок для ненайденных путей
app.use((req, res) => {
    res.status(404).send('<html><body><pre>Cannot ' + req.method + ' ' + req.originalUrl + '</pre></body></html>');
});

app.listen(port, () => {
    console.log(`Сервер запущен на порте ${port}`);
});
