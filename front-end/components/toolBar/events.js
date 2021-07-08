const router = require('express').Router();
const event_controller = require('../controllers/event.controller');


// GET request for creating event. NOTE This must come before route for id (i.e. display event).
router.get('/create', event_controller.event_create_get);

// POST request for creating event.
router.post('/create', event_controller.event_create_post);
// POST request to update all events.
router.post('/update', event_controller.events_update);

// GET request to delete event.
router.get('/:id/delete', event_controller.event_delete_get);

// POST request to delete event.
router.post('/:id/delete', event_controller.event_delete_post);

// GET request to update event.
router.get('/:id/update', event_controller.event_update_get);

// POST request to update events
router.post('/:id/update', event_controller.event_update_post);

// GET request for one event.
router.get('/:id', event_controller.event_detail);


// GET request for list of all events.
router.get('/', event_controller.events);

module.exports = router;
