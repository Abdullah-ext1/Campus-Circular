import React from "react";
import { Send, Grid, PlusCircle, Clock, ShieldCheck, ShieldAlert } from "lucide-react";

export default function TabBar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "home", label: "Dispatch", Icon: Send },
    { id: "browse", label: "Inventory", Icon: Grid },
    { id: "activity", label: "Activity", Icon: Clock },
    { id: "profile", label: "Profile", Icon: ShieldCheck },
    { id: "admin", label: "Governance", Icon: ShieldAlert },
  ];

  return (
    <nav className="app-tabbar" role="tablist" aria-label="Campus shell navigation">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const IconComponent = tab.Icon;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            className={`tab-item ${isActive ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <IconComponent size={16} className="tab-icon" aria-hidden="true" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
