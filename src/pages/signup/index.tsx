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
    // Error states
    const [validStates, setValidStates] = useState({
        email: true,
        password: true
    });
    const [submissionError, setSubmissionError] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [submittedUserData, setSubmittedUserData] = useState({
        email: "",
        password: ""
    });
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
                createNewUser();
                // createNewUser set isPending to false
            } else {
                setValidStates({
                    email: emailValid || false,
                    password: passwordValid || false
                });
                setIsPending(false);
            }
        }
    }

    async function createNewUser() {
        const {data, error} = await supabase.auth.signUp({
            ...formData
        });

        

        if (error) {
            setSubmissionError(error.message);
            setSuccessful(false);
        } else if (data.user == null) {
            setSubmissionError("Failed to create user");
            setSuccessful(false);
        } else if (!data.user.identities || data.user.identities.length == 0) {
            setSubmissionError("Email already in use");
            setSuccessful(false);
        } else {
            // successful
            setSuccessful(true);
            setSubmissionError("");
            setSubmittedUserData({...formData});
        }

        setFormData({
            email: "",
            password: ""
        });

        setIsPending(false);
    }

    async function resendVerificationEmail() {
        // just resigns up the user lmao
        const {data, error} = await supabase.auth.signUp({
            ...submittedUserData
        });
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
        setValidStates((oldState) => {
            return {
                ...oldState,
                email: emailValid || false
            }
        });
        setFormData((oldState) => {
            return {
                ...oldState,
                email: emailRef.current?.value || ""
            }
        })
    }

    function handlePasswordChange() {
        const passwordValid = (passwordRef.current?.validity.valid) && (passwordRef.current?.value.length >= 8); 
        setValidStates((oldState) => {
            return {
                ...oldState,
                password: passwordValid || false
            }
        });
        setFormData((oldState) => {
            return {
                ...oldState,
                password: passwordRef.current?.value || ""
            }
        })
    }


    // When user submits, basically instead of showing sign up form, show them verification form
    if (successful) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <Head>
                    <title>Signup - Gamervault</title>
                </Head>
                <div className="rounded-md border-bg-stroke-grey border-2 max-w-full w-[32rem] box-border p-8 flex flex-col gap-4 text-center">
                    <h1 className="text-xl font-semibold text-center mb-2">Verify email address</h1>
                    <p className="mb-2 font-light">A verification email has been sent to <span className="text-blue">{submittedUserData.email}</span></p>
                    <button className="button-secondary w-full text-lg font-medium" onClick={resendVerificationEmail}>Resend verification email</button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full grid place-items-center mt-12">
            <Head>
                <title>Signup - Gamervault</title>
            </Head>

            <div className="rounded-md w-full max-w-[28rem] box-border flex flex-col p-8 border-2 border-bg-stroke-grey gap-4">
                <h1 className="text-xl font-bold text-center">Sign up for Gamervault!</h1>

                {/* OAuth */}
                <div className="text-center w-full">
                    <button className="button-primary px-4 py-3 border-[1px] font-medium w-full flex items-center justify-center gap-2" onClick={signInWithGoogle}>
                        <Image src="/google_logo.svg" width={32} height={32} className="w-6" alt="Google logo" />
                        Sign up with Google
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
                        {
                            !validStates.email && 
                            <p className="text-red-500 text-sm">Please enter a valid email address.</p>
                        }
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
                        {
                            !validStates.password && 
                            <p className="text-red-500 text-sm">Password must be greater than 8 characters long.</p>
                        }
                    </div>
                        
                    <button type="submit" className="button-secondary">{isPending ? "Processing..." : "Create account!"}</button>
                </form>
                
                {/* Bottom Links */}
                <div className="text-center text-sm flex flex-col gap-1">
                    <p>Already have an account? <Link href="/login" className="text-blue">Log in here.</Link></p>
                    <p>Forgot your password? <Link href="/reset" className="text-blue">Reset it here.</Link></p>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;