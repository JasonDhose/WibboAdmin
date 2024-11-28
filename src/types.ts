export interface UserData {
    id: number
    username: string
    rank: number
}

export interface NotificationAlert {
    id: number
    message: string
    success: boolean
    copy?: string
}
