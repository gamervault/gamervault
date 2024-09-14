import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/component";
import { FormEvent } from "react";
import Head from "next/head";

type RefType = HTMLInputElement | null;

function SignupPage() {
    // Supabase
    const supabase = createClient();

    // Form Data
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [submissionError, setSubmissionError] = useState("");
    
    // Cooldown
    const [isPending, setIsPending] = useState(false);

    // Refs
    const emailRef = useRef<RefType>(null); // the generic in here refers the the dataytpe of current
    const passwordRef = useRef<RefType>(null);

    // Sign up functions
    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!isPending) {
            setIsPending(true);
            const passwordValid = (passwordRef.current?.validity.valid) && (passwordRef.current?.value.length >= 8); 
            const emailValid = emailRef.current?.validity.valid;
            if (emailValid && passwordValid) {
                loginUser()
                // createNewUser set isPending to false
            } else {
                setSubmissionError("Wrong username and/or password");
                setIsPending(false);
            }
        }
    }

    async function loginUser() {
        const {data, error} = await supabase.auth.signInWithPassword(formData);
        if (error) {
            setSubmissionError("Wrong username and/or password");
        }

        setIsPending(false);
    }

    async function signInWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider:"google",
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_HOST_URL!}/api/auth/confirm-oauth`
            }
        }); 
    }

    // Error Validation Functions
    function handleEmailChange() {
        const emailValid = emailRef.current?.validity.valid;
        setFormData((oldState) => {
            return {
                ...oldState,
                email: emailRef.current?.value || ""
            }
        })
    }

    function handlePasswordChange() {
        const passwordValid = (passwordRef.current?.validity.valid) && (passwordRef.current?.value.length >= 8); 
        setFormData((oldState) => {
            return {
                ...oldState,
                password: passwordRef.current?.value || ""
            }
        })
    }


    return (
        <div className="w-full grid place-items-center mt-12">
            <Head>
                <title>Login - Gamervault</title>
            </Head>
            <div className="rounded-md w-full max-w-[28rem] box-border flex flex-col p-8 border-2 border-bg-stroke-grey gap-4">
                <h1 className="text-xl font-bold text-center">Log in to Gamervault!</h1>

                {/* OAuth */}
                <div className="text-center w-full">
                    <button className="button-primary px-4 py-3 border-[1px] font-medium w-full flex items-center justify-center gap-2" onClick={signInWithGoogle}>
                        <Image src="/google_logo.svg" width={32} height={32} className="w-6" alt="Google logo" />
                        Sign in with Google
                    </button>
                </div>

                <hr className="border-bg-stroke-grey "/>

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

                    {/* Password */}
                    <div className="flex flex-col gap-2 mb-6">
                        <label htmlFor="password-input" className="font-medium">Password <span className="text-red-500">*</span></label>
                        <input type="password" 
                            id="password-input"
                            className="outline-none border-[1px] border-bg-stroke-grey w-full rounded-md bg-transparent py-2 px-3 placeholder:text-text-secondary-grey bg-none"
                            placeholder="Enter password here"
                            required 
                            ref={passwordRef}
                            onChange={handlePasswordChange}
                            value={formData.password} />
                    </div>
                        
                    <button type="submit" className="button-secondary">{isPending ? "Processing..." : "Sign in!"}</button>
                </form>
                
                {/* Bottom Links */}
                <div className="text-center text-sm flex flex-col gap-1">
                    <p>Don{"'"}t have an account? <Link href="/signup" className="text-blue">Sign up here.</Link></p>
                    <p>Forgot your password? <Link href="/reset" className="text-blue">Reset it here.</Link></p>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;