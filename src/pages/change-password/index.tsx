import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/component";
import { createClient as createServerClient } from "@/utils/supabase/server-props";
import { FormEvent } from "react";
import { GetServerSidePropsContext } from "next";
import { redirect } from "next/dist/server/api-utils";
import { EmailOtpType } from "@supabase/supabase-js";
import { stringOrFirstString } from "@/utils/helper";

type RefType = HTMLInputElement | null;


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const queryParams = context.query;
    if (!queryParams) {
        return {
            redirect: {
                destination: "/reset/reset-failed",
                permanent: false
            }
        }
    }

    const token_hash = stringOrFirstString(queryParams.token_hash);
    const type = stringOrFirstString(queryParams.type);
    if (token_hash && type) {
        const supabase = createServerClient(context);
        const {error} = await supabase.auth.verifyOtp({
            type: type as EmailOtpType,
            token_hash
        }); 
        if (error) {
            return {
                redirect: {
                    destination: "/reset/reset-failed",
                    temporary: false
                }
            } // means couldn't verify
        } else {
            return {
                props: {

                }
            } // basically, allow the user onto the page
        }
    }

    return {
        redirect: {
            destination: "/reset/reset-failed",
            permanent: false
        }
    }
}

function ChangePasswordPage() {
    // Supabase
    const supabase = createClient();

    // Form Data
    const [formData, setFormData] = useState({
        password: ""
    });
    // Error states
    const [validStates, setValidStates] = useState({
        password: true
    });
    const [submissionError, setSubmissionError] = useState("");

    // Cooldown
    const [isPending, setIsPending] = useState(false);

    // Refs
    const emailRef = useRef<RefType>(null); // the generic in here refers the the dataytpe of current
    const passwordRef = useRef<RefType>(null);

    // Update Password functions
    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!isPending) {
            setIsPending(true);
            const passwordValid = (passwordRef.current?.validity.valid) && (passwordRef.current?.value.length >= 8); 
            const emailValid = emailRef.current?.validity.valid;
            if (emailValid && passwordValid) {
                updatePassword();
                // createNewUser set isPending to false
            } else {
                setValidStates({
                    password: passwordValid || false
                });
                setIsPending(false);
            }
        }
    }

    async function updatePassword() {
        const {error, data} = await supabase.auth.updateUser({
            password: formData.password
        })

        if (error) {
            setSubmissionError(error.message);
        }

        setIsPending(false);
    }


    // Error Validation Functions
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

    return (
        <div className="w-full grid place-items-center min-h-[80vh]">
            <div className="rounded-md w-full max-w-[28rem] box-border flex flex-col p-8 border-2 border-bg-stroke-grey gap-4">
                <h1 className="text-xl font-bold text-center">Change Password</h1>

                {/* Email Password Form*/}
                <form className="w-full flex flex-col gap-2" noValidate onSubmit={handleSubmit}>
                    {/* Error message */}
                    {
                        submissionError !== "" &&
                        <div className="w-full rounded-md p-2 text-white bg-red-500 text-center font-medium mb-4">{submissionError}</div>
                    }

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
                        
                    <button type="submit" className="button-secondary">{isPending ? "Processing..." : "Update Password"}</button>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordPage;