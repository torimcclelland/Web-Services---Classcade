import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { FaPencilAlt } from "react-icons/fa";

const DraggableCard = ({ task, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task._id,
      data: { lane: task.status },
    });

  const nodeRef = React.useRef(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    if (nodeRef.current && !isDragging) {
      const { width, height } = nodeRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, [isDragging, task]);

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.8 : 1,
    backgroundColor: "#fff",
    padding: "0.75rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    boxShadow: isDragging ? "0 8px 16px rgba(0,0,0,0.2)" : "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid #e0e0e0",
    cursor: isDragging ? "grabbing" : "grab",
    position: isDragging ? "fixed" : "relative",
    zIndex: isDragging ? 9999 : "auto",
    width: isDragging && dimensions.width ? `${dimensions.width}px` : "auto",
    height: isDragging && dimensions.height ? `${dimensions.height}px` : "auto",
    boxSizing: "border-box",
  };

  return (
    <div ref={(node) => {
      setNodeRef(node);
      nodeRef.current = node;
    }} style={style} {...listeners} {...attributes}>

      <h4 style={{ 
        fontWeight: 600, 
        marginBottom: "0.5rem",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        wordBreak: "break-word",
        paddingRight: "24px"
      }}>
        {task.name}
      </h4>
      <p style={{ 
        fontSize: "0.9rem", 
        marginBottom: "0.5rem",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        wordBreak: "break-word"
      }}>
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
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: "none",
          border: "none",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        <FaPencilAlt size={16} color="#555" />
      </button>
    </div>
  );
};

export default DraggableCard;
