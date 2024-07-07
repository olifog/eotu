import React, { useEffect, useRef } from 'react';

const BackgroundAudio = ({ audioSrc }: { audioSrc: string}) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(error => {
        console.error("Audio playback failed:", error);
      });
    }
  }, []);

  return (
    <audio className='hidden absolute' ref={audioRef} src={audioSrc} loop />
  );
};

export default BackgroundAudio;