import Link from "next/link";
import Image from "next/image";
import { HorizontalCardListProps } from "@/utils/types";
import Card from "./Card";

function HorizontalCardList(props: HorizontalCardListProps) {
    const gamesCards = props.gameList.map((game, index) => {
        return <Card key={game.game_id} {...game} />
    });

    return (
        <div className="w-full flex flex-col lg:px-4">
            <Link href={props.redirectTo} className="flex gap-4 hover:underline underline-offset-4 items-center">
                <h2 className="text-3xl font-bold">{props.sectionTitle}</h2>
                <Image src="/right_arrow.svg" width={18} height={16} alt="View more" className="w-6"/>
            </Link>
            
            {/* Card Container */}
            <div className="flex flex-row gap-8 w-full overflow-x-scroll no-scrollbar py-6 overflow-y-none px-4 -ml-4">
                {gamesCards}
            </div>
        </div>
    );
}

export default HorizontalCardList