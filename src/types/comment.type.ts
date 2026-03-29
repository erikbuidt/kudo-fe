import type { MediaType } from './kudo.type';

export interface CommentUser {
    id: string;
    username: string;
    display_name?: string;
    avatar_url?: string;
}

export interface Comment {
    id: string;
    kudo_id: string;
    user_id: string;
    content: string;
    media_url?: string;
    media_type?: MediaType;
    created_at: string;
    user: CommentUser;
}

export interface CreateCommentPayload {
    kudo_id: string;
    content: string;
    media_url?: string;
    media_type?: MediaType;
}
