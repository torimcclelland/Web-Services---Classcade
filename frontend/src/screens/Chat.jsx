
// Inside a specific chat

// Brooke - Work in progress

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
// import ChatStyle from '../styles/ChatStyle';

const Chat = () => {

    return (
        <div style={ChatStyle.container}>
            <TopNavBar />

            <div style={ChatStyle.layout}>
                <Sidebar />

                <main style={ChatStyle.main}>

                    <div style={ChatStyle.header}>

                    </div>

                </main>

            </div>

        </div>
    );
}