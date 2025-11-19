import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import PrimaryButton from "../components/PrimaryButton";
import MyTasksStyle from "../styles/MyTasksStyle";
import api from "../api";
import { useProject } from "../context/ProjectContext";
import ModalWrapper from "../components/ModalWrapper";
import AddNewTaskModal from "../screens/AddNewTask";
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
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

const swimlanes = ["Not Started", "In Progress", "Under Review", "Done"];

const Swimlane = ({ lane, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: lane,
    data: { lane },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        ...MyTasksStyle.swimlane,
        backgroundColor: isOver ? "#f0f8ff" : MyTasksStyle.swimlane.backgroundColor,
        transition: "background-color 0.2s ease",
      }}
    >
      <h3 style={MyTasksStyle.swimlaneTitle}>{lane}</h3>
      {children}
    </div>
  );
};

const MyTasks = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const { selectedProject } = useProject();
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (!selectedProject?._id) {
      navigate("/home");
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await api.get(`/api/task/${selectedProject._id}`);
        setTasks(res.data || []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchTasks();
  }, [selectedProject, navigate]);

  const getTasksByStatus = (lane) =>
    tasks.filter((task) => task.status === lane);

  const handleDragStart = (event) => {
    setActiveTaskId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTaskId(null);

    if (!over) return;

    const draggedTask = tasks.find((t) => t._id === active.id);

    // Determine new lane: either from card drop or lane drop
    const newStatus =
      over.data?.current?.lane || swimlanes.find((lane) => lane === over.id);

    if (!newStatus || draggedTask.status === newStatus) return;

    try {
      await api.put(`/api/task/update/${active.id}`, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) =>
          t._id === active.id ? { ...t, status: newStatus } : t
        )
      );
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  return (
    <div style={MyTasksStyle.container}>
      <TopNavBar />
      <div style={MyTasksStyle.layout}>
        <Sidebar />

        <main style={MyTasksStyle.main}>
          <div style={MyTasksStyle.header}>
            <h2>My Tasks ({selectedProject?.name})</h2>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <PrimaryButton
                text="Add Task"
                onClick={() => setShowModal(true)}
              />
              <ProfileCircle size={48} />
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
                <SortableContext
                  key={lane}
                  items={getTasksByStatus(lane).map((t) => t._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Swimlane lane={lane}>
                    {getTasksByStatus(lane).length === 0 && (
                      <p style={{ fontStyle: "italic", opacity: 0.6 }}>
                        No tasks yet
                      </p>
                    )}
                    {getTasksByStatus(lane).map((task) => (
                      <DraggableCard key={task._id} task={task} />
                    ))}
                  </Swimlane>
                </SortableContext>
              ))}
            </div>
          </DndContext>

          {showModal && (
            <ModalWrapper onClose={() => setShowModal(false)}>
              <AddNewTaskModal
                onClose={() => setShowModal(false)}
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
        </main>
      </div>
    </div>
  );
};

export default MyTasks;
