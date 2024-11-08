const AcademicCalendarModel = require('../models/academicCalendarModel');

const ViewAcademicCalendarController = {
  async getGeneralizedView() {
    return AcademicCalendarModel.getGeneralEvents();
  },

  async getEventsByDepartment(department) {
    return AcademicCalendarModel.getEventsByDepartment(department);
  },

  async getEventsByMonth(month) {
    return AcademicCalendarModel.getEventsByMonth(month);
  },

  async getEventsByWeek(week) {
    return AcademicCalendarModel.getEventsByWeek(week);
  },

  async getVacationsByDateRange(startDate, endDate) {
    return AcademicCalendarModel.getVacations(startDate, endDate);
  },

  async getActivitiesByDateRange(startDate, endDate) {
    return AcademicCalendarModel.getActivities(startDate, endDate);
  }
};

module.exports = ViewAcademicCalendarController;
