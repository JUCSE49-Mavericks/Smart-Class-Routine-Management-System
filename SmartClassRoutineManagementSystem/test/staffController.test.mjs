// staffController.test.mjs or ensure package.json has "type": "module"
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { uploadStaffAsXML } from '../controllers/staffController.js';
import { getStaffByDepartmentId, getDepartmentByStaffId } from '../controllers/staffController.js';
import db from '../config/db.js'; // Ensure paths match

const { expect } = chai;
chai.use(sinonChai);

describe('Staff Controller Tests', () => {
    afterEach(() => {
        sinon.restore(); // Reset sinon mocks after each test
    });

    it('should respond with success on valid XML upload (single entry)', async () => {
        const req = {
            body: '<root><row><staff_id>1</staff_id><Name>Amzad Bhai</Name><Role>Clerk</Role><dept_id>2</dept_id><Password>1234</Password><Phone>01864852588</Phone></row></root>'
        };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub()
        };

        sinon.stub(db, 'query').yields(null, { affectedRows: 1 });
        
        await uploadStaffAsXML(req, res);

        expect(res.status).to.have.been.calledWith(200);
        expect(res.send).to.have.been.calledWith('XML data imported successfully.');
    });


    it('should return 400 on invalid XML', async () => {
        const req = { body: '<invalidXML>' };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub()
        };

        await uploadStaffAsXML(req, res);

        expect(res.status).to.have.been.calledWith(400);
        expect(res.send).to.have.been.calledWith('Invalid XML data');
    });
});



describe('getStaffByDepartmentId', () => {
    let dbQueryStub;

    beforeEach(() => {
        // Stub the database query function
        dbQueryStub = sinon.stub(db, 'query');
    });

    afterEach(() => {
        // Restore the original function
        dbQueryStub.restore();
    });

    it('should resolve with an array of staff members for a valid dept_id', async () => {
        const mockDeptId = '2';
        const mockResult = [
            { staff_id: '2', Name: 'Moti Bhai', Role: 'Clerk', dept_id: '2' }
        ];
        
        dbQueryStub.yields(null, mockResult);

        const result = await getStaffByDepartmentId(mockDeptId);

        expect(result).to.deep.equal(mockResult);
        expect(dbQueryStub.calledOnce).to.be.true;
        expect(dbQueryStub.firstCall.args[0]).to.equal('SELECT * FROM Staff WHERE dept_id = ?');
        expect(dbQueryStub.firstCall.args[1]).to.deep.equal([mockDeptId]);
    });

    it('should reject with an error when the query fails', async () => {
        const mockDeptId = '123';
        const mockError = new Error('Database error');
        
        dbQueryStub.yields(mockError, null);

        try {
            await getStaffByDepartmentId(mockDeptId);
            throw new Error('Test failed - should have thrown an error');
        } catch (error) {
            expect(error).to.equal(mockError);
            expect(dbQueryStub.calledOnce).to.be.true;
        }
    });

    it('should resolve with an empty array if no staff found for the given dept_id', async () => {
        const mockDeptId = '999';
        const mockResult = [];
        
        dbQueryStub.yields(null, mockResult);

        const result = await getStaffByDepartmentId(mockDeptId);

        expect(result).to.deep.equal([]);
        expect(dbQueryStub.calledOnce).to.be.true;
    });
});


describe('getDepartmentByStaffId', () => {
    let dbQueryStub;

    beforeEach(() => {
        // Stub the db.query function
        dbQueryStub = sinon.stub(db, 'query');
    });

    afterEach(() => {
        // Restore the original function after each test
        dbQueryStub.restore();
    });

    it('should resolve with department data for a valid staff_id', async () => {
        const mockStaffId = '2';
        const mockDepartmentData = {
            dept_id: '2',
            Dept_Name: 'Department of Computer Science and Engineering'
        };
        
        dbQueryStub.yields(null, [mockDepartmentData]);

        const result = await getDepartmentByStaffId(mockStaffId);

        expect(result).to.deep.equal(mockDepartmentData);
        expect(dbQueryStub.calledOnce).to.be.true;

        // Use regular expression to match essential parts of the SQL query, allowing whitespace variation
        expect(dbQueryStub.firstCall.args[0]).to.match(/SELECT\s+Department\.\*\s+FROM\s+Staff\s+INNER\s+JOIN\s+Department/);
        expect(dbQueryStub.firstCall.args[1]).to.deep.equal([mockStaffId]);
    });

    it('should resolve with null if no department is found for the given staff_id', async () => {
        const mockStaffId = '999';
        
        dbQueryStub.yields(null, []);

        const result = await getDepartmentByStaffId(mockStaffId);

        expect(result).to.be.null;
        expect(dbQueryStub.calledOnce).to.be.true;
        expect(dbQueryStub.firstCall.args[1]).to.deep.equal([mockStaffId]);
    });

    it('should reject with an error if the query fails', async () => {
        const mockStaffId = '1';
        const mockError = new Error('Database error');
        
        dbQueryStub.yields(mockError, null);

        try {
            await getDepartmentByStaffId(mockStaffId);
            throw new Error('Test failed - expected function to throw an error');
        } catch (error) {
            expect(error).to.equal(mockError);
            expect(dbQueryStub.calledOnce).to.be.true;
        }
    });
});