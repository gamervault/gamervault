import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { LoggedInContext } from "@/utils/context/LoggedInContext";
import { createClient } from "@/utils/supabase/component";

function MobileMenu() {
    const isLoggedIn = useContext(LoggedInContext);
    const supabase = createClient();
    
    async function signoutUser() {
        await supabase.auth.signOut();
    }

    return (
        <div className="fixed left-0 h-[calc(100vh-3.5rem)] mt-[3.5rem] w-full p-6 py-12 flex flex-col gap-12 items-center text-xl bg-bg-primary-black">
            <Link href="/" className="w-full text-center nav-link">Home</Link>

            {
                isLoggedIn &&
                <>
                    <Link href="/submit" className="w-full text-center nav-link">Submit</Link>
                    <Link href="/submit" className="w-full text-center nav-link">Activity</Link>
                    <Link href="/submit" className="w-full text-center nav-link">Settings</Link>
                </>
            }

            <div className="flex flex-row gap-8">
                <a href="https://discord.com/invite/vRznRhteEM" target="_blank">
                    <Image src="/discord_logo.svg" width={43} height={32} alt="Discord Invite" />
                </a>
                <a href="https://www.instagram.com/itskaiwl/" target="_blank">
                    <Image src="/instagram_logo.svg" width={35} height={36} alt="Instagram Link" />
                </a>
            </div>
            {
                !isLoggedIn ?
                <div className="flex flex-col gap-8 items-center mt-auto justify-center">
                    <Link href="/login" className="w-full text-center nav-link">Login</Link>
                    <Link href="/signup" className="button-primary">Signup</Link>
                </div> :
                <button className="button-primary mt-auto flex flex-row gap-3 items-center justify-center" onClick={signoutUser}>
                    <Image src="/logout.svg" width={33} height={33} alt="Logout" />
                    Logout
                </button>
            }
            
        </div>
    );
}

export default MobileMenu;