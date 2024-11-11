const { expect } = require('chai');
const sinon = require('sinon');
const db = require('../config/db');
const { getStudentsByExamYear, updateClassRepresentative } = require('../models/updateClassRepresentativeModel');

describe('Update Class Representative Model', () => {
  
  afterEach(() => {
    sinon.restore(); // Restore all sinon spies, stubs, and mocks
  });

  describe('getStudentsByExamYear', () => {
    it('should return students for the given exam year ID', async () => {
      const exam_year_id = 1;
      const mockStudents = [{ student_id: 1, name: 'John Doe' }];
      sinon.stub(db, 'query').yields(null, mockStudents); // Mock the db.query function

      const result = await getStudentsByExamYear(exam_year_id);

      expect(result).to.deep.equal(mockStudents);
    });

    it('should throw an error if the query fails', async () => {
      const exam_year_id = 1;
      sinon.stub(db, 'query').yields(new Error('Query failed'), null);

      try {
        await getStudentsByExamYear(exam_year_id);
      } catch (error) {
        expect(error.message).to.equal('Query failed');
      }
    });
  });

  describe('updateClassRepresentative', () => {
    it('should insert or update a class representative', async () => {
      const exam_year_id = 1;
      const student_id = 2;
      const role = 'Male';
      const mockResult = { affectedRows: 1 };
      sinon.stub(db, 'query').yields(null, mockResult); // Mock the db.query function

      const result = await updateClassRepresentative(exam_year_id, student_id, role);

      expect(result).to.deep.equal(mockResult);
    });

    it('should throw an error if the query fails', async () => {
      const exam_year_id = 1;
      const student_id = 2;
      const role = 'Male';
      sinon.stub(db, 'query').yields(new Error('Query failed'), null);

      try {
        await updateClassRepresentative(exam_year_id, student_id, role);
      } catch (error) {
        expect(error.message).to.equal('Query failed');
      }
    });
  });
});
