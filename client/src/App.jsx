import React, { useState, useEffect, createContext } from "react";
import { Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import LandingPage from "./components/LandingPage.jsx";
import ExplorePage from "./components/ExplorePage.jsx";
import AdminPage from "./components/AdminPage.jsx";
import AuthPage from "./components/AuthPage.jsx";
import CreateListing from "./components/CreateListing.jsx";
import Header from "./components/Header.jsx";
import TabBar from "./components/TabBar.jsx";
import CommandBar from "./components/CommandBar.jsx";
import KitRecommendation from "./components/KitRecommendation.jsx";
import ResourceDetail from "./components/ResourceDetail.jsx";
import BorrowingAgreement from "./components/BorrowingAgreement.jsx";
import LifecycleTracker from "./components/LifecycleTracker.jsx";
import UserProfile from "./components/UserProfile.jsx";
import ConditionReport from "./components/ConditionReport.jsx";
import SettlementPanel from "./components/SettlementPanel.jsx";
import ResourceGrid from "./components/ResourceGrid.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import CampusDashboard from "./components/CampusDashboard.jsx";
import CommunityBoard from "./components/CommunityBoard.jsx";
import CategoryIcon from "./components/CategoryIcon.jsx";
import ProductDetailPage from "./components/ProductDetailPage.jsx";
import PublicProfile from "./components/PublicProfile.jsx";
import NeedFinder from "./components/NeedFinder.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import SkipLink from "./components/SkipLink.jsx";

import { LanguageProvider } from "./contexts/LanguageContext.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";

import { students, resources, sampleBorrowings, getResource, getStudent } from "./data/mockData.js";
import { formatDate } from "./utils/helpers.js";
import { parseIntentWithGroq } from "./utils/groqApi.js";

export const AppContext = createContext();

function CampusAppShell({ defaultSubScreen = null }) {
  const { user } = useAuth();
  const location = useLocation();
  const params = useParams();

  // Navigation & View State
  const [activeTab, setActiveTab] = useState("home"); // home | browse | activity | profile | admin
  const [currentSubScreen, setCurrentSubScreen] = useState(defaultSubScreen);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isAdmin, setIsAdmin] = useState(user?.role === "admin");
  const [isParsingIntent, setIsParsingIntent] = useState(false);

  // Active User
  const [currentUser, setCurrentUser] = useState(user || students[7]);

  // Selected Resources & Flow State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKit, setSelectedKit] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [activeBorrowing, setActiveBorrowing] = useState(sampleBorrowings[0]);

  // Handle URL deep-linking or navigation state
  useEffect(() => {
    const targetResourceId = params.resourceId || location.state?.resourceId;
    const targetSubScreen = defaultSubScreen || location.state?.subScreen;

    if (targetResourceId) {
      const res = getResource(parseInt(targetResourceId, 10));
      if (res) {
        setSelectedResource(res);
        setCurrentSubScreen("agreement");
        setActiveTab("home");
      }
    } else if (targetSubScreen) {
      setCurrentSubScreen(targetSubScreen);
    }
  }, [params.resourceId, location.state, defaultSubScreen]);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      setIsAdmin(user.role === "admin");
    }
  }, [user]);

  // Persistent Catalog Resources list
  const [catalogResources, setCatalogResources] = useState(() => {
    const saved = localStorage.getItem("cc_resources");
    return saved ? JSON.parse(saved) : resources;
  });

  useEffect(() => {
    localStorage.setItem("cc_resources", JSON.stringify(catalogResources));
  }, [catalogResources]);

  // Persistent Borrowings list
  const [borrowings, setBorrowings] = useState(() => {
    const saved = localStorage.getItem("cc_borrowings");
    return saved ? JSON.parse(saved) : sampleBorrowings;
  });

  useEffect(() => {
    localStorage.setItem("cc_borrowings", JSON.stringify(borrowings));
  }, [borrowings]);

  // Navigation Handlers
  const handleSearchIntent = async (queryText) => {
    setSearchQuery(queryText);
    setIsParsingIntent(true);
    try {
      const matched = await parseIntentWithGroq(queryText);
      setSelectedKit(matched);
      setCurrentSubScreen("kit");
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsParsingIntent(false);
    }
  };

  const handleSelectResource = (resource) => {
    setSelectedResource(resource);
    setCurrentSubScreen("detail");
  };

  const handleStartAgreement = (resource) => {
    setSelectedResource(resource);
    setCurrentSubScreen("agreement");
  };

  const handleConfirmAgreement = (newBorrowing) => {
    setBorrowings((prev) => [newBorrowing, ...prev]);
    setActiveBorrowing(newBorrowing);
    setCurrentSubScreen("tracker");
    setActiveTab("activity");
  };

  const handleOpenTracker = (borrowing) => {
    setActiveBorrowing(borrowing);
    setCurrentSubScreen("tracker");
    setActiveTab("activity");
  };

  const handleUpdateBorrowing = (updated) => {
    setBorrowings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setActiveBorrowing(updated);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeTab,
        setActiveTab,
        currentSubScreen,
        setCurrentSubScreen,
        selectedResource,
        setSelectedResource,
        selectedKit,
        setSelectedKit,
        activeBorrowing,
        setActiveBorrowing,
        borrowings,
        setBorrowings,
        isAdmin,
        setIsAdmin,
      }}
    >
      <div className="app-container">
        <SkipLink targetId="app-main-content" label="Skip to application main content" />

        <Header
          currentUser={currentUser}
          onOpenDashboard={() => setShowDashboard(true)}
          isAdmin={isAdmin}
          onToggleAdmin={() => setIsAdmin(!isAdmin)}
          onOpenProfile={() => {
            setActiveTab("profile");
            setCurrentSubScreen(null);
          }}
          onCreateListing={() => {
            setCurrentSubScreen("createListing");
          }}
        />

        <main id="app-main-content" className="app-main container-padded" style={{ flex: 1 }} role="main">
          {currentSubScreen === "createListing" ? (
            <CreateListing
              onBack={() => setCurrentSubScreen(null)}
              onSubmitSuccess={() => setCurrentSubScreen(null)}
            />
          ) : (
            <>
              {/* HOME TAB */}
              {activeTab === "home" && (
                <>
                  {!currentSubScreen && <CommandBar onSearch={handleSearchIntent} />}

                  {currentSubScreen === "kit" && (
                    <KitRecommendation
                      kit={selectedKit}
                      query={searchQuery}
                      onBack={() => setCurrentSubScreen(null)}
                      onSelectResource={handleSelectResource}
                    />
                  )}

                  {currentSubScreen === "detail" && (
                    <ResourceDetail
                      resource={selectedResource}
                      onBack={() => setCurrentSubScreen(selectedKit ? "kit" : null)}
                      onStartBorrowing={handleStartAgreement}
                      onSelectResource={handleSelectResource}
                    />
                  )}

                  {currentSubScreen === "agreement" && (
                    <BorrowingAgreement
                      resource={selectedResource}
                      borrower={currentUser}
                      onBack={() => setCurrentSubScreen(selectedKit ? "kit" : null)}
                      onConfirm={handleConfirmAgreement}
                    />
                  )}
                </>
              )}

              {/* BROWSE TAB */}
              {activeTab === "browse" && (
                <>
                  {!currentSubScreen && (
                    <>
                      <ResourceGrid onSelectResource={handleSelectResource} />
                      <CommunityBoard />
                    </>
                  )}

                  {currentSubScreen === "detail" && (
                    <ResourceDetail
                      resource={selectedResource}
                      onBack={() => setCurrentSubScreen(null)}
                      onStartBorrowing={handleStartAgreement}
                      onSelectResource={handleSelectResource}
                    />
                  )}

                  {currentSubScreen === "agreement" && (
                    <BorrowingAgreement
                      resource={selectedResource}
                      borrower={currentUser}
                      onBack={() => setCurrentSubScreen(null)}
                      onConfirm={handleConfirmAgreement}
                    />
                  )}
                </>
              )}

              {/* ACTIVITY TAB */}
              {activeTab === "activity" && (
                <>
                  {!currentSubScreen && (
                    <div className="animate-slide-up" style={{ maxWidth: "800px", margin: "0 auto" }}>
                      <h1 className="font-serif" style={{ color: "var(--receipt)", marginBottom: "8px" }}>
                        Active Campus Borrowings
                      </h1>
                      <p style={{ color: "var(--receipt-dim)", fontSize: "0.95rem", marginBottom: "24px" }}>
                        Track state transitions and condition inspection protocols.
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {borrowings.map((b) => {
                          const res = getResource(b.resourceId);
                          const owner = getStudent(b.ownerId);
                          return (
                            <div
                              key={b.id}
                              className="paper-card"
                              onClick={() => handleOpenTracker(b)}
                              style={{
                                background: "#ffffff",
                                border: b.isLate ? "1px solid var(--stamp-red)" : "1px solid var(--slate)",
                                padding: "20px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                transition: "all 0.2s ease",
                              }}
                              role="button"
                              tabIndex={0}
                              aria-label={`View borrowing agreement ${b.id} for ${res?.name}`}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <div
                                  style={{
                                    padding: "10px",
                                    background: "#f4f4f4",
                                    borderRadius: "var(--radius-md)",
                                    color: "#111111",
                                  }}
                                >
                                  <CategoryIcon category={res?.category} size={24} />
                                </div>
                                <div>
                                  <div className="font-mono" style={{ fontSize: "0.75rem", color: "#666666", fontWeight: 600 }}>
                                    {b.id}
                                  </div>
                                  <h3 className="font-sans" style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--receipt)" }}>
                                    {res?.name}
                                  </h3>
                                  <div style={{ fontSize: "0.85rem", color: "var(--receipt-dim)" }}>
                                    Lender: {owner?.name} • Due: {formatDate(b.timestamps.due)}
                                  </div>
                                </div>
                              </div>

                              <div style={{ textAlign: "right" }}>
                                {b.isLate ? (
                                  <span
                                    className="stamp stamp-red font-serif"
                                    style={{
                                      fontSize: "0.75rem",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "4px",
                                    }}
                                  >
                                    <AlertTriangle size={12} /> OVERDUE
                                  </span>
                                ) : (
                                  <span className="stamp stamp-gold font-serif" style={{ fontSize: "0.75rem" }}>
                                    PHASE {b.currentState + 1}/10
                                  </span>
                                )}
                                <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--receipt-dim)", marginTop: "6px" }}>
                                  Open Tracker →
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {currentSubScreen === "tracker" && (
                    <LifecycleTracker
                      borrowing={activeBorrowing}
                      onBack={() => setCurrentSubScreen(null)}
                      onUpdateBorrowing={handleUpdateBorrowing}
                    />
                  )}

                  {currentSubScreen === "condition" && (
                    <ConditionReport
                      borrowing={activeBorrowing}
                      onBack={() => setCurrentSubScreen("tracker")}
                    />
                  )}

                  {currentSubScreen === "settlement" && (
                    <SettlementPanel
                      borrowing={activeBorrowing}
                      onBack={() => setCurrentSubScreen("tracker")}
                    />
                  )}
                </>
              )}

              {/* PROFILE TAB */}
              {activeTab === "profile" && <UserProfile student={currentUser} />}

              {/* ADMIN TAB */}
              {activeTab === "admin" && <AdminPanel />}
            </>
          )}
        </main>

        {showDashboard && <CampusDashboard onClose={() => setShowDashboard(false)} />}

        <TabBar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setCurrentSubScreen(null);
          }}
        />
      </div>
    </AppContext.Provider>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/profile/:id" element={<PublicProfile />} />
          <Route path="/find" element={<NeedFinder />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/create" element={<CampusAppShell defaultSubScreen="createListing" />} />
          <Route path="/app/borrow/:resourceId" element={<CampusAppShell />} />
          <Route path="/app/track/:borrowingId" element={<CampusAppShell />} />
          <Route path="/app/*" element={<CampusAppShell />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </LanguageProvider>
  );
}
