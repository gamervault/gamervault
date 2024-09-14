import { useState, useContext } from "react";
import { UserDataContext } from "@/utils/context/UserDataContext";
import { useRouter } from "next/router";
import { createClient } from "@/utils/supabase/component";
import Image from "next/image";

type HeartProps = {
    likes_count: number,
    is_liked_by_user: boolean,
    game_id: string
}

function Heart(props: HeartProps) {
    const router = useRouter();
    const supabase = createClient();
    const [tempLikesCount, setTempLikesCount] = useState(props.likes_count);
    const [liked, setLiked] = useState(props.is_liked_by_user);
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
    return (
        <div className="flex flex-row items-center mt-auto gap-2">
            <button style={{pointerEvents:"auto"}} onClick={likeGame}>
                <Image src={liked ? "/heart_selected.svg" : "/heart_unselected.svg"} width={36} height={31} alt="Heart icon" className="w-7" />
            </button>
            <p className="text-2xl font-medium">{tempLikesCount}</p>
        </div>
    );
}

export default Heart;