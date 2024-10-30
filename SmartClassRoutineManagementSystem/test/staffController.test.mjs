// staffController.test.mjs or ensure package.json has "type": "module"
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { uploadStaffAsXML } from '../controllers/staffController.js';
import db from '../config/db.js'; // Ensure paths match

const { expect } = chai;
chai.use(sinonChai);

describe('Staff Controller Tests', () => {
    afterEach(() => {
        sinon.restore(); // Reset sinon mocks after each test
    });

    it('should respond with success on valid XML upload', async () => {
        const req = {
            body: '<root><row><staff_id>1</staff_id><Name>Amzad Bhai</Name><Role>Clerk</Role><dept_id>2</dept_id><password>1234</password><Phone>01864852588</Phone></row></root>'
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
