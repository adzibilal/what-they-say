"use client";

import React, { useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { createVoice } from '@/app/actions/voice';

interface RecorderProps {
    onStart?: (stream: MediaStream) => void;
}

const VoiceRecorder: React.FC<RecorderProps> = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const {
        status,
        startRecording,
        stopRecording,
        mediaBlobUrl,
    } = useReactMediaRecorder({
        audio: true,
        onStop: (blobUrl: string, blob: Blob) => {
            setAudioBlob(blob);
            setIsRecording(false);
        },
        onStart: async () => {
            try {
                setIsRecording(true);
            } catch (error) {
                console.error('Error starting recording:', error);
            }
        }
    });

    const handleStartRecording = () => {
        setIsRecording(true);
        startRecording();
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        stopRecording();
    };

    const handleUpload = async () => {
        if (!audioBlob) return;

        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append('audio', audioBlob);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error);

            const result = await createVoice(data.fileUrl, name, description);

            if (result.success) {
                setAudioBlob(null);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Failed to upload audio');
        } finally {
            setIsUploading(false);
        }
    };

    const parseStatus = (status: string) => {
        switch (status) {
            case 'idle':
                return 'Siap merekam';
            case 'recording':
                return 'Sedang merekam...';
            case 'stopped':
                return 'Rekaman selesai';
            case 'acquiring_media':
                return 'Menyiapkan mikrofon...';
            case 'error':
                return 'Terjadi kesalahan! Periksa mikrofon Anda';
            default:
                return 'Mempersiapkan...';
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex flex-col items-center gap-4">
                {isRecording && (
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <div className="absolute w-16 h-16 bg-red-500 rounded-full animate-ping opacity-75"></div>
                        <div className="absolute w-16 h-16 bg-red-500 rounded-full"></div>
                    </div>
                )}
                
                <button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={`px-6 py-3 rounded-full font-medium ${isRecording
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white'
                        }`}
                >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>

                <div className="text-sm text-gray-500">
                    Status: {parseStatus(status)}
                </div>

                {mediaBlobUrl && (
                    <div className="w-full max-w-md">
                        <audio src={mediaBlobUrl} controls className="w-full" />

                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Name" 
                            className="w-full p-2 border border-gray-300 rounded-lg mt-2" 
                        />
                        <input 
                            type="text" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            placeholder="Description" 
                            className="w-full p-2 border border-gray-300 rounded-lg mt-2" 
                        />

                        <button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="mt-2 w-full px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
                        >
                            {isUploading ? 'Uploading...' : 'Send Recording'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoiceRecorder;