const mongoose = require("mongoose");
const { Schema } = mongoose;

const ListDataSchema = new Schema({
  title: String,
  description: String,
  dueDate: Date,
});

module.exports = mongoose.model('ListData', ListDataSchema);
