"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => {
    let helloMessage = 'Hello wolrd!!!!';
    res.send(helloMessage);
});
app.listen(port, () => {
    console.log(`Сервер запущен на порте ${port}`);
});
//# sourceMappingURL=index.js.map