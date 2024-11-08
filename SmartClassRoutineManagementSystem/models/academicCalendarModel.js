// models/academicCalendarModel.js

// Mock data source (replace with actual database queries)
const eventsData = [
    { eventName: "New Year", date: "2023-12-31", department: "General", eventType: "holiday" },
    { eventName: "Independence Day", date: "2024-07-04", department: "General", eventType: "holiday" },
    { eventName: "Science Fair", date: "2024-03-10", department: "Science", eventType: "activity" },
    // Add more sample data as needed
  ];
  
  const AcademicCalendarModel = {
    getGeneralEvents() {
      return eventsData.filter(event => event.eventType === "holiday");
    },
  
    getEventsByDepartment(department) {
      return eventsData.filter(event => event.department === department);
    },
  
    getEventsByMonth(month) {
      return eventsData.filter(event => new Date(event.date).getMonth() + 1 === parseInt(month));
    },
  
    getEventsByWeek(week) {
      // Example function for weekly events based on week number
      // This logic would need specific weekly date handling
      return eventsData.filter(event => new Date(event.date).getWeek() === parseInt(week));
    },
  
    getVacations(startDate, endDate) {
      return eventsData.filter(event => 
        event.eventType === "vacation" &&
        new Date(event.date) >= new Date(startDate) && 
        new Date(event.date) <= new Date(endDate)
      );
    },
  
    getActivities(startDate, endDate) {
      return eventsData.filter(event => 
        event.eventType === "activity" &&
        new Date(event.date) >= new Date(startDate) && 
        new Date(event.date) <= new Date(endDate)
      );
    },
  };
  
  module.exports = AcademicCalendarModel;
  