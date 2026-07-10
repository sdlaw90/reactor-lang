"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle, BarChart2, Sparkles, X, ShieldCheck, Info } from "lucide-react";
import Avatar from "./Avatar";
import SettingsPanel from "./SettingsPanel";

const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();

export default function NavDrawer({ profile, displayName, hasUnseenWhatsNew, userEmail }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isAdmin = ADMIN_EMAIL && userEmail?.toLowerCase() === ADMIN_EMAIL;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

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

            <div style={styles.scrollBody}>
              <div style={styles.navList}>
                <NavItem icon={<Sparkles size={18} />} label="What's New" badge={hasUnseenWhatsNew} onClick={() => go("/whats-new")} />
                <NavItem icon={<HelpCircle size={18} />} label="Help" onClick={() => go("/help")} />
                <NavItem icon={<Info size={18} />} label="About" onClick={() => go("/about")} />
                <NavItem icon={<BarChart2 size={18} />} label="Dashboard" onClick={() => go("/dashboard")} />
                {isAdmin && (
                  <NavItem icon={<ShieldCheck size={18} />} label="Beta Applications" onClick={() => go("/admin/beta-applications")} />
                )}
              </div>

              <div style={styles.divider} />

              <div style={styles.settingsHeader}>SETTINGS</div>
              <SettingsPanel />
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
    width: "min(360px, 88vw)",
    background: "#221E33",
    borderLeft: "1px solid #3A3452",
    zIndex: 1600,
    padding: "24px 18px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "-8px 0 30px rgba(0,0,0,0.4)",
    overflow: "hidden",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    paddingBottom: 18,
    borderBottom: "1px solid #3A3452",
    flexShrink: 0,
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
    flexShrink: 0,
  },
  scrollBody: { flex: 1, overflowY: "auto", paddingRight: 4, marginRight: -4 },
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
  divider: { height: 1, background: "#3A3452", margin: "18px 0" },
  settingsHeader: {
    color: "#FF8FB1",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1,
    marginBottom: 4,
  },
};
