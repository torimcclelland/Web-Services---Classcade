import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "../context/ProjectContext";

const MessagesRedirect = () => {
  const navigate = useNavigate();
  const { selectedProject } = useProject();

  useEffect(() => {
    if (selectedProject?._id) {
      // Redirect to the current project's chat
      navigate(`/messages/${selectedProject._id}`, { replace: true });
    } else {
      // No project selected, redirect to home
      navigate("/home", { replace: true });
    }
  }, [selectedProject, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <p>Loading messages...</p>
    </div>
  );
};

export default MessagesRedirect;