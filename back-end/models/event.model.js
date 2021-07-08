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

// BlockSchema.post('findOneAndUpdate', function(doc, next) {
//   recursive_reference(this._update, "children")
//   console.log(this._update["children"]);
//   next();
// });
//create model
const Event = mongoose.model('Event', EventSchema);


module.exports = Event;
