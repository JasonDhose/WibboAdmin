export interface UserData {
    id: number
    username: string
    rank: number
}

declare module 'h3' {
    interface H3EventContext {
        user?: UserData
    }
}

export {}
