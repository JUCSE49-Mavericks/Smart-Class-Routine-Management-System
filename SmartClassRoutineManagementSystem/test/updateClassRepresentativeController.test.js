const { expect } = require('chai');
const sinon = require('sinon');
const { fetchStudentsByExamYearId, updateClassRepresentativeInfo } = require('../controllers/updateClassRepresentativeController');
const { getStudentsByExamYear, updateClassRepresentative } = require('../models/updateClassRepresentativeModel');

describe('Update Class Representative Controller', () => {
  
  afterEach(() => {
    sinon.restore(); // Restore all sinon spies, stubs, and mocks
  });

  describe('fetchStudentsByExamYearId', () => {
    it('should return students for the given exam year ID', async () => {
        const req = { params: { exam_year_id: 1 } };
        const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    
        const mockStudents = [{ student_id: 1, name: 'John Doe' }];
        sinon.stub(getStudentsByExamYear, 'getStudentsByExamYear').resolves(mockStudents); // Corrected
    
        await fetchStudentsByExamYearId(req, res);
    
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(mockStudents)).to.be.true;
    });
    

    it('should return 404 if no students are found', async () => {
      const req = { params: { exam_year_id: 1 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      sinon.stub(getStudentsByExamYear, 'call').resolves([]); // No students

      await fetchStudentsByExamYearId(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'No students found for the specified exam year' })).to.be.true;
    });

    it('should return 500 if there is a database error', async () => {
      const req = { params: { exam_year_id: 1 } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      sinon.stub(getStudentsByExamYear, 'call').rejects(new Error('Database error'));

      await fetchStudentsByExamYearId(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Database error' })).to.be.true;
    });
  });

  describe('updateClassRepresentativeInfo', () => {
    it('should update the class representative successfully', async () => {
      const req = { body: { exam_year_id: 1, student_id: 2, role: 'Male' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      const mockResult = { affectedRows: 1 };
      sinon.stub(updateClassRepresentative, 'call').resolves(mockResult); // Mock the model function

      await updateClassRepresentativeInfo(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Class representative updated successfully' })).to.be.true;
    });

    it('should return 400 if required fields are missing', async () => {
      const req = { body: { exam_year_id: 1, student_id: 2 } }; // Missing role
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await updateClassRepresentativeInfo(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'Missing required fields' })).to.be.true;
    });

    it('should return 404 if the class representative is not found', async () => {
      const req = { body: { exam_year_id: 1, student_id: 2, role: 'Male' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      const mockResult = { affectedRows: 0 };
      sinon.stub(updateClassRepresentative, 'call').resolves(mockResult); // No update happened

      await updateClassRepresentativeInfo(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Class representative not found for the given exam_year_id' })).to.be.true;
    });

    it('should return 500 if there is a database error', async () => {
      const req = { body: { exam_year_id: 1, student_id: 2, role: 'Male' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      sinon.stub(updateClassRepresentative, 'call').rejects(new Error('Database error'));

      await updateClassRepresentativeInfo(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Database error' })).to.be.true;
    });
  });
});
