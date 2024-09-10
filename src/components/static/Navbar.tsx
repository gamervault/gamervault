// Next/React
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useContext } from "react";
// Utils
import { LoggedInContext } from "@/utils/context/LoggedInContext";
// Components
import MobileMenu from "./MobileMenu";
import SettingsModal from "../modals/SettingsModal";

function Navbar() {
    // Mobile Specific
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // Desktop Specific
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    // General
    const isLoggedIn = useContext(LoggedInContext);

    // Mobile Functions
    function openMobileMenu() {
        setMobileMenuOpen(true);
    }

    function closeMobileMenu() {
        setMobileMenuOpen(false);
    }

    // Desktop Specific Functions
    function toggleSettingsModal() {
        setSettingsModalOpen((isOpen) => !isOpen);
    }

    return (
        <>
            <nav className={`fixed w-full z-10 bg-bg-primary-black flex flex-row items-center gap-6 px-6 h-14 md:h-16 border-b-2 border-bg-stroke-grey md:px-12 md:gap-8`}>
                {/* Logo */}
                <Link href="/">
                    <Image src="/logo_mobile.svg" width={159} height={121} alt="Gamervault Logo" className="w-8 md:hidden" />
                    <Image src="/logo_desktop.svg" width={711} height={121} alt="Gamervault Logo" className="w-40 hidden md:block" />
                </Link>

                {/* Left Icons Desktop */}
                <div className="hidden md:flex flex-row gap-8 text-lg items-center">
                    <Link href="/" className="nav-link">Home</Link>
                    {
                        !isLoggedIn ?
                        <>
                            <a href="https://discord.com/invite/vRznRhteEM" target="_blank">
                                <Image src="/discord_logo.svg" width={43} height={32} alt="Discord Invite" className="w-7" />
                            </a>
                            <a href="https://www.instagram.com/itskaiwl/" target="_blank">
                                <Image src="/instagram_logo.svg" width={35} height={36} alt="Instagram Link" className="w-7" />
                            </a>
                        </> : 
                        <Link href="/submit" className="nav-link">Submit</Link>
                    }
                </div>

                {/* Right Icons Desktop */}
                <div className="hidden md:flex flex-row gap-8 text-lg items-center ml-auto">
                    {
                        isLoggedIn ?
                        <>
                            <a href="https://discord.com/invite/vRznRhteEM" target="_blank">
                                <Image src="/discord_logo.svg" width={43} height={32} alt="Discord Invite" className="w-7" />
                            </a>
                            <a href="https://www.instagram.com/itskaiwl/" target="_blank">
                                <Image src="/instagram_logo.svg" width={35} height={36} alt="Instagram Link" className="w-7" />
                            </a>
                            <button onClick={toggleSettingsModal}>
                                <Image src="/settings.svg" width={34} height={34} alt="Settings Icon" className="w-7 transition-all hover:scale-105 active:scale-95" />
                            </button>
                        </> : 
                        <>
                            <Link href="/login" className="nav-link">Login</Link>
                            <Link href="/signup" className="button-primary px-4 py-1">Signup</Link>
                        </>
                    }
                </div>
                
                {/* Open/close menu for mobile */}
                <div className="ml-auto md:hidden">
                    {
                        !mobileMenuOpen ? 
                        <button className="w-6" onClick={openMobileMenu}><Image src="/hamburger.svg" width={30} height={25} alt="Open Menu" /></button>:
                        <button className="w-5" onClick={closeMobileMenu}><Image src="/close_icon.svg" width={24} height={24} alt="Close Menu" /></button>
                    }
                </div>
                


            </nav>

            {/* Mobile Menu */}
            <div className={`md:hidden transition-all ${mobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"}`}>
                <MobileMenu />
            </div>

            {/* Desktop Settings Modal */}
            <div className={`hidden md:block transition-all ${(settingsModalOpen && isLoggedIn) ? "visible opacity-100" : "invisible opacity-0"}`}>
                <SettingsModal closeSettingsModal={() => setSettingsModalOpen(false)} />
            </div>
        </>
    );
        
}

export default Navbar;