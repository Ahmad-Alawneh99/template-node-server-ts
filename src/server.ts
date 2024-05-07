import * as dotenv from 'dotenv';
import express from 'express';
import * as requestService from './requestService';

dotenv.config();
const app = express();

const port = 3000;

app.use(express.json());
app.use(requestService.logRequest);

app.get('/', async (req, res, next) => {
	// eslint-disable-next-line @typescript-eslint/require-await
	return await requestService.handleRequest(req, res, next, async () => {
		return res.send('Hello World!');
	});
});

// This needs to be the last 'app.use' in the file for the error handler to work properly
app.use(requestService.handleGenericError);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
