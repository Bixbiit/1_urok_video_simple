import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json()); // Для разбора JSON тела

// Изначально видео: пустой массив
let videos: any[] = [];

// Дополнительный маршрут для очистки всех данных (по условию тестов)
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
    const newVideo = req.body;

    // Пример валидации (добавьте по необходимости)
    if (!newVideo.title || !newVideo.author || !Array.isArray(newVideo.availableResolutions)) {
        return res.status(400).json({ errorsMessages: [] /* сюда добавьте сообщение */ });
    }

    const id = Date.now(); // простое уникальное id
    const createdVideo = { ...newVideo, id, createdAt: new Date().toISOString() };
    videos.push(createdVideo);
    res.status(201).json(createdVideo);
});

// Получить видео по id
app.get('/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id;
    const video = videos.find(v => v.id === id);
    if (video) {
        res.json(video);
    } else {
        res.sendStatus(404);
    }
});

// Обновление видео по id (например, PUT или PATCH)
app.put('/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id;
    const index = videos.findIndex(v => v.id === id);
    if (index === -1) {
        return res.sendStatus(404);
    }
    const body = req.body;
    // Валидация тела
    if (!body.title || !body.author || !Array.isArray(body.availableResolutions)) {
        return res.status(400).json({ errorsMessages: [] });
    }
    // Обновление объекта
    videos[index] = { ...videos[index], ...body };
    res.sendStatus(204);
});

// Удаление видео по id
app.delete('/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id;
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

