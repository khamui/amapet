import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from "cors";

import { connect } from './dbaccess.js';

// import routes
import signinRoutes from './routes/signins.js';
import circleRoutes from './routes/circles.js';
import answerRoutes from './routes/answers.js';
import notificationRoutes from './routes/notifications.js';
import profileRoutes from './routes/profile.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/', signinRoutes);
app.use('/', circleRoutes);
app.use('/', answerRoutes);
app.use('/', notificationRoutes);
app.use('/', profileRoutes);

const port = process.env.PORT || '5200';
app.set('port', port);

connect();

const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));
