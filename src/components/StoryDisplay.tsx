
import React, { useState } from 'react';
import { Play, Pause, Volume2, Download, Share2, RefreshCw, ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import ShareModal from '@/components/ShareModal';

interface StoryDisplayProps {
  image: string;
  story: string;
  onStartOver: () => void;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ image, story, onStartOver }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(45); // Mock duration in seconds
  const [volume, setVolume] = useState([80]);
  const [showShareModal, setShowShareModal] = useState(false);
  const { toast } = useToast();

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate audio playback
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your story and audio are being prepared for download.",
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const wordCount = story.split(' ').length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={onStartOver}
        className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Create Another Story
      </Button>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Story is Ready!</h2>
          <p className="text-gray-600">AI has transformed your photo into a beautiful narrative</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Panel */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <img
                src={image}
                alt="Story inspiration"
                className="w-full h-96 object-cover"
              />
            </CardContent>
          </Card>

          {/* Story Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <span>Your Story</span>
                <div className="ml-auto flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} min read</span>
                  </div>
                  <span>{wordCount} words</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-6">
                {story}
              </div>
              
              <Button
                variant="outline"
                className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Alternative Version
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Audio Player */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="h-5 w-5 text-purple-600" />
              <span>Audio Narration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  className="w-full"
                  onValueChange={(value) => setCurrentTime(value[0])}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={togglePlayback}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full w-12 h-12 p-0"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-gray-500" />
                    <Slider
                      value={volume}
                      max={100}
                      step={1}
                      className="w-24"
                      onValueChange={setVolume}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={() => setShowShareModal(true)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 text-center space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Button
              onClick={onStartOver}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Create Another Story
            </Button>
            <Button
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              Save to Gallery
            </Button>
          </div>
        </div>
      </div>

      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        story={story}
        image={image}
      />
    </div>
  );
};

export default StoryDisplay;
