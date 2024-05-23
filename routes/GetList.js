const List = require('../model').list;
const Task = require('../model').task;

router.use((req, res, next) => {
  console.log("正在接收一個跟auth有關的請求");
  next();
});

router.get('/projectFind', async (req, res) => {
    try {
      const data = await List.find();
      res.json(data); 
      console.log(JSON.stringify(data))
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.get('/projectAndTaskFind/:projectId', async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const tasks = await Task.find({ projectId: projectId });
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.post('projectPost', async (req, res) => {
    try {
      const { title, description, dueDate } = req.body;
      // 创建新的列表实例
      const newList = new List({
        title,
        description,
        dueDate,
      });
      // 将列表保存到数据库中
      await newList.save();
      // 返回成功的响应
      res.status(201).json({ message: 'List created successfully', list: newList });
    } catch (error) {
      // 处理错误
      console.error('Error creating list:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.delete('projectDelete/:projectId', async (req, res) => {
    const projectId = req.params.projectId;
    try {
      const deletedProject = await List.findByIdAndDelete(projectId);
      if (!deletedProject) {
        return res.status(404).send('Project not found');
      }
      res.send('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.delete('taskDelete/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    try {
      const deletedtask = await Task.findByIdAndDelete(taskId);
      if (!deletedtask) {
        return res.status(404).send('Project not found');
      }
      res.send('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  router.post('taskPost', async (req, res) => {
    try {
      const { projectId, text } = req.body;
      
      // 将 projectId 转换为字符串，然后再转换为 ObjectId
      const projectIdString = String(projectId);
      console.log(projectIdString);
      const projectIdObjectId = new ObjectId(projectIdString);

      // 创建新的任务实例
      const newTask = new Task({
        projectId: projectIdObjectId,
        text
      });

      // 将任务保存到数据库中
      await newTask.save();
      res.status(201).json({ message: 'Task created successfully', taskId: newTask._id });
    } catch (error) {
      // 处理错误
      console.error('Error creating task:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  module.exports = router;

