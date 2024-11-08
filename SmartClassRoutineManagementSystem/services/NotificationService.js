// src/services/NotificationService.js

export const notifyRequester = (id, status) => {
    return `Notification sent to requester: The rescheduling request has been ${status}.`;
  };
  