import React from 'react';
// Create stylesheet for this page and import here

const TimeTracking = () => {
    console.log('You are on the Time Tracking screen.')


    const handleClassSelect = () => {
        console.log('You are now selecting your class.')
    }

    const handleTaskSelect = () => {
        console.log('You are now selecting your task.')
    }

    const handleMinutes = () => {
        console.log('You are now entering your minutes.')
    }

    const handleCompletedStatus = () => {
        console.log('You are now checking off the completed status.')
    }

    const handleCancel = () => {
        console.log('You are now cancelling your time tracking.')
    }

    const handleSubmit = () => {
        console.log('You are now submitting your time tracking.')
    }

    return (
        <div>
        <h1>Time Tracking - Enter Time Form</h1>

        <button
            // import style here once its made
            onClick = {handleCancel}
            aria-label="Cancel"
        >
        </button>
 
        <button
            // import style here once its made
            onClick = {handleSubmit}
            aria-label="Submit"
        >

        </button>

        <textfield
            // import styles here
            onClick = {handleMinutes}
            aria-label="Minutes"
        >

        </textfield>

        <textfield // should be a dropdown, not textfield
            onClick = {handleClassSelect}
            aria-label="Select a Class"
            placeholder="Select a Class"
        >

        </textfield>

        <textfield // should be a dropdown, not a textfield
            onClick = {handleTaskSelect}
            aria-label="Select a Task"
            placeholder="Select a Task"
        >

        </textfield>

        

        </div>
    );

};