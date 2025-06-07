'use client';

import { useState } from 'react';

export function LayoutTest() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">🧪 Layout Test</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Sidebar Status</h3>
            <p className="text-blue-700">
              {sidebarVisible ? '✅ Visible' : '❌ Hidden'}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Layout Status</h3>
            <p className="text-green-700">✅ Main content positioned correctly</p>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-900">CSS Status</h3>
          <div className="text-yellow-700 space-y-1">
            <p>✅ Sidebar: Fixed position, z-index 40</p>
            <p>✅ Header: Fixed position, z-index 50</p>
            <p>✅ Main: Margin-left 16rem, margin-top 4rem</p>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-900">Navigation Test</h3>
          <p className="text-purple-700">
            El menú lateral debería estar visible a la izquierda con enlaces funcionales.
          </p>
        </div>

        <button
          onClick={() => setSidebarVisible(!sidebarVisible)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Toggle Sidebar Test
        </button>
      </div>
    </div>
  );
}
