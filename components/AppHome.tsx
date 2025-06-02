'use client';

import React from 'react';

export default function AppHome() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-10 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to AdvisorBrain</h1>
                <p className="text-gray-600">
                    Please select a client from the dashboard or upload a new client CSV.
                </p>
            </div>
        </div>
    );
}
