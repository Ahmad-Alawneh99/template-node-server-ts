require('dotenv').config();
const express = require('express');
const requestService = require('./requestService');

const app = express();

const port = 3000;

app.use(express.json());
app.use(requestService.logRequest);

app.get('/', async (req, res, next) => {
	return await requestService.handleRequest(req, res, next, async () => {
		return res.send('Hello World!');
	});
});

app.use(requestService.handleGenericError);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
