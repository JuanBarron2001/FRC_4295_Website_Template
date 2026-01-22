// Calendar functionality for Hudson Stingers Robotics
// Requires: FullCalendar library and events data

let currentFilter = 'all';
let calendar;

// Initialize FullCalendar
document.addEventListener('DOMContentLoaded', function() {
  // Check if calendar element exists
  const calendarEl = document.getElementById('fullcalendar');
  if (!calendarEl) return;

  // Get events data from the page
  const eventsData = window.calendarEventsData || [];
  
  // Transform events for FullCalendar
  const calendarEvents = eventsData.map(event => {
    const classNames = [`fc-event-${event.type}`];
    if (event.canceled) {
      classNames.push('fc-event-canceled');
    }
    
    return {
      title: event.title,
      start: event.date,
      end: event.endDate || event.date,
      allDay: true,
      extendedProps: {
        type: event.type,
        location: event.location,
        time: event.time,
        description: event.description,
        icon: event.icon,
        canceled: event.canceled || false
      },
      classNames: classNames
    };
  });

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    events: calendarEvents,
    eventClick: function(info) {
      // Scroll to event in list view
      switchView('list');
      setTimeout(() => {
        const eventCard = Array.from(document.querySelectorAll('.event-card'))
          .find(card => card.querySelector('h3').textContent.includes(info.event.title));
        if (eventCard) {
          eventCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          eventCard.classList.add('ring-2', 'ring-tech');
          setTimeout(() => eventCard.classList.remove('ring-2', 'ring-tech'), 2000);
        }
      }, 300);
    },
    height: 'auto',
    contentHeight: 'auto',
    aspectRatio: 1.8
  });
  
  calendar.render();
});

/**
 * Switch between calendar and list view
 * @param {string} view - 'calendar' or 'list'
 */
function switchView(view) {
  const calendarView = document.getElementById('calendar-view');
  const listView = document.getElementById('list-view');
  const calendarBtn = document.getElementById('calendar-view-btn');
  const listBtn = document.getElementById('list-view-btn');
  
  if (view === 'calendar') {
    calendarView.classList.remove('hidden');
    listView.classList.add('hidden');
    calendarBtn.classList.add('bg-tech', 'text-white');
    calendarBtn.classList.remove('text-gray-300');
    listBtn.classList.remove('bg-tech', 'text-white');
    listBtn.classList.add('text-gray-300');
  } else {
    calendarView.classList.add('hidden');
    listView.classList.remove('hidden');
    listBtn.classList.add('bg-tech', 'text-white');
    listBtn.classList.remove('text-gray-300');
    calendarBtn.classList.remove('bg-tech', 'text-white');
    calendarBtn.classList.add('text-gray-300');
  }
}

/**
 * Filter events by type
 * @param {string} type - Event type filter ('all', 'competition', 'meeting', 'workshop', 'outreach', 'holiday')
 */
function filterEvents(type) {
  currentFilter = type;
  const cards = document.querySelectorAll('.event-card');
  const noEventsMsg = document.getElementById('no-events');
  const filterBtns = document.querySelectorAll('.filter-btn');
  let visibleCount = 0;

  // Update button states
  filterBtns.forEach(btn => {
    if (btn.dataset.filter === type) {
      btn.classList.add('active', 'bg-tech', 'text-white');
      btn.classList.remove('bg-gray-800', 'text-gray-300');
    } else {
      btn.classList.remove('active', 'bg-tech', 'text-white');
      btn.classList.add('bg-gray-800', 'text-gray-300');
    }
  });

  // Filter cards in list view
  cards.forEach(card => {
    if (type === 'all' || card.dataset.type === type) {
      card.style.display = 'block';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Filter events in calendar view
  if (calendar) {
    calendar.getEvents().forEach(event => {
      const eventType = event.extendedProps.type;
      if (type === 'all' || eventType === type) {
        event.setProp('display', 'auto');
      } else {
        event.setProp('display', 'none');
      }
    });
  }

  // Show/hide empty state
  if (visibleCount === 0) {
    noEventsMsg?.classList.remove('hidden');
  } else {
    noEventsMsg?.classList.add('hidden');
  }
}
