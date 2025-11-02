import { createContext, useContext, useState, useEffect } from "react";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedProject")) || null;
  });

  useEffect(() => {
    if (currentProject) {
      localStorage.setItem("selectedProject", JSON.stringify(currentProject));
    } else {
      localStorage.removeItem("selectedProject");
    }
  }, [currentProject]);

  return (
    <ProjectContext.Provider value={{ currentProject, setCurrentProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return ctx;
};