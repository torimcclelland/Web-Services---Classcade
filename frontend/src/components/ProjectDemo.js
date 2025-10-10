import React, { useState } from "react";
import api from "../api";

export default function ProjectDemo() {
  const [name, setName] = useState("");
  const [projects, setProjects] = useState([]);

  const createProject = async () => {
    await api.post("/api/project/create", { name, goalTime: Date.now() });
    getProjects();
  };

  const getProjects = async () => {
    const res = await api.get("/api/project");
    setProjects(res.data);
  };

  return (
    <div>
      <h2>Project Demo</h2>
      <input
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={createProject}>Create</button>
      <button onClick={getProjects}>Load All</button>

      <ul>
        {projects.map((p) => (
          <li key={p._id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}