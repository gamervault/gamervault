import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/component";
import { FormEvent } from "react";
import Head from "next/head";

type RefType = HTMLInputElement | null;

function ResetPage() {
    // Supabase
    const supabase = createClient();

    // Form Data
    const [formData, setFormData] = useState({
        email: ""
    });
    const [submissionError, setSubmissionError] = useState("");
    
    // Cooldown
    const [isPending, setIsPending] = useState(false);

    // Refs
    const emailRef = useRef<RefType>(null); // the generic in here refers the the dataytpe of current

    // Reset functions
    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!isPending) {
            setIsPending(true);
            resetPassword();
        }
    }

    async function resetPassword() {
        const {data, error} = await supabase.auth.resetPasswordForEmail(formData.email)
        if (error) {
            setSubmissionError(error.message);
        } else {
            setSubmissionError("");
        }
        setIsPending(false);
    }
    

    // Error Validation Functions
    function handleEmailChange() {
        setFormData((oldState) => {
            return {
                ...oldState,
                email: emailRef.current?.value || ""
            }
        })
    }


    return (
        <div className="w-full grid place-items-center mt-12">
            <Head>
                <title>Reset - Gamervault</title>
            </Head>
            <div className="rounded-md w-full max-w-[28rem] box-border flex flex-col p-8 border-2 border-bg-stroke-grey gap-4">
                <h1 className="text-xl font-bold text-center">Reset your password</h1>

                {/* Email Password Form*/}
                <form className="w-full flex flex-col gap-2" noValidate onSubmit={handleSubmit}>
                    {/* Error message */}
                    {
                        submissionError !== "" &&
                        <div className="w-full rounded-md p-2 text-white bg-red-500 text-center font-medium mb-4">{submissionError}</div>
                    }

                    {/* Email */}
                    <div className="flex flex-col gap-2 mb-4">
                        <label htmlFor="email-input" className="font-medium">Email Address <span className="text-red-500">*</span></label>
                        <input type="email" 
                            id="email-input"
                            className="outline-none border-[1px] border-bg-stroke-grey w-full rounded-md bg-transparent py-2 px-3 placeholder:text-text-secondary-grey"
                            placeholder="Enter email here"
                            required
                            ref={emailRef}
                            onChange={handleEmailChange}
                            value={formData.email} />
                    </div>
                        
                    <button type="submit" className="button-secondary">{isPending ? "Processing..." : "Send reset email"}</button>
                </form>
                
                {/* Bottom Links */}
                <div className="text-center text-sm flex flex-col gap-1">
                    <p>Don't have an account? <Link href="/signup" className="text-blue">Sign up here.</Link></p>
                    <p>Trying to sign in? <Link href="/login" className="text-blue">Log in here.</Link></p>
                </div>
            </div>
        </div>
    );
}

export default ResetPage;