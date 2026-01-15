'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Film, Loader2, Maximize, RotateCcw, RotateCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

export default function EpisodePlayer({ episode, anime }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const placeholderThumbnail =
    episode.attributes.thumbnail?.original ||
    anime.attributes.posterImage?.large ||
    anime.attributes.posterImage?.original;

  const episodeTitle =
    episode.attributes.canonicalTitle || `Episode ${episode.attributes.number}`;

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const handleTimeUpdate = () => setCurrentTime(videoElement.currentTime);
      const handleDurationChange = () => setDuration(videoElement.duration);
      const handleLoadedData = () => setLoading(false);
      const handleError = () => {
        setVideoError(true);
        setLoading(false);
      };

      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('durationchange', handleDurationChange);
      videoElement.addEventListener('loadeddata', handleLoadedData);
      videoElement.addEventListener('error', handleError);

      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('durationchange', handleDurationChange);
        videoElement.removeEventListener('loadeddata', handleLoadedData);
        videoElement.removeEventListener('error', handleError);
      };
    }
  }, []);

  const togglePlay = () => {
    if (videoError) return;
    const video = videoRef.current;
    if (video) {
      if (isPlaying) video.pause();
      else video.play().catch(() => setVideoError(true));
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoError) return;
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSliderChange = (value) => {
    const video = videoRef.current;
    if (video && duration) {
      const newTime = value[0];
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  return (
    <div 
      className='group relative bg-black rounded-2xl overflow-hidden aspect-video shadow-2xl ring-1 ring-white/10'
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      {!videoError && (
        <video
          ref={videoRef}
          className='w-full h-full object-contain cursor-pointer'
          poster={placeholderThumbnail}
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          Your browser does not support the video tag.
        </video>
      )}

      {/* Error State */}
      {videoError && (
        <div className='absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] p-8 text-center'>
          {placeholderThumbnail && (
            <div
              className='absolute inset-0 bg-center bg-cover opacity-10 blur-sm'
              style={{ backgroundImage: `url(${placeholderThumbnail})` }}
            />
          )}
          <div className="relative z-10 flex flex-col gap-4">
            <Film className='h-16 w-16 text-gray-700 mx-auto' />
            <h3 className='text-2xl font-black text-white tracking-tight'>Video Not Available</h3>
            <p className='text-gray-500 max-w-sm mx-auto text-sm leading-relaxed'>
              This is a demonstration. Content for <span className="text-purple-400 font-bold">{episodeTitle}</span> is currently unavailable in this preview.
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !videoError && (
        <div className='absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
          <Loader2 className='h-12 w-12 text-purple-500 animate-spin' />
        </div>
      )}

      {/* Top Bar Info */}
      <div className={`absolute top-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-3 md:gap-4">
          <Badge className="bg-purple-600 text-white border-none font-black px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs">
            EP {episode.attributes.number}
          </Badge>
          <h4 className="text-white text-sm md:text-base font-bold truncate drop-shadow-md">{episodeTitle}</h4>
        </div>
      </div>

      {/* Controls */}
      {!videoError && (
        <div className={`absolute bottom-0 left-0 right-0 p-3 md:p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col gap-2 md:gap-4">
            {/* Seek Bar */}
            <div className="px-1 md:px-2">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSliderChange}
                className="cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 md:gap-2">
                <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/10 rounded-xl h-9 w-9 md:h-10 md:w-10">
                  {isPlaying ? <Pause className="h-5 w-5 md:h-6 md:w-6 fill-white" /> : <Play className="h-5 w-5 md:h-6 md:w-6 fill-white" />}
                </Button>
                
                <Button variant="ghost" size="icon" onClick={() => {if(videoRef.current) videoRef.current.currentTime -= 10}} className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl h-8 w-8 md:h-10 md:w-10">
                  <RotateCcw className="h-4 w-4 md:h-5 md:w-5" />
                </Button>

                <Button variant="ghost" size="icon" onClick={() => {if(videoRef.current) videoRef.current.currentTime += 10}} className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl h-8 w-8 md:h-10 md:w-10">
                  <RotateCw className="h-4 w-4 md:h-5 md:w-5" />
                </Button>

                <div className="hidden sm:flex items-center gap-2 ml-2">
                  <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/10 rounded-xl h-10 w-10">
                    {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                  </Button>
                </div>

                <div className="text-white/90 text-[10px] md:text-sm font-black tracking-tighter ml-1 md:ml-2">
                  <span className="text-purple-400">{formatTime(currentTime)}</span>
                  <span className="mx-1 opacity-40">/</span>
                  <span className="opacity-60">{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 md:gap-2">
                <Button variant="ghost" size="icon" onClick={() => videoRef.current?.requestFullscreen()} className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl h-8 w-8 md:h-10 md:w-10">
                  <Maximize className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
