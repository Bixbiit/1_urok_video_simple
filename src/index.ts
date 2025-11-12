import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

let videos: any[] = [];
let currentId = 1;
const port = 3000;

app.delete('/testing/all-data', (req, res) => {
    videos = [];
    currentId = 1;
    res.sendStatus(204);
});

app.get('/videos', (req, res) => {
    res.status(200).json(videos);
});

app.post('/videos', (req, res) => {
    const { title, author, availableResolutions, publicationDate } = req.body;

    const errors: any[] = [];

    if (typeof title !== 'string' || title.trim() === '') {
        errors.push({ message: "Title is required", field: "title" });
    }

    if (typeof author !== 'string' || author.trim() === '') {
        errors.push({ message: "Author is required", field: "author" });
    }

    if (!Array.isArray(availableResolutions)) {
        errors.push({ message: "Available resolutions must be an array", field: "availableResolutions" });
    }

    if (publicationDate !== undefined && typeof publicationDate !== 'string') {
        errors.push({ message: "publicationDate must be a string", field: "publicationDate" });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errorsMessages: errors });
    }

    const pubDate = publicationDate !== undefined ? publicationDate : new Date().toISOString();

    const newVideo = {
        id: currentId++,
        title,
        author,
        availableResolutions,
        canBeDownloaded: false,
        minAgeRestriction: null,
        publicationDate: pubDate,
        createdAt: new Date().toISOString()
    };

    videos.push(newVideo);
    res.status(201).json(newVideo);
});

app.get('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videos.find(v => v.id === id);
    if (video) {
        res.status(200).json(video);
    } else {
        res.sendStatus(404);
    }
});

app.put('/videos/:id', (req, res) => {
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
        minAgeRestriction
        // Оставляем publicationDate без изменений
    } = req.body;

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

    if (errors.length > 0) {
        return res.status(400).json({ errorsMessages: errors });
    }

    // Обновляем только те поля, которые переданы
    if (title !== undefined) {
        video.title = title;
    }
    if (author !== undefined) {
        video.author = author;
    }
    if (availableResolutions !== undefined) {
        video.availableResolutions = availableResolutions;
    }
    if (canBeDownloaded !== undefined) {
        video.canBeDownloaded = canBeDownloaded;
    }
    if (minAgeRestriction !== undefined) {
        video.minAgeRestriction = minAgeRestriction;
    }

    // Не трогаем publicationDate вообще при обновлении
    res.sendStatus(204);
});

app.delete('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const index = videos.findIndex(v => v.id === id);
    if (index !== -1) {
        videos.splice(index, 1);
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});