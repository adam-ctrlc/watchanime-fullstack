'use client';

import { useState, useRef, useEffect } from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';
import { PauseIcon } from '@heroicons/react/24/solid';
import { SpeakerWaveIcon } from '@heroicons/react/24/solid';
import { SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import { FilmIcon } from '@heroicons/react/24/solid';
import { Loader2 } from 'lucide-react';

export default function EpisodePlayer({ episode, anime }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const placeholderThumbnail =
    episode.attributes.thumbnail?.original ||
    anime.attributes.posterImage?.large ||
    anime.attributes.posterImage?.original;

  const episodeTitle =
    episode.attributes.canonicalTitle || `Episode ${episode.attributes.number}`;

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const handleTimeUpdate = () => {
        setCurrentTime(videoElement.currentTime);
      };

      const handleDurationChange = () => {
        setDuration(videoElement.duration);
      };

      const handleLoadedData = () => {
        setLoading(false);
      };

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
        videoElement.removeEventListener(
          'durationchange',
          handleDurationChange
        );
        videoElement.removeEventListener('loadeddata', handleLoadedData);
        videoElement.removeEventListener('error', handleError);
      };
    }
  }, []);

  const togglePlay = () => {
    if (videoError) return;

    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play().catch((err) => {
          console.error('Error playing video:', err);
          setVideoError(true);
        });
      }
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

  const handleSeek = (e) => {
    if (videoError) return;

    const video = videoRef.current;
    if (video && !isNaN(video.duration) && isFinite(video.duration) && video.duration > 0) {
      const seekTime =
        (e.nativeEvent.offsetX / e.target.clientWidth) * video.duration;
      if (isFinite(seekTime) && seekTime >= 0 && seekTime <= video.duration) {
        video.currentTime = seekTime;
        setCurrentTime(seekTime);
      }
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className='bg-gray-800 rounded-lg overflow-hidden'>
      <div className='relative aspect-video bg-black'>
        {/* Video element - hidden when there's an error */}
        {!videoError && (
          <video
            ref={videoRef}
            className='w-full h-full object-contain'
            poster={placeholderThumbnail}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setVideoError(true)}
          >
            {/* Note: In a real app, you would provide actual video sources */}
            Your browser does not support the video tag.
          </video>
        )}

        {/* Video Error State */}
        {videoError && (
          <div className='absolute inset-0 flex flex-col items-center justify-center bg-gray-900'>
            {placeholderThumbnail && (
              <div
                className='absolute inset-0 bg-center bg-cover opacity-20'
                style={{ backgroundImage: `url(${placeholderThumbnail})` }}
              ></div>
            )}
            <FilmIcon className='h-20 w-20 text-gray-400 mb-4' />
            <h3 className='text-xl font-bold text-white mb-2'>
              Video Not Available
            </h3>
            <p className='text-gray-400 text-center max-w-md px-4'>
              This is a demo application. Real video content is not available
              for this episode.
            </p>
          </div>
        )}

        {/* Loading overlay */}
        {loading && !videoError && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
            <Loader2 className='h-12 w-12 text-white animate-spin' />
          </div>
        )}

        {/* Video controls overlay - hidden in error state */}
        {!videoError && (
          <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={togglePlay}
                className='text-white'
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <PauseIcon className='h-6 w-6' />
                ) : (
                  <PlayIcon className='h-6 w-6' />
                )}
              </button>

              <button
                onClick={toggleMute}
                className='text-white'
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <SpeakerXMarkIcon className='h-6 w-6' />
                ) : (
                  <SpeakerWaveIcon className='h-6 w-6' />
                )}
              </button>

              <div className='text-white text-sm'>
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              <div className='flex-grow'>
                <div
                  className='h-2 bg-gray-700 rounded-full cursor-pointer'
                  onClick={handleSeek}
                >
                  <div
                    className='h-full bg-purple-500 rounded-full'
                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
