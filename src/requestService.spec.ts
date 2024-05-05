import { expect } from 'chai';
import rewire from 'rewire';
import sinon from 'sinon';

const requestService = rewire('./requestService');

describe('requestService', () => {
	describe('handleRequest', () => {
		const handleRequest = requestService.__get__('handleRequest');
		const mockCallback = sinon.stub();
		const mockNext = sinon.stub();

		afterEach(() => {
			mockCallback.reset();
			mockNext.reset();
		});

		it('should call the provided callback', async () => {
			mockCallback.resolves('Success');

			await handleRequest({}, {}, mockNext, mockCallback);

			expect(mockCallback).to.have.been.called;
			expect(mockNext).not.to.have.been.called;
		});

		it('should call "next" if the callback throws an error', async () => {
			mockCallback.rejects('Failure');

			await handleRequest({}, {}, mockNext, mockCallback);

			expect(mockCallback).to.have.been.called;
			expect(mockNext).to.have.been.called;
		});

		it('should error out if attempting to call the provided callback fails', async () => {
			mockCallback.returns('not an async function');

			await handleRequest({}, {}, mockNext, mockCallback);

			expect(mockCallback).to.have.been.called;
			expect(mockNext).to.have.been.called;
		});
	});

	describe('logRequest', () => {
		const logRequest = requestService.__get__('logRequest');
		const mockedConsoleLog = sinon.stub();

		beforeEach(() => {
			requestService.__set__({
				console: {
					log: mockedConsoleLog,
				},
			});
		});

		it('should log request details', () => {
			logRequest({ path: 'mockPath', method: 'mockMethod' }, {}, sinon.stub());
			expect(mockedConsoleLog).to.have.been.calledWithExactly('Calling \'mockPath\'. Method: mockMethod');
		});
	});

	describe('handleGenericError', () => {
		const handleGenericError = requestService.__get__('handleGenericError');
		const mockedConsoleError = sinon.stub();

		const mockRes = {
			status: sinon.stub().returnsThis(),
			send: sinon.stub(),
		};

		beforeEach(() => {
			requestService.__set__({
				console: {
					error: mockedConsoleError,
				},
			});
		});

		it('should return status 500 with an error message', () => {
			handleGenericError({ message: 'mockError' }, { path: 'mockPath' }, mockRes, {});

			expect(mockedConsoleError).to.have.been.calledWithExactly('an error has occurred while calling \'mockPath\'', { message: 'mockError' });
			expect(mockRes.send).to.have.been.calledWith({ error: true, code: 500, message: 'mockError' });
		});
	});
});
