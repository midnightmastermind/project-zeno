const Event = require('../models/event.model');
const express = require("express");
const mongoose = require('mongoose');
// Display event of all events.
exports.events = function(req, res) {
    Event.find({})
        .populate({
            path: 'block',
        })
        .then(events => res.json(events))
        .catch(err => res.status(400).json('Error: ' + err));
};

// Display detail page for a specific event.
exports.event_detail = function(req, res) {
    Event.findById(req.params.id)
        .then(event => res.json(event))
        .catch(err => res.status(400).json('Error: ' + err));
};

// Display event create form on GET.
exports.event_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: event create GET');
};

// Handle event create on POST.
exports.event_create_post = function(req, res) {
    const newEvent = new Event({
        ...req.body.element
    });
     newEvent.save().then(
         event =>Event.findById(event._id)
        .then(event => res.json(event))
        .catch(err => res.status(400).json('Error: ' + err)));
};

// Display event delete form on GET.
exports.event_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: event delete GET');
};

// Handle event delete on POST.
exports.event_delete_post = function(req, res) {
    Event.findByIdAndDelete(req.params.id)
        .then(() => res.json('Event deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
};

// Display event update form on GET.
exports.event_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: event update GET');
};

// Handle event update on POST.
exports.event_update_post = function(req, res) {
    Event.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), {...req.body}, {new: true})
        .then(event => res.json(event))
        .catch(err => res.status(400).json('Error: ' + err));
};

// Handle event update on POST.
exports.events_update = function(req, res) {
    const updatedEvent = req.body;
    res.status(200);
};
