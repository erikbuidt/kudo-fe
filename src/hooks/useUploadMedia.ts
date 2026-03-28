import { useMutation } from '@tanstack/react-query';
import { mediaApi } from '@/apis/media.api';
import { toast } from 'react-toastify';

export const useUploadMedia = () => {
    return useMutation({
        mutationFn: async (file: File) => {
            // 1. Validate video duration if it's a video
            if (file.type.startsWith('video/')) {
                const duration = await getVideoDuration(file);
                if (duration > 180) { // 3 minutes
                    throw new Error('Video duration must be under 3 minutes');
                }
            }

            // 2. Get presigned URL
            const { data: { data: presignedData } } = await mediaApi.getPresignedUrl(file.name);
            
            // 3. Upload file directly to MinIO/S3
            await mediaApi.uploadFile(presignedData.presigned_url, file);
            
            // 4. Return the final public URL and type
            return {
                media_url: presignedData.media_url,
                media_type: presignedData.media_type,
            };
        },
        onError: (error: any) => {
            const message = error.message || error.response?.data?.message || 'Failed to upload media';
            toast.error(message);
        }
    });
};

const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            resolve(video.duration);
        };
        video.onerror = () => {
            window.URL.revokeObjectURL(video.src);
            reject(new Error('Failed to load video metadata'));
        };
        video.src = URL.createObjectURL(file);
    });
};

