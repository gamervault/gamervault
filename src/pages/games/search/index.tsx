import SearchBar from "@/components/games/SearchBar";
import { CardProps } from "@/utils/types";
import Card from "@/components/games/Card";
import { GetServerSidePropsContext } from "next";
import { createClient } from "@/utils/supabase/server-props";
import { stringOrFirstString } from "@/utils/helper";
import OpenAI from "openai";
import Head from "next/head";

type SearchPageProps = {
    query: string,
    gamesList: CardProps[]
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const queryParams = context.query;
    let searchQuery = stringOrFirstString(queryParams.query);

    if (searchQuery) {
        if (searchQuery.length > 500) {
            searchQuery = searchQuery.substring(0, 500); // limit to 500 characters so openai doesn't get abused
        }
        const supabase = createClient(context);
        const openai = new OpenAI({apiKey: process.env.OPENAI_KEY!})
        const results = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: searchQuery,
            encoding_format: "float",
            dimensions: 512
        });
        const data = results.data;
        if (data.length > 0) {
            const embedding = data[0]["embedding"];

            const {data: userData, error: userDataError} = await supabase.auth.getUser();
            let userId = process.env.NEXT_PUBLIC_DUMMY_UUID!;
            if (!userDataError) {
                userId = userData.user.id;
            }

            const {data: searchData, error: searchError} = await supabase.rpc("hybrid_search",{
                user_id: userId,
                query_text: searchQuery,
                query_embedding: embedding,
                match_count: 30,
                full_text_weight: 1,
                embedding_weight: 1,
                rrf_k: 50
            });

            if (searchError) {
                return {
                    props: {
                        query: searchQuery,
                        gamesList: []
                    }
                }
            }

            return {
                props: {
                    query: searchQuery,
                    gamesList: searchData
                }
            }
        } else {
            return {
                props: {
                    query: searchQuery,
                    gamesList: []
                }
            }
        }
    }

    return {
        redirect: {
            destination: "/",
            permanent: false
        }
    }
}

function SearchPage(props: SearchPageProps) {
    const gamesCards = props.gamesList.map((game, index) => {
        return <Card key={game.game_id} {...game} />
    });
    

    return (
        <div className="flex flex-col gap-6 py-3">
            <Head>
                <title>Search - Gamervault</title>
            </Head>

            <SearchBar className="py-3 max-w-full"/>
            <h1 className="text-3xl font-extrabold text-center sm:text-left line-clamp-1 text-ellipsis">{`\"${props.query}\"`}</h1>

            {/* Games Grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] justify-items-center sm:grid-cols-[repeat(auto-fill,minmax(12.5rem,1fr))]  gap-8">
                {gamesCards}
            </div>
        </div>
    );
}

export default SearchPage;