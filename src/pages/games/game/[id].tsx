import { GetServerSidePropsContext } from "next";
import { stringOrFirstString } from "@/utils/helper";
import { createClient } from "@/utils/supabase/server-props";
import { createClient as createBrowserClient } from "@/utils/supabase/component";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/games/SearchBar";
import Heart from "@/components/games/Heart";
import Bookmark from "@/components/games/Bookmark";

type GameDetailsPageProps = {
    gameId: string,
    gameData?: {
        title: string,
        game_url: string,
        image_url: string,
        description: string,
        likes_count: number,
        is_liked_by_user: boolean,
        is_saved_by_user: boolean,
        tags: string[]
    },
    error?: string
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const gameId = stringOrFirstString(context.params?.id);
    if (!gameId) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    const supabase = createClient(context);
    const {data: userData, error: userError} = await supabase.auth.getUser();
    let userId = process.env.NEXT_PUBLIC_DUMMY_UUID!;
    if (!userError) {
        userId = userData.user.id;
    }

    const {data: gameData, error: gameDataError} = await supabase.rpc("fetch_game_data", {
        user_id: userId,
        game_id: gameId
    });

    if (gameDataError) {
        return {
            props: {
                error: "An error while fetching the game data has occurred!",
                gameId: gameId
            }
        }
    }
    if (Array.isArray(gameData) && gameData.length > 0) {
        return {
            props: {
                gameData: gameData[0],
                gameId: gameId
            }
        }
    } else {
        return {
            props: {
                error: "This game does not exist!",
                gameId: gameId
            }
        }
    }
    

}

function GameDetails(props: GameDetailsPageProps) {
    const {gameData, error} = props;
    if (error || !gameData) {
        return (
            <div className="w-full flex flex-col items-center gap-12 min-h-[80vh] justify-center">
                <h1 className="text-3xl font-bold text-center">Uh oh! {error}</h1>
                <Link href="/" className="button-secondary w-full max-w-96 text-lg font-medium text-center">Return home</Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <SearchBar className="py-3 max-w-full"/>
            <div className="mt-6 md:p-6 w-full max-w-[70rem]">
                <div className="flex flex-col items-center justify-between md:gap-12 md:flex-row gap-4">
                    <h1 className="text-3xl font-bold md:hidden">{gameData.title}</h1>
                    <Image src={gameData.image_url || ""} width={600} height={600} alt={`Image of ${gameData.title}`} className="md:max-w-[45%] w-full rounded-md mb-4" />  
                    <div className="flex flex-col w-full md:max-w-[min(45%,36rem)] text-center md:text-left gap-8">
                        <h1 className="text-4xl font-extrabold hidden md:block">{gameData.title}</h1>
                        <a href={gameData.game_url || ""} target="_blank" className="button-secondary text-center text-xl">Play here!</a>
                        <div className="flex w-full items-center justify-center md:justify-start gap-24 md:gap-12">
                            <Heart game_id={props.gameId} is_liked_by_user={gameData.is_liked_by_user} likes_count={gameData.likes_count} />
                            <Bookmark game_id={props.gameId} is_saved_by_user={gameData.is_saved_by_user} className="ml-0 mt-0" />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="w-full mt-6 flex flex-col gap-4">
                    <h2 className="text-3xl font-bold text-left">Description</h2>
                    <p>{gameData.description}</p>
                </div>
            </div>
            
        </div>
    );
}

export default GameDetails;