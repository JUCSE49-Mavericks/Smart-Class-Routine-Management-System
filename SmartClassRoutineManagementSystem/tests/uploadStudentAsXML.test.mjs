import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xml2js from 'xml2js';
import bcrypt from 'bcryptjs';
import sinon from 'sinon';
import { expect } from 'chai';
import { uploadStudentAsXML } from '../controllers/studentController.js';
import pkg from '../models/studentModel.js';
const { clearTable, insertXmlStudentIntoDatabase } = pkg;

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('uploadStudentAsXML', () => {
  let req, res, testCases;

  before(() => {
    const testFilePath = path.resolve(__dirname, 'testfile.json');
    testCases = JSON.parse(fs.readFileSync(testFilePath, 'utf-8'));
  });

  beforeEach(() => {
    req = { body: '' };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub()
    };
    sinon.stub(xml2js, 'parseString');
    sinon.stub(clearTable);
    sinon.stub(insertXmlStudentIntoDatabase);
    sinon.stub(bcrypt, 'hash');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should import XML data successfully', async () => {
    req.body = testCases.validStudentData.body;
    xml2js.parseString.yields(null, { root: { row: [{ student_id: '2', Name: 'Sadia Hossain', Password: '1234' }] } });
    clearTable.resolves();
    bcrypt.hash.resolves('hashed_password');
    insertXmlStudentIntoDatabase.resolves();

    await uploadStudentAsXML(req, res);

    expect(clearTable.calledOnceWith('Student')).to.be.true;
    expect(insertXmlStudentIntoDatabase.calledOnce).to.be.true;
    expect(bcrypt.hash.calledOnceWith('1234', 10)).to.be.true;
    expect(res.status.calledWith(testCases.validStudentData.expectedStatus)).to.be.true;
    expect(res.send.calledWith(testCases.validStudentData.expectedMessage)).to.be.true;
  });

  it('should handle invalid XML data', async () => {
    req.body = testCases.invalidXmlData.body;
    xml2js.parseString.yields(new Error('Parsing error'));

    await uploadStudentAsXML(req, res);

    expect(res.status.calledWith(testCases.invalidXmlData.expectedStatus)).to.be.true;
    expect(res.send.calledWith(testCases.invalidXmlData.expectedMessage)).to.be.true;
  });

  it('should skip incomplete student data', async () => {
    req.body = testCases.incompleteData.body;
    xml2js.parseString.yields(null, { root: { row: [{ student_id: '2', Name: 'Sadia Hossain' }] } });
    clearTable.resolves();

    await uploadStudentAsXML(req, res);

    expect(insertXmlStudentIntoDatabase.notCalled).to.be.true;
    expect(res.status.calledWith(testCases.incompleteData.expectedStatus)).to.be.true;
    expect(res.send.calledWith(testCases.incompleteData.expectedMessage)).to.be.true;
  });

  it('should handle errors during database insertion', async () => {
    req.body = testCases.databaseError.body;
    xml2js.parseString.yields(null, { root: { row: [{ student_id: '3', Name: 'John Doe', Password: 'password123' }] } });
    clearTable.resolves();
    bcrypt.hash.resolves('hashed_password');
    insertXmlStudentIntoDatabase.rejects(new Error('Database error'));

    await uploadStudentAsXML(req, res);

    expect(res.status.calledWith(testCases.databaseError.expectedStatus)).to.be.true;
    expect(res.send.calledWith(testCases.databaseError.expectedMessage)).to.be.true;
  });
});
