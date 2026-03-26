import { Play, Pause, SkipBack, SkipForward, Maximize2, Volume2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function VideoPreview() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Video Area */}
      <div className="flex-1 flex items-center justify-center bg-card/50 rounded-xl border border-border m-4 mb-2 relative overflow-hidden group">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[var(--gradient-glow)] opacity-50" />
        
        {/* Placeholder */}
        <div className="text-center z-10">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? (
              <Pause className="w-6 h-6 text-primary" />
            ) : (
              <Play className="w-6 h-6 text-primary ml-1" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">上传视频开始剪辑</p>
          <p className="text-xs text-muted-foreground/60 mt-1">支持 MP4, MOV, AVI 格式</p>
        </div>
      </div>

      {/* Timeline / Controls */}
      <div className="px-4 pb-4">
        {/* Progress bar */}
        <div className="w-full h-1 bg-muted rounded-full mb-3 relative group/progress cursor-pointer">
          <div className="absolute left-0 top-0 h-full w-1/3 bg-primary rounded-full" />
          <div className="absolute top-1/2 -translate-y-1/2 left-1/3 w-3 h-3 rounded-full bg-primary shadow-[var(--shadow-glow)] opacity-0 group-hover/progress:opacity-100 transition-opacity" />
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">00:42 / 02:15</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Volume2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
