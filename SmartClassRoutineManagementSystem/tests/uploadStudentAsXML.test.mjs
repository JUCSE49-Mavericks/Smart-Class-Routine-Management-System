import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { uploadStudentAsXML } from '../controllers/studentController.js';
import db from '../config/db.js';
import xml2js from 'xml2js';
import fs from 'fs';
import path from 'path';

const { expect } = chai;
chai.use(chaiHttp);

describe('Upload Student as XML', () => {
    let req, res;
    let testCases;

    /**
     * Load test cases from JSON file.
     */
    before(() => {
        const testCasePath = path.resolve(__dirname, 'testfile.json');
        testCases = JSON.parse(fs.readFileSync(testCasePath, 'utf-8'));
    });

    /**
     * Set up request and response objects, and stubs for database and XML parser before each test.
     */
    beforeEach(() => {
        req = { body: '' };
        res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub()
        };

        sinon.stub(db, 'query').yields(null, { affectedRows: 1 });
        sinon.stub(xml2js, 'parseString').yields(null, { root: { row: [{}] } });
    });

    /**
     * Restore stubs after each test to clean up any modifications.
     */
    afterEach(() => {
        sinon.restore();
    });

    /**
     * Test case: Should upload student data successfully.
     * @param {Object} req.body - Request body containing student data.
     * @param {Object} res - Response object to verify output.
     */
    it('should upload student data successfully', async () => {
        req.body = testCases.validStudentData.body;
        await uploadStudentAsXML(req, res);
        
        expect(res.status.calledWith(testCases.validStudentData.expectedStatus)).to.be.true;
        expect(res.send.calledWith(testCases.validStudentData.expectedMessage)).to.be.true;
    });

    /**
     * Test case: Should handle XML parsing errors.
     * @param {Object} req.body - Request body containing malformed XML data.
     * @param {Object} res - Response object to verify error handling.
     */
    it('should handle XML parsing errors', async () => {
        req.body = testCases.invalidXmlData.body;
        xml2js.parseString.yields(new Error('Parsing error'));
        
        await uploadStudentAsXML(req, res);
        
        expect(res.status.calledWith(testCases.invalidXmlData.expectedStatus)).to.be.true;
        expect(res.send.calledWith(testCases.invalidXmlData.expectedMessage)).to.be.true;
    });

    /**
     * Test case: Should skip incomplete data and respond accordingly.
     * @param {Object} req.body - Request body containing incomplete student data.
     * @param {Object} res - Response object to verify handling of incomplete data.
     */
    it('should skip incomplete data', async () => {
        req.body = testCases.incompleteData.body;
        
        await uploadStudentAsXML(req, res);
        
        expect(res.status.calledWith(testCases.incompleteData.expectedStatus)).to.be.true;
        expect(res.send.calledWith(testCases.incompleteData.expectedMessage)).to.be.true;
    });

    /**
     * Test case: Should handle errors during database insertion.
     * @param {Object} req.body - Request body with data causing database insertion error.
     * @param {Object} res - Response object to verify error handling.
     */
    it('should handle errors during database insertion', async () => {
        req.body = testCases.databaseError.body;
        db.query.yields(new Error('Database error'));
        
        await uploadStudentAsXML(req, res);
        
        expect(res.status.calledWith(testCases.databaseError.expectedStatus)).to.be.true;
        expect(res.send.calledWith(testCases.databaseError.expectedMessage)).to.be.true;
    });
});
