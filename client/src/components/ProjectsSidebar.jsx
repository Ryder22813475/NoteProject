import Button from "./Button";

export default function ProjectsSidebar({
  onStartAddProject,
  projects,
  onSelectProject,
  selectedProjectId,
}) {
  return (
    <aside className="md:w-1/3 px-8 py-16 bg-stone-900 text-stone-50  rounded-r-xl">
      <h2 className="mb-8 font-bold uppercase md:text-xl text-stone-200">
       EveryBody Projects
      </h2>
      <div>
        <Button onClick={onStartAddProject}>+ Add Project</Button>
      </div>
      <ul className="mt-8">
        {projects.length > 0 ? (
          projects.map((project, index) => {
            let cssClasses =
              "w-full text-left px-1 py-1 rounded-sm my-1 hover:text-stone-200 hover:bg-stone-800";

            if (project.id === selectedProjectId) {
              cssClasses += " bg-stone-800 text-stone-200";
            } else {
              cssClasses += " text-stone-400";
            }

            return (
              <li key={index}> {/* 使用项目的索引作为key属性的值 */}
                <button
                  className={cssClasses}
                  onClick={() => onSelectProject(project.id)}
                >
                  {project.title}
                </button>
              </li>
            );
          })
        ) : (
          <li>No projects found.</li>
        )}
      </ul>
    </aside>
  );
}
