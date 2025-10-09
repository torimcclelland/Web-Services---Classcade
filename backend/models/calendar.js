
// calendar.js 
// has decision helper depending on if it's outlook or google calendar

class CalendarModel {
  constructor() { // depending if the user signed in with google or outlook
    this.googleEvents = {};  
    this.outlookEvents = {}; 
  }

  // choosing provider
  #getStore(provider) { // --> #getStore syntax means it's a helper (makes decision between google calendar and outlook)
    switch (provider) {
      case 'google':
        return this.googleEvents;
      case 'outlook':
        return this.outlookEvents;
      default:
        throw new Error(`Invalid provider: ${provider}`);
    }
  }

  // add calendar events, based on provider
  addEvent(provider, userId, event) {
    const store = this.#getStore(provider);
    store[userId] = store[userId] || [];
    store[userId].push(event);
    return event;
  }

  // get calender events, based on provider
  getEvents(provider, userId) {
    const store = this.#getStore(provider);
    return store[userId] || [];
  }


  // update calendar events, based on provider 
  updateEvent(provider, userId, eventId, updatedEvent) {
    const store = this.#getStore(provider);
    const userEvents = store[userId];
    if (!userEvents) return null;

    const index = userEvents.findIndex(e => e.id === eventId);
    if (index === -1) return null;

    userEvents[index] = updatedEvent;
    return updatedEvent;
  }


  // remove calendar, based on provider
  removeUserCalendar(provider, userId) {
    const store = this.#getStore(provider);
    if (store[userId]) {
      delete store[userId];
      return true;
    }
    return false;
  }
}

module.exports = new CalendarModel();

