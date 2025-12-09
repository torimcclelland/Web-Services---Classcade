import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";
import MyTasksStyle from "../styles/MyTasksStyle";
import api from "../api";
import { useProject } from "../context/ProjectContext";
import { useUser } from "../context/UserContext";
import ModalWrapper from "../components/ModalWrapper";
import AddNewTaskModal from "../screens/AddNewTask"; // unified add/edit modal
import DraggableCard from "../components/DraggableCard";
import TopNavBar from "../components/TopNavBar";
import Sidebar from "../components/Sidebar";
import ProfileCircle from "../components/ProfileCircle";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import SecondaryButton from "../components/SecondaryButton";

const swimlanes = ["Not Started", "In Progress", "Under Review", "Done"];

const Swimlane = ({ lane, children, onClearCompleted, showClearButton }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: lane,
    data: { lane },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        ...MyTasksStyle.swimlane,
        backgroundColor: isOver
          ? "#f5f5f5"
          : MyTasksStyle.swimlane.backgroundColor,
        transition: "background-color 0.2s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3 style={{ ...MyTasksStyle.swimlaneTitle, marginBottom: 0 }}>
          {lane}
        </h3>
        {showClearButton && (
          <button
            onClick={onClearCompleted}
            style={{
              padding: "0.35rem 0.75rem",
              fontSize: "0.8rem",
              backgroundColor: "#1e3a8a",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Clear All
          </button>
        )}
      </div>
      <div style={MyTasksStyle.swimlaneContent}>{children}</div>
    </div>
  );
};

const MyTasks = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [members, setMembers] = useState([]);
  const { selectedProject, loadingProject } = useProject();
  const { user } = useUser();
  const sensors = useSensors(useSensor(PointerSensor));
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const memberLookup = useMemo(() => {
    const map = {};
    members.forEach((m) => {
      map[m._id] = m;
    });
    return map;
  }, [members]);

  useEffect(() => {
    if (loadingProject) return;
    if (!selectedProject?._id) {
      navigate("/home");
      return;
    }

    const fetchTasksAndMembers = async () => {
      try {
        const res = await api.get(`/api/task/${selectedProject._id}`);
        setTasks(res.data || []);

        const membersRes = await api.get(
          `/api/project/${selectedProject._id}/members`
        );
        setMembers(membersRes.data || []);
      } catch (err) {
        console.error("Failed to fetch tasks/members:", err);
      }
    };

    fetchTasksAndMembers();
  }, [selectedProject, navigate, loadingProject]);

  const filteredTasks = useMemo(() => {
    let base = tasks;

    if (filter === "pastDue") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      base = base.filter((t) => {
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        if (Number.isNaN(due.getTime())) return false;
        return due < today && t.status !== "Done";
      });
    }

    if (priorityFilter !== "all") {
      base = base.filter((t) => (t.priority || "Medium") === priorityFilter);
    }

    if (assigneeFilter === "unassigned") {
      base = base.filter(
        (t) => !t.assignedTo || !(t.assignedTo?._id || t.assignedTo)
      );
    } else if (assigneeFilter !== "all") {
      base = base.filter(
        (t) =>
          (t.assignedTo?._id || t.assignedTo)?.toString() === assigneeFilter
      );
    }

    return base;
  }, [assigneeFilter, filter, priorityFilter, tasks, user?._id]);

  const getTasksByStatus = (lane) =>
    filteredTasks.filter((task) => task.status === lane);

  const handleDragStart = (event) => {
    setActiveTaskId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTaskId(null);

    if (!over) return;

    const draggedTask = tasks.find((t) => t._id === active.id);

    // Check if dropping directly on a swimlane or on the swimlane's ID
    let newStatus = null;
    if (swimlanes.includes(over.id)) {
      newStatus = over.id;
    } else if (over.data?.current?.lane) {
      newStatus = over.data.current.lane;
    }

    if (!newStatus || !draggedTask || draggedTask.status === newStatus) return;

    const timestamp = Date.now();

    //optimistic update - move to bottom of new lane
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t._id === active.id
          ? { ...t, status: newStatus, movedAt: timestamp }
          : t
      );

      // Sort so moved task appears at bottom of its new lane
      return updated.sort((a, b) => {
        if (a.status !== b.status) return 0;
        if (a._id === active.id) return 1;
        if (b._id === active.id) return -1;
        return (a.movedAt || 0) - (b.movedAt || 0);
      });
    });

    try {
      await api.put(`/api/task/${selectedProject._id}/${active.id}`, {
        status: newStatus,
      });
    } catch (err) {
      console.error("Failed to update task status:", err);
      // Revert optimistic update on error
      const res = await api.get(`/api/task/${selectedProject._id}`);
      setTasks(res.data || []);
    }
  };

  //explicit edit handler
  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleClearCompleted = async () => {
    const completedTasks = tasks.filter((t) => t.status === "Done");

    try {
      // Delete all completed tasks
      await Promise.all(
        completedTasks.map((task) =>
          api.delete(`/api/task/${selectedProject._id}/${task._id}`)
        )
      );

      // Refresh task list
      const res = await api.get(`/api/task/${selectedProject._id}`);
      setTasks(res.data || []);
    } catch (err) {
      console.error("Failed to clear completed tasks:", err);
    }
    setShowClearConfirm(false);
  };

  return (
    <div style={MyTasksStyle.container}>
      <TopNavBar />
      <div style={MyTasksStyle.layout}>
        <Sidebar />

        <main style={MyTasksStyle.main}>
          <div style={MyTasksStyle.header}>
            <h2>Tasks ({selectedProject?.name})</h2>

            <div style={MyTasksStyle.headerShift}>
              {[
                { key: "all", label: "All tasks" },
                { key: "pastDue", label: "Past due" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setFilter(opt.key)}
                  style={{
                    padding: "8px 12px",
                    height: 38,
                    borderRadius: 8,
                    border:
                      filter === opt.key
                        ? "1px solid #1e3a8a"
                        : "1px solid #d1d5db",
                    backgroundColor: filter === opt.key ? "#e0ecff" : "#fff",
                    color: "#0f172a",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {opt.label}
                </button>
              ))}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                style={{
                  padding: "8px 34px 8px 12px",
                  height: 38,
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  backgroundColor: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <option value="all">All priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                style={{
                  padding: "8px 34px 8px 12px",
                  height: 38,
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  backgroundColor: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <option value="all">All assignees</option>
                <option value="unassigned">Unassigned</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {(m.firstName || m.lastName
                      ? `${m.firstName || ""} ${m.lastName || ""}`.trim()
                      : m.username) ||
                      m.email ||
                      "Member"}
                  </option>
                ))}
              </select>
              <PrimaryButton
                text="Add Task"
                onClick={() => {
                  setEditingTask(null);
                  setShowModal(true);
                }}
              />
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
          >
            <div style={MyTasksStyle.swimlaneContainer}>
              {swimlanes.map((lane) => (
                <Swimlane
                  key={lane}
                  lane={lane}
                  onClearCompleted={() => setShowClearConfirm(true)}
                  showClearButton={
                    lane === "Done" && getTasksByStatus("Done").length > 0
                  }
                >
                  {getTasksByStatus(lane).length === 0 && (
                    <p style={{ fontStyle: "italic", opacity: 0.6 }}>
                      No tasks yet
                    </p>
                  )}
                  {getTasksByStatus(lane).map((task) => (
                    <DraggableCard
                      key={task._id}
                      task={task}
                      memberLookup={memberLookup}
                      onEdit={handleEdit}
                    />
                  ))}
                </Swimlane>
              ))}
            </div>
          </DndContext>

          {showModal && (
            <ModalWrapper
              onClose={() => {
                setShowModal(false);
                setEditingTask(null);
              }}
            >
              <AddNewTaskModal
                task={editingTask} //passing the existing task to edit
                onClose={() => {
                  setShowModal(false);
                  setEditingTask(null);
                }}
                onSuccess={async () => {
                  try {
                    const res = await api.get(
                      `/api/task/${selectedProject._id}`
                    );
                    setTasks(res.data || []);
                  } catch (err) {
                    console.error("Failed to refresh tasks:", err);
                  }
                }}
              />
            </ModalWrapper>
          )}

          {showClearConfirm && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
              }}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "2rem",
                  maxWidth: "400px",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>
                  Clear All Completed Tasks?
                </h3>
                <p style={{ marginBottom: "1.5rem", color: "#374151" }}>
                  Are you sure you want to delete all{" "}
                  {tasks.filter((t) => t.status === "Done").length} completed
                  task(s)? This action cannot be undone.
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.75rem",
                  }}
                >
                  <PrimaryButton
                    text="Cancel"
                    onClick={() => setShowClearConfirm(false)}
                  />
                  <SecondaryButton
                    text="Delete All"
                    onClick={handleClearCompleted}
                    style={{ backgroundColor: "#dc2626", color: "#fff" }}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyTasks;
