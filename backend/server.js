import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from "cors";

import { connect } from './dbaccess.js';

// import routes
import circleRoutes from './routes/circles.js';
import signinRoutes from './routes/signins.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/', circleRoutes);
app.use('/', signinRoutes)

const port = process.env.PORT || '5200';
app.set('port', port);

connect();

const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));
