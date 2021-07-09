const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const EventSchema = new Schema({
    block: {type: Schema.Types.ObjectId, ref: 'Block'},
    time: {type: Date},
    hourIndex: {type: Number},
    dayIndex: {type: Number},
    userId: {type: String, ref: 'User'},
    general: {type: Boolean, default: true}
})

const Event = mongoose.model('Event', EventSchema);


module.exports = Event;
