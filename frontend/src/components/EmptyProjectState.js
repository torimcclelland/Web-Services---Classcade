import React from 'react';

const EmptyProjectState = ({ projectName }) => {
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '40px',
            textAlign: 'center',
            color: '#6b7280',
        },
        iconCircle: {
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#dbeafe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
        },
        icon: {
            fontSize: '2.5rem',
            color: '#1e3a8a',
            fontWeight: 'bold',
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '0.75rem',
        },
        description: {
            fontSize: '1rem',
            lineHeight: '1.6',
            maxWidth: '400px',
            marginBottom: '1.5rem',
        },
        hint: {
            fontSize: '0.875rem',
            color: '#9ca3af',
            fontStyle: 'italic',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.iconCircle}>
                <div style={styles.icon}>+</div>
            </div>
            <h2 style={styles.title}>No teammates yet</h2>
            <p style={styles.description}>
                Invite team members to <strong>{projectName}</strong> to start collaborating and chatting together.
            </p>
            <p style={styles.hint}>
                Tip: You can invite teammates from the project settings
            </p>
        </div>
    );
};

export default EmptyProjectState;
