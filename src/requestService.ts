export const handleRequest = async (req, res, next, callback) => {
	return new Promise((resolve) => {
		try {
			callback()
				.then(() => resolve(undefined))
				.catch((error) => {
					next(error);
					resolve(undefined);
				});
		} catch (error) {
			next(error);
			resolve(undefined);
		}
	});
};

export const logRequest = (req, res, next) => {
	console.log(`Calling '${req.path}'. Method: ${req.method}`);

	next();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleGenericError = (err, req, res, next) => {
	console.error(`an error has occurred while calling '${req.path}'`, err);

	return res.status(500).send({ error: true, code: 500, message: err.message });
};
