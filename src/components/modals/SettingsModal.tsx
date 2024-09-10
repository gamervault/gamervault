import Link from "next/link";
import { createClient } from "@/utils/supabase/component";

function SettingsModal({closeSettingsModal}: {closeSettingsModal: any}) {
    const supabase = createClient();
    
    async function signoutUser() {
        await supabase.auth.signOut();
        closeSettingsModal();
    }

    return (
        <div className="fixed mt-[4.5rem] z-50 right-0 mr-12 bg-bg-stroke-grey w-32 rounded-md shadow-center flex flex-col py-2 px-2 text-left items-start">
            <Link href="/activity" className="hover:bg-text-secondary-grey w-full py-2 px-2 rounded-md">Activity</Link>
            <Link href="/settings" className="hover:bg-text-secondary-grey w-full py-2 px-2 rounded-md">Settings</Link>
            <button onClick={signoutUser} className="hover:bg-text-secondary-grey text-left w-full py-2 px-2 rounded-md">Logout</button>
        </div>
    );
}

export default SettingsModal;