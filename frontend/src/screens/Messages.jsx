// Messages overview screen

// Brooke - Work in progress

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
// import MessagesStyle from '../styles/MessagesStyle';

const Messages = () => {

    return (
        <div style={MessagesStyle.container}>
            <TopNavBar />

            <div style={MessagesStyle.layout}>
                <Sidebar />

                <main style={MessagesStyle.main}>

                    <div style={MessagesStyle.header}>

                    </div>

                </main>

            </div>

        </div>

    );
}