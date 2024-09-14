// Next/React
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useContext } from "react";
// Utils
import {createClient} from "@/utils/supabase/server-props";
import { createClient as createBrowserClient } from "@/utils/supabase/component";
import { CardProps } from "@/utils/types";
import { UserDataContext } from "@/utils/context/UserDataContext";
import { SupabaseClient } from "@supabase/supabase-js";
// Components
import { GetServerSidePropsContext } from "next";
import HorizontalCardList from "@/components/games/HorizontalCardList";
import SearchBar from "@/components/games/SearchBar";


type ActivityPageProps = {
    savedGames: CardProps[],
    likedGames: CardProps[],
    error?: any,
    isLoaded: boolean
}

async function fetchGameLists(supabase: SupabaseClient, user_id: string) {
    const {data: savedGamesData, error: savedGamesError} = await supabase.rpc("get_saved_games", {
        user_id: user_id,
        page: 0,
        n_results: 10
    });
    const {data: likedGamesData, error: likedGamesError} = await supabase.rpc("get_liked_games", {
        user_id: user_id,
        page: 0,
        n_results: 10
    });
    return {savedGamesData, savedGamesError, likedGamesData, likedGamesError}
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createClient(context);
    const {data, error} = await supabase.auth.getUser();
    let savedGamesList: CardProps[] = [];
    let likedGamesList: CardProps[] = [];
    let userId = process.env.NEXT_PUBLIC_DUMMY_UUID!; // if user doesn't exist, then dummy id for user with no likes
    if (!error) {
        userId = data.user.id;
    } else {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    // Fetch user data
    const {
        savedGamesData, savedGamesError,
        likedGamesData, likedGamesError
    } = await fetchGameLists(supabase, userId);

    // Return nothing if there is an error
    if (!savedGamesError) {
        savedGamesList = savedGamesData.map((game: CardProps) => {
            return {
                ...game,
                is_saved_by_user: true
            }
        });
    }
    if (!likedGamesError) {
        likedGamesList = likedGamesData.map((game: CardProps) => {
            return {
                ...game,
                is_liked_by_user: true
            }
        });
    }

    return {
        props: {
            savedGames: savedGamesList,
            likedGames: likedGamesList,
            isLoaded: true,
            // error: referer
        }
    }
}

function ActivityPage(props: ActivityPageProps) {
    return (
        <div className="flex flex-col items-center py-6 gap-16">
            <Head>
                <title>Activity - Gamervault</title>
            </Head>
            {/* All Games */}
            <HorizontalCardList 
                gameList={props.likedGames} 
                sectionTitle="Liked Games" 
                redirectTo="/activity/liked" />

            {/* Least Upvoted */}
            <HorizontalCardList 
                gameList={props.savedGames} 
                sectionTitle="Saved Games" 
                redirectTo="/activity/saved" />
        </div>
    );
}

export default ActivityPage;