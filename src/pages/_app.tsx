import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { inter } from "@/utils/fonts";
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
// Utils
import { createClient } from "@/utils/supabase/component";
import { LoggedInContext } from "@/utils/context/LoggedInContext";
import { UserDataContext } from "@/utils/context/UserDataContext";
import { jwtDecode } from "jwt-decode";
import { createClient as createServerClient } from "@/utils/supabase/server-props";
// Components
import Navbar from "@/components/static/Navbar";
import { User } from "@supabase/supabase-js";
import Footer from "@/components/static/Footer";


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<User | null | undefined>(null);
  const [displayFooter, setDisplayFooter] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  

  // updates the signed in/signed out locally
  useEffect(() => {
    async function initialSignin() {
      const {data, error} = await supabase.auth.getSession();
      if (error != null || data.session == null) {
        setIsLoggedIn(false);
        setUserData(null);
      } else {
        setIsLoggedIn(true);
        setUserData(data.session.user);
      }
      // getSession -- gets the local session on client
      // getUser -- compares the local session to the server, and returns user if session is valid
    }  

    const authChangeSubscription = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        if (session!=null) {
          setIsLoggedIn(true);
          setUserData(session.user);
        }
      } else if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        setUserData(null);
        router.reload();
      } else if (event === "INITIAL_SESSION") {
        initialSignin();
        setIsInitialRender(false);
      }
    }); 
    return () => authChangeSubscription.data.subscription.unsubscribe();
  }, []);

  // Prevents users from accessing pages based on logged in/out
  useEffect(() => {
    if (isLoggedIn && (router.pathname === "/login" || router.pathname === "/signup" || router.pathname === "/reset")) {
      router.push("/");
    } else if (!isLoggedIn && (router.pathname === "/submit" || router.pathname === "/settings" || router.pathname === "/activity")) {
      if (!isInitialRender) {
        router.push("/");
      }  
    }

    // Footer display
    if (router.pathname === "/" || router.pathname.startsWith("/games") || router.pathname === "/settings" || router.pathname.startsWith("/activity")) {
      setDisplayFooter(true);
    } else {
      setDisplayFooter(false);
    }
    
  }, [router, isLoggedIn, isInitialRender])
  


  return (
    <div className={`${inter.className} text-off-white min-h-[100dvh] flex flex-col`}>
      <Head>
        <title>Gamervault</title>
      </Head>

      <UserDataContext.Provider value={userData}>
        <LoggedInContext.Provider value={isLoggedIn}>
          <Navbar />

          <div className="px-6 md:px-12 py-6 mt-14">
            <Component {...pageProps} />
          </div>
        </ LoggedInContext.Provider>
      </UserDataContext.Provider>

      
      {
        displayFooter && 
        <Footer />
      }
    </div>
  );
}