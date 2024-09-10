import { GetServerSidePropsContext } from "next";
import { stringOrFirstString } from "@/utils/helper";
import { createClient } from "@/utils/supabase/server-props";
import { createClient as createBrowserClient } from "@/utils/supabase/component";

type GameDetailsPageProps = {
    title: string,
    gameUrl: string,
    imageUrl: string,
    description: string,
    likes_count: number,
    is_liked_by_user: boolean,
    is_saved_by_user: boolean,
    tags: string[]
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


}

function GameDetails() {
    return (
        <div>

        </div>
    );
}

export default GameDetails;