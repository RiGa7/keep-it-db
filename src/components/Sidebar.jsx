import MenuIcon from "@mui/icons-material/Menu";
import TextSnippetRoundedIcon from '@mui/icons-material/TextSnippetRounded';
import LabelRoundedIcon from '@mui/icons-material/LabelRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ labels = [], selectedLabel = "", onSelectLabel = () => { } }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      {/* Spacer for sticky layout */}
      <div className={`hidden md:block transition-all duration-200 shrink-0 ${menuOpen ? "w-[250px]" : "w-[60px]"}`} />
      <div className={`md:hidden transition-all duration-200 shrink-0 w-[60px]`} />

      <aside className={`fixed top-0 left-0 h-screen flex flex-col transition-all duration-200 bg-primary border-r border-secondary shadow-2xl z-50 overflow-x-hidden ${menuOpen ? "w-[250px]" : "w-[60px]"}`}>
        <div className={`p-4 flex items-center ${menuOpen ? "justify-between" : "justify-center"}`}>
          {menuOpen && <h1 className="text-2xl font-bold text-accent whitespace-nowrap">Keep It</h1>}
          <MenuIcon onClick={() => setMenuOpen(!menuOpen)} className="text-white cursor-pointer shrink-0" />
        </div>

        <nav className={`flex-1 overflow-y-auto overflow-x-hidden transition-all duration-200 mt-4`}>
          <ul className="space-y-2 px-2">
            <li>
              <button
                onClick={() => onSelectLabel("")}
                className={`group relative w-full flex items-center rounded-lg px-3 py-2 transition-colors overflow-hidden ${selectedLabel === "" ? "text-accent" : "text-white hover:text-accent"} ${menuOpen ? "justify-start" : "justify-center"}`}
                title="All Notes"
              >
                {/* Left solid line */}
                <span className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-white" />
                {/* Expanding background */}
                <span className={`absolute left-0 top-0 h-full transition-all duration-300 rounded-lg bg-white ${selectedLabel === "" ? "w-full opacity-20" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-20"}`} />

                <div className="relative z-10 flex items-center gap-4 w-full">
                  <TextSnippetRoundedIcon className="shrink-0" />
                  {menuOpen && <span className="whitespace-nowrap">All Notes</span>}
                </div>
              </button>
            </li>

            {labels && labels.length > 0 && (
              <>
                {menuOpen && <li className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-dark uppercase tracking-wider">Labels</li>}
                {labels.map((lbl) => (
                  <li key={lbl.name}>
                    <button
                      onClick={() => onSelectLabel(lbl.name)}
                      className={`group relative w-full flex items-center rounded-lg px-3 py-2 transition-colors overflow-hidden ${selectedLabel === lbl.name ? "text-white" : "text-gray-300"} ${menuOpen ? "justify-start" : "justify-center"}`}
                      title={lbl.name}
                    >
                      {/* Left solid line */}
                      <span
                        className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
                        style={{ backgroundColor: lbl.color || "#ffffff" }}
                      />
                      {/* Expanding background */}
                      <span
                        className={`absolute left-0 top-0 h-full transition-all duration-300 rounded-lg ${selectedLabel === lbl.name ? "w-full opacity-20" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-20"}`}
                        style={{ backgroundColor: lbl.color || "#ffffff" }}
                      />

                      <div className="relative z-10 flex items-center gap-4 w-full">
                        <LabelRoundedIcon className="shrink-0" style={{ color: lbl.color || "inherit" }} />
                        {menuOpen && <span className="truncate whitespace-nowrap">{lbl.name}</span>}
                      </div>
                    </button>
                  </li>
                ))}
              </>
            )}
          </ul>
        </nav>

        <div className="p-2 border-t border-secondary mt-auto">
          {/* User Profile */}
          <div className={`flex items-center gap-3 px-2 py-2 mb-2 rounded-lg transition-colors ${menuOpen ? "hover:bg-white/5" : "justify-center"}`}>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-lg uppercase shrink-0">
              {user?.name ? user.name[0] : "U"}
            </div>
            {menuOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-white truncate">{user?.name || "User"}</span>
                {user?.email && <span className="text-xs text-gray-400 truncate">{user.email}</span>}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className={`w-full flex items-center gap-4 rounded-lg px-2 py-2 text-gray-dark hover:text-danger hover:bg-white/5 transition-colors ${menuOpen ? "justify-start" : "justify-center"}`}
            title="Sign out"
          >
            <LogoutRoundedIcon className="shrink-0" />
            {menuOpen && <span className="whitespace-nowrap">Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#222831] p-6 rounded-xl border border-tertiary shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200"
          >
            <h3 className="text-xl font-semibold text-white mb-3">Sign Out?</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to sign out of your account?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg text-gray-300 font-medium hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}