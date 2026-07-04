import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'scans', label: 'Scans' },
    { id: 'reports', label: 'Reports' },
    { id: 'vulnerabilities', label: 'Vulnerabilities' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? 'active' : ''}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
