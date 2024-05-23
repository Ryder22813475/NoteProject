const mongoose = require("mongoose");
const { Schema } = mongoose;

const TaskDataSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'ListData' // 可选：如果 projectId 是 ListData 集合中文档的 _id，则可以设置 ref 以建立关联
  },
  text: String,
});

module.exports = mongoose.model('TaskData', TaskDataSchema);
