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


type HomePageProps = {
    underratedGames: CardProps[],
    leastUpvotedGames: CardProps[],
    error?: any,
    isLoaded: boolean
}

async function fetchGameLists(supabase: SupabaseClient, user_id: string) {
    const {data: underratedGamesData, error: underratedGamesError} = await supabase.rpc("all_underrated_games", {
        user_id: user_id,
        page: 0,
        n_results: 10
    });
    const {data: leastUpvotedGamesData, error: leastUpvotedGamesError} = await supabase.rpc("least_upvoted_games", {
        user_id: user_id,
        page: 0,
        n_results: 10
    });
    return {underratedGamesData, leastUpvotedGamesData, underratedGamesError, leastUpvotedGamesError}
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createClient(context);
    const {data, error} = await supabase.auth.getUser();
    let underratedGamesList: CardProps[] = [];
    let leastUpvotedGamesList: CardProps[] = [];
    let userId = process.env.NEXT_PUBLIC_DUMMY_UUID!; // if user doesn't exist, then dummy id for user with no likes
    if (!error) {
        userId = data.user.id;
    }

    // Fetch user data
    const {
        underratedGamesData, leastUpvotedGamesData,
        underratedGamesError, leastUpvotedGamesError
    } = await fetchGameLists(supabase, userId);

    // Return nothing if there is an error
    if (!underratedGamesError) {
        underratedGamesList = underratedGamesData;
    }
    if (!leastUpvotedGamesError) {
        leastUpvotedGamesList = leastUpvotedGamesData;
    }

    return {
        props: {
            underratedGames: underratedGamesList,
            leastUpvotedGames: leastUpvotedGamesList,
            isLoaded: true,
            // error: referer
        }
    }
}

function HomePage(props: HomePageProps) {
    return (
        <div className="flex flex-col items-center py-6 pt-20 gap-16">
            <Head>
                <title>Home - Gamervault</title>
            </Head>

            {/* Top Section */}
            <div className="w-full flex flex-col items-center gap-4">
                <h1 className="text-5xl font-extrabold text-center mb-10">Find your next favorite <span className="bg-gradient-to-b from-light-blue to-dark-blue bg-clip-text text-transparent">game!</span></h1>
                
                {/* Search Bar */}
                <SearchBar />

                <p className="text-text-secondary-grey max-w-[42rem] text-center"><span className="font-bold">Pro Tip:</span> You can describe the game you{"'"}re looking for. Our search uses AI to find the games the best match your description.</p>

            </div>

            {/* All Games */}
            <HorizontalCardList 
                gameList={props.underratedGames} 
                sectionTitle="All Underrated Games" 
                redirectTo="/games/all" />

            {/* Least Upvoted */}
            <HorizontalCardList 
                gameList={props.leastUpvotedGames} 
                sectionTitle="Least Upvoted Games" 
                redirectTo="/games/least-upvoted" />
        </div>
    );
}

export default HomePage;