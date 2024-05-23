import React, { useState, useEffect } from 'react'; // 將 React 匯入到文件中
import Tasks from "./Tasks";
import axios from 'axios';
export default function SelectedProject({
  project,
  onDelete,
  onAddTask,
  onDeleteTask,
}) {
  const projectId = project ? project.id : null;
  // 定義獲取任務數據的函數
  async function handleTake() {
    try {
      // 获取项目数据
      const taskResponse = await fetch(`https://noteproject-aed31807af45.herokuapp.com/api/list/projectAndTaskFind/${projectId}`);
      if (!taskResponse.ok) {
        throw new Error('Failed to fetch projects');
      }
      const taskData = await taskResponse.json();

      // 检查项目数据是否存在
      if (!taskData || !Array.isArray(taskData)) {
        throw new Error('Project data is not valid');
      }
      // 將獲取的任務數據傳遞給 Tasks 組件
      setTasks(taskData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // 定義添加任務的函數
  async function handleAddTaskAndUpdate(text) {
    await onAddTask(text); // 調用添加任務的回調函數
    setTimeout(() => {
    handleTake(); // 重新獲取任務數據
  }, 500); // 在0.01秒後執行 handleTake
  }

  async function handleDeleteTaskAndUpdate(id) {
  await onDeleteTask(id); // 調用刪除任務的回調函數
  setTimeout(() => {
    handleTake(); // 重新獲取任務數據
  }, 500); // 在0.01秒後執行 handleTake
}


  // 初始化任務數據的狀態
  const [tasks, setTasks] = React.useState([]);

  // 調用 handleTake 函數獲取任務數據
  React.useEffect(() => {
    handleTake();
  }, [projectId]);

  const formattedDate = project ? new Date(project.dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }) : "";

  return (
    <div className="w-[35rem] mt-16">
      {project && (
        <header style={{padding:".5rem"}} className="pb-4 mb-4 border-b-2 border-stone-300">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-stone-600 mb-2">
              {project.title}
            </h1>
            <button
              className="text-stone-600 hover:text-stone-950"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
          <p className="mb-4 text-stone-400">{formattedDate}</p>
          <p className="text-stone-600 whitespace-pre-wrap">
            {project.description}
          </p>
        </header>
      )}
      {project && (
        <Tasks tasks={tasks} onAdd={handleAddTaskAndUpdate} onDelete={handleDeleteTaskAndUpdate}/>
      )}
    </div>
  );
}

