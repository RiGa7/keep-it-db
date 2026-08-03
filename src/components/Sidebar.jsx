import MenuIcon from "@mui/icons-material/Menu";
import TextSnippetRoundedIcon from '@mui/icons-material/TextSnippetRounded';
import LabelRoundedIcon from '@mui/icons-material/LabelRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png"

export default function Sidebar({ labels = [], selectedLabel = "", onSelectLabel = () => { } }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [mobileLabelsOpen, setMobileLabelsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLabelSelect = (labelName) => {
    onSelectLabel(labelName);
    setMobileLabelsOpen(false);
    setMenuOpen(false);
  };

  const handleAllNotes = () => {
    onSelectLabel("");
    setMobileLabelsOpen(false);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Desktop spacer */}
      <div className={`hidden md:block transition-all duration-200 shrink-0 ${menuOpen ? "w-[250px]" : "w-[60px]"}`} />

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex fixed top-0 left-0 h-screen flex-col transition-all duration-200 bg-primary border-r border-secondary shadow-2xl z-50 overflow-x-hidden ${menuOpen ? "w-62.5" : "w-[60px]"}`}>
        <div className={`p-4 flex items-center ${menuOpen ? "justify-between" : "justify-center"}`}>
          {menuOpen && <img src={logo} className="h-8 w-14" />}
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
                <span className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-white" />
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
                      <span
                        className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
                        style={{ backgroundColor: lbl.color || "#ffffff" }}
                      />
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

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0  bg-primary border-b border-secondary z-40 flex items-center justify-between px-2 py-4">
        <div className="flex items-center gap-2">
          <MenuIcon
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[18px]! md:text-[24px]! cursor-pointer"
          />
          <img src={logo} className="h-8 w-14" />
        </div>
        <div className="flex items-center gap-3">
          <div
            onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
            className="w-7 h-7 rounded-full bg-gray flex items-center justify-center text-primary font-bold text-lg uppercase cursor-pointer hover:scale-105 transition-transform"
          >
            {user?.name ? user.name[0] : "U"}
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Menu (from left) */}
      <div className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMenuOpen(false)}
        />
        {/* Sidebar */}
        <div className={`absolute top-0 left-0 h-full w-72 bg-primary border-r border-secondary shadow-2xl transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 flex items-center justify-between border-b border-secondary">
            <img src={logo} className="h-8 w-14" />
            <CloseRoundedIcon
              onClick={() => setMenuOpen(false)}
              className="text-white cursor-pointer"
            />
          </div>

          <nav className="flex-1 overflow-y-auto scrollbar mt-4">
            <ul className="space-y-2 px-2">
              <li>
                <button
                  onClick={() => {
                    handleAllNotes();
                  }}
                  className={`group relative w-full flex items-center justify-start rounded-lg px-3 py-2 transition-colors overflow-hidden ${selectedLabel === "" ? "text-accent" : "text-white hover:text-accent"}`}
                >
                  <span className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-white" />
                  <span className={`absolute left-0 top-0 h-full transition-all duration-300 rounded-lg bg-white ${selectedLabel === "" ? "w-full opacity-20" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-20"}`} />
                  <div className="relative z-10 flex items-center gap-4 w-full">
                    <TextSnippetRoundedIcon className="shrink-0" />
                    <span className="whitespace-nowrap">All Notes</span>
                  </div>
                </button>
              </li>

              {labels && labels.length > 0 && (
                <>
                  <li className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-dark uppercase tracking-wider">Labels</li>
                  {labels.map((lbl) => (
                    <li key={lbl.name}>
                      <button
                        onClick={() => handleLabelSelect(lbl.name)}
                        className={`group relative w-full flex items-center justify-start rounded-lg px-3 py-2 transition-colors overflow-hidden ${selectedLabel === lbl.name ? "text-white" : "text-gray-300"}`}
                      >
                        <span
                          className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
                          style={{ backgroundColor: lbl.color || "#ffffff" }}
                        />
                        <span
                          className={`absolute left-0 top-0 h-full transition-all duration-300 rounded-lg ${selectedLabel === lbl.name ? "w-full opacity-20" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-20"}`}
                          style={{ backgroundColor: lbl.color || "#ffffff" }}
                        />
                        <div className="relative z-10 flex items-center gap-4 w-full">
                          <LabelRoundedIcon className="shrink-0" style={{ color: lbl.color || "inherit" }} />
                          <span className="truncate whitespace-nowrap">{lbl.name}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </nav>

          <div className="p-4 border-t border-secondary">
            <button
              onClick={() => {
                setShowLogoutModal(true);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-4 rounded-lg py-2 text-gray-dark hover:text-danger hover:bg-gray hover:px-2 transition-all justify-start"
            >
              <LogoutRoundedIcon className="shrink-0" />
              <span className="whitespace-nowrap">Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Profile Dropdown */}
      {mobileProfileOpen && (
        <div className="md:hidden fixed inset-0 z-50" onClick={() => setMobileProfileOpen(false)}>
          <div className="absolute top-16 right-4 w-64 bg-primary border border-secondary rounded-xl shadow-2xl p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-lg uppercase shrink-0">
                {user?.name ? user.name[0] : "U"}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-white truncate">{user?.name || "User"}</span>
                {user?.email && <span className="text-xs text-gray truncate">{user.email}</span>}
              </div>
            </div>
            <button
              onClick={() => {
                setShowLogoutModal(true);
                setMobileProfileOpen(false);
              }}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-red-400 hover:text-danger hover:bg-gray hover:px-2 transition-all justify-start"
            >
              <LogoutRoundedIcon className="shrink-0" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Bar - Only show if labels exist */}
      {labels && labels.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary border-t border-secondary z-40">
          {/* Expanded Labels Panel (slides up) */}
          <div className={`transition-all duration-300 overflow-hidden ${mobileLabelsOpen ? 'max-h-[50vh]' : 'max-h-0'}`}>
            <div className="max-h-[50vh] overflow-y-auto">
              {/* All Notes Option */}
              <button
                onClick={handleAllNotes}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${selectedLabel === ""
                    ? "bg-accent/10 text-accent"
                    : "text-white hover:bg-white/5"
                  }`}
              >
                <TextSnippetRoundedIcon fontSize="small" />
                <span className="text-sm font-medium">All Notes</span>
              </button>

              {/* Label Options */}
              {labels.map((lbl) => (
                <button
                  key={lbl.name}
                  onClick={() => handleLabelSelect(lbl.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${selectedLabel === lbl.name
                      ? "bg-white/10 text-white"
                      : "text-gray-300 hover:bg-white/5"
                    }`}
                >
                  <div
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{
                      backgroundColor: lbl.color || "#ffffff",
                      ringColor: lbl.color || "#ffffff"
                    }}
                  />
                  <span className="text-sm truncate">{lbl.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Bar - Label dots + arrow */}
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2 flex-1">
              {labels.map((lbl) => (
                <button
                  key={lbl.name}
                  onClick={() => handleLabelSelect(lbl.name)}
                  className={`w-4 h-4 rounded-full shrink-0 ${selectedLabel === lbl.name ? 'ring ring-gray' : ''
                    }`}
                  style={{ backgroundColor: lbl.color || "#ffffff" }}
                  title={lbl.name}
                />
              ))}
            </div>
            <button
              onClick={() => setMobileLabelsOpen(!mobileLabelsOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0"
            >
              {mobileLabelsOpen ? (
                <KeyboardArrowDownRoundedIcon className="text-white" />
              ) : (
                <KeyboardArrowUpRoundedIcon className="text-white" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal (shared) */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-primary p-6 rounded-xl border border-secondary shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200"
          >
            <h3 className="text-xl font-semibold text-white mb-3">Sign Out?</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to sign out from your account?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg border border-secondary text-gray-300 font-medium hover:bg-white/10 transition-colors"
              >
                No
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
                className="px-4 py-2 rounded-lg border border-danger text-danger bg-gray font-medium hover:bg-danger/90 hover:text-white transition-all"
              >
                Yes, Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile bottom spacer - only when labels exist */}
      {labels && labels.length > 0 && <div className="md:hidden h-14" />}
    </>
  );
}