import React, { useState } from "react";
import api from "../api";

export default function TaskDemo() {
  const [projectId, setProjectId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => {
    const res = await api.get(`/api/task/${projectId}`);
    setTasks(res.data);
  };

  const addTask = async () => {
    await api.post(`/api/task/${projectId}`, {
      name: taskName,
      description: "Demo description",
      assignedTo: "652e4b9a5f6d2a1b3c4d5e70",
    });
    getTasks();
  };

  const getReport = async () => {
    const res = await api.get(`/api/task/${projectId}/getreport`);
    alert(JSON.stringify(res.data, null, 2));
  };

  return (
    <div>
      <h2>Task Demo</h2>
      <input
        placeholder="Project ID"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
      />
      <input
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>
      <button onClick={getTasks}>Get Tasks</button>
      <button onClick={getReport}>Get Report</button>

      <ul>
        {tasks.map((t) => (
          <li key={t._id}>
            {t.name} - {t.completed ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
}