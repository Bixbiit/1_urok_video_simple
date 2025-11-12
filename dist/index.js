"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const corsMiddleware = (0, cors_1.default)();
app.use(corsMiddleware);
const jsonBodyMiddleware = body_parser_1.default.json();
app.use(jsonBodyMiddleware);
const port = process.env.PORT || 5000;
let videos = [
    { id: 1, title: "Video 1" },
    { id: 2, title: "Video 2" }, // запятая здесь не обязательна для последнего элемента
    { id: 3, title: "Video 3" },
    { id: 4, title: "Video 4" }
];
app.get('/', (req, res) => {
    res.send('Hello!!!!!5');
});
app.get('/videos', (req, res) => {
    res.send(videos);
});
app.post('/videos', (req, res) => {
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: 'nikitka'
    };
    videos.push(newVideo);
    res.status(202).send(newVideo);
});
app.put('/videos/:videoId', (req, res) => {
    const id = +req.params.videoId;
    const video = videos.find(v => v.id === id);
    if (video) {
        video.title = req.body.title;
        res.send(video);
    }
    else {
        res.send(404);
    }
});
app.get('/videos/:videoId', (req, res) => {
    const id = +req.params.videoId;
    const video = videos.find(v => v.id === id);
    if (video) {
        video.title = req.body.title;
        res.send(video);
    }
    else {
        res.send(404);
    }
});
app.delete('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const newVideos = videos.filter(v => v.id !== id);
    if (newVideos.length < videos.length) {
        videos = newVideos;
        res.send(204);
    }
    else {
        res.send(404);
    }
});
app.listen(port, () => {
    console.log(`Сервер запущен на порте ${port}`);
});
