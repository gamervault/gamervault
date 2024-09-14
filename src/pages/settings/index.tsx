import { createClient } from "@/utils/supabase/component";
import { useContext, useState } from "react";
import { UserDataContext } from "@/utils/context/UserDataContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function SettingsPage() {
    const supabase = createClient();
    const user = useContext(UserDataContext);
    const email = user?.email;
    const [isPending, setIsPending] = useState(false);

    async function resetPassword() {
        if (!email) {
            return
        }
        setIsPending(true);
        const {data, error} = await supabase.auth.resetPasswordForEmail(email)
        if (error) {
            toast.error("Uh oh! Please try again later.", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
                });
        } else {
            toast.success("Success! An email has been sent to you!",{
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
        setIsPending(false);
    }
    
    
    return (
        <div className="pt-4 flex flex-col gap-6">
            <ToastContainer />
            <h1 className="text-4xl font-bold">Settings</h1>

            {/* Reset Password */}
            <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">Password Settings</h3>
                <p className="text-text-primary-light-grey">Click below and we{"'"}ll send a link and instructions for how to change your password.</p>
                <button className="button-secondary max-w-72 mt-4" onClick={resetPassword}>Reset Password</button>
            </div>
        </div>
    );
}

export default SettingsPage;