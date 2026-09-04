import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Headphones } from 'lucide-react';

export default function AudioPlayer({ audioUrl, title = "聴解音声" }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [useIframe, setUseIframe] = useState(false);

  let googleDriveId = null;
  let playableSrc = audioUrl;

  if (audioUrl && audioUrl.includes('drive.google.com')) {
    const parts = audioUrl.split('/d/');
    if (parts.length > 1) {
      googleDriveId = parts[1].split('/')[0].split('?')[0];
      playableSrc = 'https://docs.google.com/uc?export=download&id=' + googleDriveId;
    }
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      if (googleDriveId) setUseIframe(true);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [playableSrc]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => {
        if (googleDriveId) setUseIframe(true);
      });
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  };

  if (!audioUrl) return null;

  return (
    <div className="bg-gradient-to-r from-rose-50 to-indigo-50 border border-rose-200 rounded-2xl p-4 my-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-rose-900 font-bold text-sm font-japanese">
          <Headphones className="w-5 h-5 text-rose-600 animate-pulse" />
          <span>{title}</span>
          <span className="bg-rose-100 text-rose-800 text-[11px] px-2 py-0.5 rounded-full font-semibold">
            聴解トラック
          </span>
        </div>

        {googleDriveId && (
          <button
            type="button"
            onClick={() => setUseIframe(!useIframe)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline"
          >
            {useIframe ? '標準プレイヤー' : 'Google Player'}
          </button>
        )}
      </div>

      {useIframe && googleDriveId ? (
        <div className="rounded-xl overflow-hidden border border-rose-200 shadow-inner bg-black">
          <iframe
            src={'https://drive.google.com/file/d/' + googleDriveId + '/preview'}
            className="w-full h-14 border-0"
            title="Google Drive Audio"
            allow="autoplay"
          />
        </div>
      ) : (
        <div>
          <audio ref={audioRef} src={playableSrc} preload="metadata" />

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md transition-all active:scale-95 shrink-0"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={handleReplay}
              className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center transition-all shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="flex-1 relative flex items-center">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
            </div>

            <span className="text-xs text-slate-500 font-mono shrink-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <button
              type="button"
              onClick={toggleMute}
              className="text-slate-600 hover:text-slate-900 transition-colors p-1 shrink-0"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}