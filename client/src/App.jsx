import { useState, useEffect } from 'react';
import axios from 'axios';
import NoProjectSelected from "./components/NoProjectSelected.jsx";
import ProjectsSidebar from "./components/ProjectsSidebar.jsx";
import SelectedProject from "./components/SelectedProject.jsx";
import NewProject from "./components/NewProject.jsx";

function App() {
  const [projectsState, setProjectsState] = useState({
    selectedProjectId: null, 
    projects: [], 
  });

  useEffect(() => {
    async function fetchProjectsAndTasks() {
      try {
        // 获取项目数据
        const projectResponse = await fetch('http://localhost:3000/api/projectFind');
        if (!projectResponse.ok) {
          throw new Error('Failed to fetch projects');
        }
        const projectData = await projectResponse.json();
        console.log("客戶端物件:" + JSON.stringify(projectData));

        // 检查项目数据是否存在
        if (!projectData || !Array.isArray(projectData)) {
          throw new Error('Project data is not valid');
        }
    
        // 更新项目数据
        const extractedProjects = projectData.map(project => ({
          id: project._id,
          title: project.title,
          description: project.description,
          dueDate: project.dueDate,
        }));

        // 更新状态
        setProjectsState({
          selectedProjectId: projectsState.selectedProjectId,
          projects: extractedProjects,
        });
        console.log(extractedProjects);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchProjectsAndTasks();
  }, []);

  async function deleteProject(projectId) {
    return fetch(`http://localhost:3000/api/projectDelete/${projectId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      // 在成功删除项目后执行的操作，例如更新UI等
      console.log('Project deleted successfully');
    })
    .catch(error => {
      // 在删除项目时发生错误时执行的操作
      console.error('Error deleting project:', error);
      throw error; // 将错误向上抛出，以便在调用方处理
    });
  }
  function handleDeleteProject() {
    const projectIdToDelete = projectsState.selectedProjectId;
    deleteProject(projectIdToDelete)
      .then(() => {
        setProjectsState(prevState => ({
          ...prevState,
          selectedProjectId: undefined,
          projects: prevState.projects.filter(project => project.id !== projectIdToDelete)
        }));
      })
      .catch(error => {
        console.error('Error deleting project:', error);
      });
  }

  function handleSelectProject(id) {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: id,
      };
    });
  }
  function handleStartAddProject() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: null,
      };
    });
  }

  function handleCancelAddProject() {
    setProjectsState((prevState) => ({
      ...prevState,
      selectedProjectId: undefined,
    }));
  }

  // 創建
  function handleAddTask(text) {
    const newTask = {
      text: text,
      projectId: projectsState.selectedProjectId,
    };
    AddTask(newTask)
  }
  

  async function AddTask(task) {
    try {
      // 使用 axios 或其他适合的库向后端提交任务数据
      await axios.post('http://localhost:3000/api/taskPost', task);
      console.log('Task submitted successfully');
      // 成功提交任务后，您可能还需要更新状态或执行其他操作
    } catch (error) {
      console.error('Error submitting task:', error);
      // 在这里添加错误处理逻辑，例如显示错误消息给用户
    }
  }

  // 刪除
  function handleDeleteTask(_id) {
    DeleteTask(_id);
  }  
  async function DeleteTask(_id) {
    try {
      // 使用 axios 或其他适合的库向后端发送删除任务的请求
      console.log(_id);
      await axios.delete(`http://localhost:3000/api/taskDelete/${_id}`);
      console.log('Task deleted successfully');
      // 成功删除任务后，您可能还需要更新状态或执行其他操作
    } catch (error) {
      console.error('Error deleting task:', error);
      // 在这里添加错误处理逻辑，例如显示错误消息给用户
    }
  }
  return (
    <div className="App">
      <main className="h-screen my-8 flex gap-8">
        <ProjectsSidebar
          onStartAddProject={handleStartAddProject}
          projects={projectsState.projects}
          onSelectProject={handleSelectProject}
          selectedProjectId={projectsState.selectedProjectId}
        />
        {projectsState.selectedProjectId === undefined ? (
          <NoProjectSelected onStartAddProject={handleStartAddProject} />
        ) : (
          projectsState.projects.length > 0 ? (
            <SelectedProject
              project={
                projectsState.projects && projectsState.projects.length > 0
                  ? projectsState.projects.find(
                      (project) => project.id === projectsState.selectedProjectId
                    )
                  : null
              }
              onDelete={handleDeleteProject}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
          ) : (
            <div>Loading</div>
          )
        )}
        {projectsState.selectedProjectId === null && (
          <NewProject onAdd={handleStartAddProject} onCancel={handleCancelAddProject} />
        )}
      </main>
    </div>
  );
}

export default App;

