import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { HiDotsVertical } from "react-icons/hi";

const DraggableCard = ({ task, onEdit, memberLookup }) => {
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

  const assigneeName = React.useMemo(() => {
    const id =
      (typeof task.assignedTo === "object" && task.assignedTo?._id) ||
      task.assignedTo;
    if (!id) return "Unassigned";
    const member = memberLookup?.[id];
    if (!member) return "Unassigned";
    const fullName = `${member.firstName || ""} ${
      member.lastName || ""
    }`.trim();
    return fullName || member.username || member.email || "Unassigned";
  }, [memberLookup, task.assignedTo]);

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.8 : 1,
    backgroundColor: "#fff",
    padding: "0.5rem 0.75rem",
    borderRadius: "8px",
    marginBottom: "0.75rem",
    boxShadow: isDragging
      ? "0 8px 16px rgba(0,0,0,0.2)"
      : "0 2px 4px rgba(0,0,0,0.1)",
    border: "1px solid #e0e0e0",
    cursor: isDragging ? "grabbing" : "grab",
    position: isDragging ? "fixed" : "relative",
    zIndex: isDragging ? 9999 : "auto",
    width: isDragging && dimensions.width ? `${dimensions.width}px` : "auto",
    height: isDragging && dimensions.height ? `${dimensions.height}px` : "auto",
    boxSizing: "border-box",
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        nodeRef.current = node;
      }}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "0.5rem",
          marginBottom: "0.25rem",
        }}
      >
        <h4
          style={{
            fontWeight: 600,
            fontSize: "0.95rem",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            wordBreak: "break-word",
            flex: 1,
          }}
        >
          {task.name}
        </h4>

        {/* Three dots menu */}
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
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            height: "20px",
            width: "20px",
          }}
        >
          <HiDotsVertical size={16} color="#666" />
        </button>
      </div>

      <p
        style={{
          fontSize: "0.85rem",
          marginBottom: "0.25rem",
          margin: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          wordBreak: "break-word",
          color: "#666",
        }}
      >
        {task.description}
      </p>
      <p
        style={{
          fontSize: "0.75rem",
          color: "#4b5563",
          margin: "0.25rem 0",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontWeight: 600, color: "#111827" }}>Assigned To:</span>{" "}
        <span>{assigneeName}</span>
      </p>
      {task.dueDate && (
        <p
          style={{
            fontSize: "0.75rem",
            color: "#888",
            margin: "0.25rem 0 0 0",
          }}
        >
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default DraggableCard;
