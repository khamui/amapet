import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';

import { connect } from './dbaccess.js';

// import routes
import signinRoutes from './routes/signins.js';
import circleRoutes from './routes/circles.js';
import answerRoutes from './routes/answers.js';
import notificationRoutes from './routes/notifications.js';
import profileRoutes from './routes/profile.js';
import settingsRoutes from './routes/settings.js';
import moderationRoutes from './routes/moderation.js';
import databaseRoutes from './routes/route.database.js';
import exploreRoutes from './routes/explore.js';
import legalRoutes from './routes/legal.js';
import sitemapRoutes from './routes/sitemap.js';

// env
import * as dotenv from 'dotenv';
dotenv.config();

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID;
export const JWT_SECRET = process.env.JWT_SECRET;
export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/', signinRoutes);
app.use('/', circleRoutes);
app.use('/', answerRoutes);
app.use('/', notificationRoutes);
app.use('/', profileRoutes);
app.use('/', settingsRoutes);
app.use('/', moderationRoutes);
app.use('/', databaseRoutes);
app.use('/', exploreRoutes);
app.use('/', legalRoutes);
app.use('/', sitemapRoutes);

const port = PORT || '3000';
app.set('port', port);

connect();

const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));
