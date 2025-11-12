"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3000;
// Изначально массив видео (можете начать с пустого массива)
let videos = [];
// Удалить все данные (для тестового эндпоинта)
app.delete('/testing/all-data', (req, res) => {
    videos = [];
    res.sendStatus(204);
});
// Получить все видео
app.get('/videos', (req, res) => {
    res.json(videos);
});
// Получить видео по id
app.get('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videos.find(v => v.id === id);
    if (video) {
        res.json(video);
    }
    else {
        res.sendStatus(404);
    }
});
// Создать новое видео
app.post('/videos', (req, res) => {
    const newVideo = req.body;
    // Можно добавить валидацию, чтобы убедиться, что body содержит нужные поля
    // Для примера просто добавим id и дату
    const id = Date.now(); // или другой способ генерации уникального id
    const video = Object.assign(Object.assign({ id: id }, newVideo), { createdAt: new Date().toISOString() });
    videos.push(video);
    res.status(201).json(video);
});
// Обновить видео по id
app.put('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const index = videos.findIndex(v => v.id === id);
    if (index === -1) {
        res.sendStatus(404);
        return;
    }
    // Обновляем существующий объект
    const updatedVideo = req.body;
    // Можно добавить валидацию
    videos[index] = Object.assign(Object.assign({}, videos[index]), updatedVideo);
    res.sendStatus(204);
});
// Удалить видео по id
app.delete('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const initialLength = videos.length;
    videos = videos.filter(v => v.id !== id);
    if (videos.length < initialLength) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порте ${port}`);
});
