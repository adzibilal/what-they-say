"use client";

import dynamic from 'next/dynamic';

const VoiceRecorder = dynamic(() => import('./VoiceRecorder'), {
  loading: () => <div>Loading...</div>
});

export default VoiceRecorder; 