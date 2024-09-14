import Image from "next/image";
import Link from "next/link";
import { CardProps } from "@/utils/types";
import { useState, useContext, useEffect } from "react";
import { createClient } from "@/utils/supabase/component";
import { UserDataContext } from "@/utils/context/UserDataContext";
import { useRouter } from "next/router";
import Heart from "./Heart";
import Bookmark from "./Bookmark";

function Card(props: CardProps) {
    
    // handle like and save functions here
    
    
    
    

    

    

    

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
                <Heart game_id={props.game_id} likes_count={props.likes_count} is_liked_by_user={props.is_liked_by_user} />
                
                <Bookmark is_saved_by_user={props.is_saved_by_user} game_id={props.game_id}/>
            </div>
        </div>
        
        
    );
}

export default Card;