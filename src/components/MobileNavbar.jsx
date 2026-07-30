import { useState } from "react";
import MobileProfileMenu from "./MobileProfileMenu";
import MobileLabels from "./MobileLabels";
import logo from "../assets/logo.png"

export default function MobileNavbar({
    user,
    logout,
    labels,
    selectedLabel,
    onSelectLabel
}) {

    const [profileOpen, setProfileOpen] = useState(false);
    const [labelsOpen, setLabelsOpen] = useState(false);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 h-16 bg-primary border-b border-secondary flex items-center justify-between px-4 z-40 md:hidden">

                <div className="flex items-center gap-2">
                    <img src={logo} className="h-8 w-14" />
                </div>

                <button
                    onClick={() => setProfileOpen(true)}
                    className="h-10 w-10 rounded-full bg-accent text-primary font-bold flex items-center justify-center"
                >
                    {user?.name?.[0] || "U"}
                </button>

            </header>

            <MobileProfileMenu
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
                user={user}
                logout={logout}
            />

            <MobileLabels
                open={labelsOpen}
                onOpen={() => setLabelsOpen(true)}
                onClose={() => setLabelsOpen(false)}
                labels={labels}
                selectedLabel={selectedLabel}
                onSelectLabel={onSelectLabel}
            />

        </>
    );
}