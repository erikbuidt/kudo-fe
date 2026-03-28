import { http } from '@/utils/http';
import { type SuccessResponseApi } from '@/types/util.type';
import axios from 'axios';
import type { MediaType } from '@/types/kudo.type';

export interface PresignedUrlResponse {
    presigned_url: string;
    media_url: string;
    media_type: MediaType;
}

export const mediaApi = {
    getPresignedUrl: (filename: string) => {
        return http.get<SuccessResponseApi<PresignedUrlResponse>>('media/presigned-url', {
            params: { filename }
        });
    },
    uploadFile: async (url: string, file: File) => {
        return axios.put(url, file, {
            headers: {
                'Content-Type': file.type,
            }
        });
    }
};
