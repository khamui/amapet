import express from 'express';
import path from 'path';
import http from 'http';
import bodyParser from 'body-parser';
import cors from "cors";

import { api } from './routes/api.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/', api);

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`API running on localhost:${port}`));
