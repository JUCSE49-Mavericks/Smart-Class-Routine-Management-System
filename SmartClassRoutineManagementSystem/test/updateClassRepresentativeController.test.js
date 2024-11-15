const { expect } = require('chai');
const sinon = require('sinon');
const { fetchStudentsByExamYearId, updateClassRepresentativeInfo } = require('../controllers/updateClassRepresentativeController');
const { getStudentsByExamYear, updateClassRepresentative } = require('../models/updateClassRepresentativeModel');
const updateClassRepresentativeTestCases = require('./testFolder/updateClassRepresentative.json');

describe('Update Class Representative Controller', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('fetchStudentsByExamYearId', () => {
    updateClassRepresentativeTestCases.fetchStudentsByExamYearId.forEach((testCase) => {
      it(testCase.description, async () => {
        const req = { params: testCase.input.params };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        if (testCase.mock) {
          const mockMethod = sinon.stub(getStudentsByExamYear, testCase.mock.method);
          if (testCase.mock.throwError) {
            mockMethod.rejects(new Error(testCase.mock.throwError));
          } else {
            mockMethod.resolves(testCase.mock.returnValue);
          }
        }

        await fetchStudentsByExamYearId(req, res);

        expect(res.status.calledWith(testCase.expected.status)).to.be.true;
        expect(res.json.calledWith(testCase.expected.response)).to.be.true;
      });
    });
  });

  describe('updateClassRepresentativeInfo', () => {
    updateClassRepresentativeTestCases.updateClassRepresentativeInfo.forEach((testCase) => {
      it(testCase.description, async () => {
        const req = { body: testCase.input.body };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

        if (testCase.mock) {
          const mockMethod = sinon.stub(updateClassRepresentative, testCase.mock.method);
          if (testCase.mock.throwError) {
            mockMethod.rejects(new Error(testCase.mock.throwError));
          } else {
            mockMethod.resolves(testCase.mock.returnValue);
          }
        }

        await updateClassRepresentativeInfo(req, res);

        expect(res.status.calledWith(testCase.expected.status)).to.be.true;
        expect(res.json.calledWith(testCase.expected.response)).to.be.true;
      });
    });
  });
});
