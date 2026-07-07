"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle, BarChart2, Settings as SettingsIcon, Sparkles, X } from "lucide-react";
import Avatar from "./Avatar";

export default function NavDrawer({ profile, displayName, hasUnseenWhatsNew }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const go = (path) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <>
      <button
        className="rj"
        style={{ ...styles.trigger, position: "relative" }}
        title="Menu"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Avatar type={profile?.avatar_type} value={profile?.avatar_value} fallbackText={displayName} size={34} />
        {hasUnseenWhatsNew && <span style={styles.notifDot} />}
      </button>

      {open && (
        <>
          <div style={styles.backdrop} onClick={() => setOpen(false)} />
          <div style={styles.drawer} className="fadein">
            <div style={styles.drawerHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar type={profile?.avatar_type} value={profile?.avatar_value} fallbackText={displayName} size={40} />
                <span style={{ color: "#F3F0FA", fontWeight: 700, fontSize: 15 }}>{displayName}</span>
              </div>
              <button className="rj" style={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={18} />
              </button>
            </div>

            <div style={styles.navList}>
              <NavItem icon={<Sparkles size={18} />} label="What's New" badge={hasUnseenWhatsNew} onClick={() => go("/whats-new")} />
              <NavItem icon={<HelpCircle size={18} />} label="Help" onClick={() => go("/help")} />
              <NavItem icon={<BarChart2 size={18} />} label="Dashboard" onClick={() => go("/dashboard")} />
              <NavItem icon={<SettingsIcon size={18} />} label="Settings" onClick={() => go("/settings")} />
            </div>
          </div>
        </>
      )}
    </>
  );
}

function NavItem({ icon, label, badge, onClick }) {
  return (
    <button className="rj" style={styles.navItem} onClick={onClick}>
      <span style={{ color: "#B98EFF", display: "flex" }}>{icon}</span>
      <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
      {badge && <span style={styles.navItemDot} />}
    </button>
  );
}

const styles = {
  trigger: {
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    display: "flex",
  },
  notifDot: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 11,
    height: 11,
    borderRadius: "50%",
    background: "#FF3D7F",
    border: "2px solid #171423",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(14,12,20,0.75)",
    zIndex: 1500,
  },
  drawer: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: "min(320px, 82vw)",
    background: "#221E33",
    borderLeft: "1px solid #3A3452",
    zIndex: 1600,
    padding: "24px 18px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "-8px 0 30px rgba(0,0,0,0.4)",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingBottom: 18,
    borderBottom: "1px solid #3A3452",
  },
  closeBtn: {
    background: "rgba(255,143,177,0.12)",
    color: "#FF8FB1",
    border: "none",
    borderRadius: "50%",
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  navList: { display: "flex", flexDirection: "column", gap: 4 },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "transparent",
    border: "none",
    borderRadius: 10,
    padding: "13px 10px",
    color: "#F3F0FA",
    fontSize: 14.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  navItemDot: { width: 9, height: 9, borderRadius: "50%", background: "#FF3D7F" },
};
