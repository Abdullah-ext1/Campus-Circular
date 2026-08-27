import React from "react";

export default function TabBar({ activeTab, setActiveTab, unreadCount = 0 }) {
  const tabs = [
    { id: "home", label: "Dispatch", icon: "⌘" },
    { id: "browse", label: "Browse", icon: "◇" },
    { id: "activity", label: "Activity", icon: "↻" },
    { id: "profile", label: "Trust Profile", icon: "●" },
    { id: "admin", label: "Governance", icon: "⚙" },
  ];

  return (
    <nav className="app-tabbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`tab-item ${isActive ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon font-mono">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
