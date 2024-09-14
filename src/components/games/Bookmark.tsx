import { useState, useContext } from "react";
import { UserDataContext } from "@/utils/context/UserDataContext";
import { useRouter } from "next/router";
import { createClient } from "@/utils/supabase/component";
import Image from "next/image";

type BookmarkProps = {
    is_saved_by_user: boolean,
    game_id: string,
    className?: string
}

function Bookmark(props: BookmarkProps) {
    const router = useRouter();
    const supabase = createClient();
    const [saved, setSaved] = useState(props.is_saved_by_user);
    const [isPending, setIsPending] = useState(false);
    const userData = useContext(UserDataContext);


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
        <button style={{pointerEvents:"auto"}} className={`ml-auto mt-auto ${props.className || ""}`} onClick={saveGame}>
            <Image src={saved ? "/bookmark_selected.svg" : "/bookmark_unselected.svg"} width={29} height={35} alt="Save icon" className="w-5" />
        </button>
    );
}

export default Bookmark;