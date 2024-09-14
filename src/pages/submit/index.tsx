import { useRef, useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/component";
import { FormEvent } from "react";
import Head from "next/head";
import { LoggedInContext } from "@/utils/context/LoggedInContext";

type RefType = HTMLInputElement | null;

function SubmitPage() {
    // Supabase
    const supabase = createClient();
    const isLoggedIn = useContext(LoggedInContext);

    // Form Data
    const [formData, setFormData] = useState({
        title: "",
        url: ""
    });
    const [submissionError, setSubmissionError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    
    // Cooldown
    const [isPending, setIsPending] = useState(false);

    // Refs
    const titleRef = useRef<RefType>(null); // the generic in here refers the the dataytpe of current
    const urlRef = useRef<RefType>(null);

    // Submission Functions
    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!isPending) {
            setIsPending(true);
            const urlValid = (urlRef.current?.validity.valid);
            const titleValid = titleRef.current?.validity.valid;
            if (titleValid && urlValid && isLoggedIn) {
                submitGame();
            } else {
                setSubmissionError("Please fill out all the fields");
                setSuccessMessage("");
                setIsPending(false);
            }
        }
    }

    async function submitGame() {
        const {error} = await supabase.from("submitted_games").insert({
            title: formData.title,
            game_url: formData.url
        });
        setFormData({
            title:"",
            url:""
        });
        if (error) {
            setSubmissionError("Failed to upload game for submission. Please try again later.");
            setSuccessMessage("");
        } else {
            setSuccessMessage("Successfully submitted game! Please allow for up to a few days for your submission to be processed!");
            setSubmissionError("");
        }
        setIsPending(false);
    }

    // Set form data
    function handleTitleChange() {
        setFormData((oldState) => {
            return {
                ...oldState,
                title: titleRef.current?.value || ""
            }
        })
    }

    function handleURLChange() {
        setFormData((oldState) => {
            return {
                ...oldState,
                url: urlRef.current?.value || ""
            }
        })
    }


    return (
        <div className="w-full grid place-items-center mt-12">
            <Head>
                <title>Submit - Gamervault</title>
            </Head>
            <div className="rounded-md w-full max-w-[28rem] box-border flex flex-col p-8 border-2 border-bg-stroke-grey gap-4">
                <h1 className="text-2xl font-bold text-center">Submit a game!</h1>

                <p className="text-text-secondary-grey text-center">If you want a game to be uploaded to this site, submit it here! All submissions are manually processed to ensure high quality</p>

                {/* Email Password Form*/}
                <form className="w-full flex flex-col gap-2" noValidate onSubmit={handleSubmit}>
                    {/* Error message */}
                    {
                        submissionError !== "" &&
                        <div className="w-full rounded-md p-2 text-white bg-red-500 text-center font-medium mb-4">{submissionError}</div>
                    }

                    {/* Error message */}
                    {
                        successMessage !== "" &&
                        <div className="w-full rounded-md p-2 text-white bg-green-600 text-center font-medium mb-4">{successMessage}</div>
                    }

                    {/* Title */}
                    <div className="flex flex-col gap-2 mb-4">
                        <label htmlFor="title-input" className="font-medium">Game title <span className="text-red-500">*</span></label>
                        <input type="text" 
                            id="title-input"
                            className="outline-none border-[1px] border-bg-stroke-grey w-full rounded-md bg-transparent py-2 px-3 placeholder:text-text-secondary-grey"
                            placeholder="Enter title here"
                            required
                            ref={titleRef}
                            onChange={handleTitleChange}
                            maxLength={100}
                            value={formData.title} />
                    </div>

                    {/* URL */}
                    <div className="flex flex-col gap-2 mb-6">
                        <label htmlFor="url-input" className="font-medium">Link to the game <span className="text-red-500">*</span></label>
                        <input type="text" 
                            id="url-input"
                            className="outline-none border-[1px] border-bg-stroke-grey w-full rounded-md bg-transparent py-2 px-3 placeholder:text-text-secondary-grey bg-none"
                            placeholder="Enter game link here"
                            required 
                            ref={urlRef}
                            onChange={handleURLChange}
                            value={formData.url} />
                    </div>
                        
                    <button type="submit" className="button-secondary">{isPending ? "Processing..." : "Submit!"}</button>
                </form>
                
            </div>
        </div>
    );
}

export default SubmitPage;