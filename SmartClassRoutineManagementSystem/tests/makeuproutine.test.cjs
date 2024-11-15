const assert = require('chai').assert;
const sinon = require('sinon');
const MakeupScheduleController = require('../controllers/makeuproutinegeneratorcontroller');
const MakeupScheduleModel = require('../models/makeupclassRoutineModel');

describe('MakeupScheduleController', function () {

  let req, res;

  beforeEach(() => {
    req = {
      body: {
        courseName: 'Mathematics',
        teacherName: 'John Doe',
        preferredTimes: [{ start: '09:00', end: '10:00' }],
        preferredDays: ['Monday'],
        preferredRoom: '101'
      }
    };
    
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
  });

  it('Should generate makeup schedule successfully', async function () {
    // Mock response from the model
    sinon.stub(MakeupScheduleModel, 'getClassesNeeded').returns(2);
    sinon.stub(MakeupScheduleModel, 'getCourseTypeByCourseName').returns('Theory');

    await MakeupScheduleController.generateMakeupSchedule(req, res);
    
    assert.isTrue(res.status.calledWith(200));
    assert.isTrue(res.json.calledWithMatch({
      message: 'Makeup schedule generated successfully'
    }));

    // Restore stub
    MakeupScheduleModel.getClassesNeeded.restore();
    MakeupScheduleModel.getCourseTypeByCourseName.restore();
  });

  it('No preferred days provided, defaults to all weekdays and preferred room is not specified', async function () {
    req.body.preferredDays = [];
    req.body.preferredRoom = null;

    sinon.stub(MakeupScheduleModel, 'getClassesNeeded').returns(2);
    sinon.stub(MakeupScheduleModel, 'getCourseTypeByCourseName').returns('Theory');

    await MakeupScheduleController.generateMakeupSchedule(req, res);

    assert.isTrue(res.status.calledWith(200));
    assert.isTrue(res.json.calledWithMatch({
      message: 'Makeup schedule generated successfully'
    }));

    // Restore stub
    MakeupScheduleModel.getClassesNeeded.restore();
    MakeupScheduleModel.getCourseTypeByCourseName.restore();
  });

  it('No makeup classes needed, preferred room, time, days are not specified', async function () {
    req.body.preferredDays = [];
    req.body.preferredRoom = null;

    sinon.stub(MakeupScheduleModel, 'getClassesNeeded').returns(0);

    await MakeupScheduleController.generateMakeupSchedule(req, res);

    assert.isTrue(res.status.calledWith(200));
    assert.isTrue(res.json.calledWithMatch({
      message: 'No makeup classes needed'
    }));

    // Restore stub
    MakeupScheduleModel.getClassesNeeded.restore();
  });

  it('Classes needed not found, routine cannot be generated', async function () {
    req.body.courseName = 'Unknown Course';

    sinon.stub(MakeupScheduleModel, 'getClassesNeeded').returns('error');
    sinon.stub(MakeupScheduleModel, 'getCourseTypeByCourseName').returns(null);

    await MakeupScheduleController.generateMakeupSchedule(req, res);

    assert.isTrue(res.status.calledWith(400));
    assert.isTrue(res.json.calledWithMatch({
      message: 'Routine cannot be generated as classesNeeded is not found'
    }));

    // Restore stub
    MakeupScheduleModel.getClassesNeeded.restore();
    MakeupScheduleModel.getCourseTypeByCourseName.restore();
  });

  it('Invalid preferred days provided, schedule cannot be generated', async function () {
    req.body.preferredDays = ['Friday'];

    sinon.stub(MakeupScheduleModel, 'getClassesNeeded').returns(2);
    sinon.stub(MakeupScheduleModel, 'getCourseTypeByCourseName').returns('Theory');

    await MakeupScheduleController.generateMakeupSchedule(req, res);

    assert.isTrue(res.status.calledWith(400));
    assert.isTrue(res.json.calledWithMatch({
      message: 'Invalid preferred day(s) provided'
    }));

    // Restore stub
    MakeupScheduleModel.getClassesNeeded.restore();
    MakeupScheduleModel.getCourseTypeByCourseName.restore();
  });

  it('Invalid preferred times provided, schedule cannot be generated', async function () {
    req.body.preferredTimes = [{ start: '09:00', end: '' }];

    sinon.stub(MakeupScheduleModel, 'getClassesNeeded').returns(2);
    sinon.stub(MakeupScheduleModel, 'getCourseTypeByCourseName').returns('Theory');

    await MakeupScheduleController.generateMakeupSchedule(req, res);

    assert.isTrue(res.status.calledWith(400));
    assert.isTrue(res.json.calledWithMatch({
      message: 'Invalid preferred time(s)'
    }));

    // Restore stub
    MakeupScheduleModel.getClassesNeeded.restore();
    MakeupScheduleModel.getCourseTypeByCourseName.restore();
  });

});
