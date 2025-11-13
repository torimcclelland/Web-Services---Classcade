import React from "react";
import { useDraggable } from "@dnd-kit/core";

const DraggableCard = ({ task }) => {
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
    cursor: "grab",
    transition: "box-shadow 0.2s ease",

  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <h4 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{task.name}</h4>
      <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
        {task.description}
      </p>
      {task.dueDate && (
        <p style={{ fontSize: "0.8rem", color: "#555" }}>
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default DraggableCard;
