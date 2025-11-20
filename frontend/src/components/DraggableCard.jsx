import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { FaPencilAlt } from "react-icons/fa";

const DraggableCard = ({ task, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task._id,
      data: { lane: task.status },
    });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: "#fff",
    padding: "0.75rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid #e0e0e0",
    cursor: "default", // not whole-card grab anymore
    transition: "box-shadow 0.2s ease",
    position: "relative",
  };

  const handleStyle = {
    position: "absolute",
    left: "8px",
    top: "8px",
    width: "16px",
    height: "16px",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Drag handle only */}
      <div {...listeners} {...attributes} style={handleStyle} aria-label="Drag handle" />

      <h4 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{task.name}</h4>
      <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
        {task.description}
      </p>
      {task.dueDate && (
        <p style={{ fontSize: "0.8rem", color: "#555" }}>
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      {/* Pencil icon opens modal */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onEdit(task);
        }}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <FaPencilAlt size={16} color="#555" />
      </button>
    </div>
  );
};

export default DraggableCard;
