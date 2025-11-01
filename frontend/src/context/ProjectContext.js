import { createContext, useState, useEffect } from "react";

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState(
    () => JSON.parse(localStorage.getItem("selectedProject")) || null
  );

  useEffect(() => {
    localStorage.setItem("selectedProject", JSON.stringify(selectedProject));
  }, [selectedProject]);

  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </ProjectContext.Provider>
  );
};