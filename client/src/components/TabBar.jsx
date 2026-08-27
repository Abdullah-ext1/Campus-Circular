import React from "react";
import { Send, Grid, PlusCircle, Clock, ShieldCheck, ShieldAlert } from "lucide-react";

export default function TabBar({ activeTab, setActiveTab, unreadCount = 0 }) {
  const tabs = [
    { id: "home", label: "Dispatch", Icon: Send },
    { id: "browse", label: "Browse", Icon: Grid },
    { id: "lend", label: "Lend Gear", Icon: PlusCircle },
    { id: "activity", label: "Activity", Icon: Clock },
    { id: "profile", label: "Trust Profile", Icon: ShieldCheck },
    { id: "admin", label: "Governance", Icon: ShieldAlert },
  ];

  return (
    <nav className="app-tabbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const IconComponent = tab.Icon;
        return (
          <button
            key={tab.id}
            className={`tab-item ${isActive ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <IconComponent size={16} className="tab-icon" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
