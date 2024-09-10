export type CardProps = {
    game_id: string,
    title: string,
    description: string,
    likes_count: number,
    is_liked_by_user: boolean,
    is_saved_by_user: boolean
    image_url: string
}

export type HorizontalCardListProps = {
    gameList: CardProps[],
    sectionTitle: string,
    redirectTo: string
}