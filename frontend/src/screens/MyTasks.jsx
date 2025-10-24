import React from 'react';
import TopNavBar from '../components/TopNavBar';
import SideBar from '../components/Sidebar';
import ProfileCircle from '../components/ProfileCircle';
import MyTasksStyle from '../styles/MyTasksStyle';

const swimlanes = ['Not Started', 'In Progress', 'Under Review', 'Complete'];

const sampleTasks = [
  {
    title: 'Name of item',
    description: 'This is the description of the task.',
    dueDate: '4/23/2026',
  },
  {
    title: 'Another task',
    description: 'Details about this task go here.',
    dueDate: '5/10/2026',
  },
];

const MyTasks = () => {
  return (
    <div style={MyTasksStyle.container}>
      <TopNavBar />
      <div style={MyTasksStyle.layout}>
        <SideBar />

        <main style={MyTasksStyle.main}>
          <div style={MyTasksStyle.header}>
            <h2>My Tasks</h2>
            <ProfileCircle
              avatarUrl="https://plus.unsplash.com/premium_photo-1732757787074-0f95bf19cf73?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=500"
              size={48}
            />
          </div>

          <div style={MyTasksStyle.swimlaneContainer}>
            {swimlanes.map((lane) => (
              <div key={lane} style={MyTasksStyle.swimlane}>
                <h3 style={MyTasksStyle.swimlaneTitle}>{lane}</h3>
                {sampleTasks.map((task, index) => (
                  <div key={index} style={MyTasksStyle.taskCard}>
                    <h4 style={MyTasksStyle.taskTitle}>{task.title}</h4>
                    <p style={MyTasksStyle.taskDescription}>{task.description}</p>
                    <p style={MyTasksStyle.taskDueDate}>Due Date: {task.dueDate}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyTasks;
