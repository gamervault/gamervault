import Image from "next/image";
import Link from "next/link";
import { CardProps } from "@/utils/types";
import { useState, useContext, useEffect } from "react";
import { createClient } from "@/utils/supabase/component";
import { UserDataContext } from "@/utils/context/UserDataContext";
import { useRouter } from "next/router";

function Card(props: CardProps) {
    const router = useRouter();
    const supabase = createClient();
    // handle like and save functions here
    const [liked, setLiked] = useState(props.is_liked_by_user);
    const [saved, setSaved] = useState(props.is_saved_by_user);
    const [tempLikesCount, setTempLikesCount] = useState(props.likes_count);
    const [isPending, setIsPending] = useState(false);
    const userData = useContext(UserDataContext);

    

    async function likeGame() {
        if (!isPending) {
            setIsPending(true);
            
            if (userData) {
                if (!liked) {
                    const {error} = await supabase.from("liked_games").insert({
                        game_id: props.game_id,
                        user_id: userData.id
                    });
                    if (!error) {
                        setLiked(true);
                        setTempLikesCount(props.is_liked_by_user ? props.likes_count : props.likes_count + 1);
                    } else {
                        console.log(error);
                    }
                } else {
                    const {data, error} = await supabase.from("liked_games").delete().eq("user_id", userData.id).eq("game_id", props.game_id).select();
                    if (!error) {
                        console.log(data);
                        setLiked(false);
                        setTempLikesCount(props.is_liked_by_user ? props.likes_count - 1 : props.likes_count);
                    }
                }
                
            } else {
                router.push("/login");
            }
            setIsPending(false);
        }
    }

    async function saveGame() {
        if (!isPending) {
            setIsPending(true);
            
            if (userData) {
                if (!saved) {
                    const {error} = await supabase.from("saved_games").insert({
                        game_id: props.game_id,
                        user_id: userData.id
                    });
                    if (!error) {
                        setSaved(true);
                    } else {
                        console.log(error);
                    }
                } else {
                    const {data, error} = await supabase.from("saved_games").delete().eq("user_id", userData.id).eq("game_id", props.game_id).select();
                    if (!error) {
                        console.log(data);
                        setSaved(false);
                    }
                }
                
            } else {
                router.push("/login");
            }
            setIsPending(false);
        }
    }

    return (
        <div className="flex-shrink-0 max-w-64 overlay-container place-items-start transition-all hover:scale-105 hover:shadow-center">
            <Link href={`/games/game/${props.game_id}`} className="text-left overlay-element">
                <div className="flex flex-col gap-2">
                    <Image src={props.image_url} width={600} height={600} alt="Game icon" className="rounded-lg w-full aspect-square object-cover overlay-element" />
                        
                    <h3 className="text-lg font-medium line-clamp-1 text-ellipsis">{props.title}</h3>
                    <p className="text-text-primary-light-grey line-clamp-4 text-ellipsis text-wrap">{props.description}</p>
                </div>
            </Link>

            <div style={{pointerEvents:"none"}} className="flex flex-row items-center p-3 overlay-element w-full aspect-square card-gradient">
                <div className="flex flex-row items-center mt-auto gap-2">
                    <button style={{pointerEvents:"auto"}} onClick={likeGame}>
                        <Image src={liked ? "/heart_selected.svg" : "/heart_unselected.svg"} width={36} height={31} alt="Heart icon" className="w-7" />
                    </button>
                    <p className="text-2xl font-medium">{tempLikesCount}</p>
                </div>
                
                <button style={{pointerEvents:"auto"}} className="ml-auto mt-auto" onClick={saveGame}>
                    <Image src={saved ? "/bookmark_selected.svg" : "/bookmark_unselected.svg"} width={29} height={35} alt="Save icon" className="w-5" />
                </button>
            </div>
        </div>
        
        
    );
}

export default Card;