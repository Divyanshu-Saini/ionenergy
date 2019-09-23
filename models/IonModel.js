//importing mongoose
const mongoose = require('mongoose');

//initialising mongoose model
const Scheme = mongoose.Schema;
const IonSchema = new Scheme({
    ts:Date,
    month:Number,
    year:Number,
    val:Number
});

//exporting model
module.exports = mongoose.model('IonDoc', IonSchema);