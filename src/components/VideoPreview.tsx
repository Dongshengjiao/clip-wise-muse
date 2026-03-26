import { Play, Pause, SkipBack, SkipForward, Maximize2, Volume2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EditingPhase = "idle" | "analyzing" | "processing" | "rendering" | "done";

const phaseLabels: Record<EditingPhase, string> = {
  idle: "等待上传",
  analyzing: "分析视频内容...",
  processing: "应用剪辑效果...",
  rendering: "渲染成片...",
  done: "剪辑完成",
};

const phaseProgress: Record<EditingPhase, number> = {
  idle: 0,
  analyzing: 25,
  processing: 55,
  rendering: 85,
  done: 100,
};

interface Track {
  id: string;
  label: string;
  emoji: string;
  color: string;
  segments: { start: number; end: number }[];
}

const mockTracks: Track[] = [
  { id: "video", label: "视频", emoji: "🎬", color: "bg-primary/60", segments: [{ start: 0, end: 100 }] },
  { id: "audio", label: "音频", emoji: "🔊", color: "bg-emerald-500/60", segments: [{ start: 0, end: 100 }] },
  { id: "bgm", label: "配乐", emoji: "🎵", color: "bg-violet-500/60", segments: [{ start: 10, end: 90 }] },
  { id: "subtitle", label: "字幕", emoji: "💬", color: "bg-amber-500/60", segments: [{ start: 5, end: 30 }, { start: 35, end: 65 }, { start: 70, end: 95 }] },
  { id: "effects", label: "特效", emoji: "✨", color: "bg-rose-500/60", segments: [{ start: 0, end: 15 }, { start: 45, end: 60 }] },
];

export function VideoPreview() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<EditingPhase>("idle");
  const [playhead, setPlayhead] = useState(33);

  // Simulate processing for demo
  const simulateProcessing = () => {
    setPhase("analyzing");
    setTimeout(() => setPhase("processing"), 2000);
    setTimeout(() => setPhase("rendering"), 4000);
    setTimeout(() => setPhase("done"), 6000);
  };

  const showTimeline = phase === "done";

  return (
    <div className="flex flex-col h-full">
      {/* Video Area */}
      <div className="flex-1 flex items-center justify-center bg-card/50 rounded-xl border border-border m-4 mb-2 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[var(--gradient-glow)] opacity-50" />

        {phase === "idle" && (
          <div className="text-center z-10">
            <div
              className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3 cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={simulateProcessing}
            >
              <Play className="w-6 h-6 text-primary ml-1" />
            </div>
            <p className="text-sm text-muted-foreground">在对话中上传视频开始剪辑</p>
            <p className="text-xs text-muted-foreground/60 mt-1">视频处理进度将在这里显示</p>
          </div>
        )}

        {(phase === "analyzing" || phase === "processing" || phase === "rendering") && (
          <div className="text-center z-10 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
            </div>
            <p className="text-sm font-medium text-foreground mb-2">{phaseLabels[phase]}</p>

            {/* Progress bar */}
            <div className="w-48 mx-auto">
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${phaseProgress[phase]}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">{phaseProgress[phase]}%</p>
            </div>

            {/* Phase steps */}
            <div className="flex items-center gap-6 mt-4">
              {(["analyzing", "processing", "rendering"] as EditingPhase[]).map((p, i) => {
                const isCurrent = phase === p;
                const isDone = phaseProgress[phase] > phaseProgress[p];
                return (
                  <div key={p} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors",
                        isDone
                          ? "bg-primary text-primary-foreground"
                          : isCurrent
                            ? "bg-primary/20 text-primary border border-primary/40"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {i + 1}
                    </div>
                    <span className={cn("text-[10px]", isCurrent ? "text-primary" : "text-muted-foreground")}>
                      {phaseLabels[p].replace("...", "")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/80">
            <div
              className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-primary" />
              ) : (
                <Play className="w-6 h-6 text-primary ml-1" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Playback Controls */}
      <div className="px-4">
        <div className="w-full h-1 bg-muted rounded-full mb-3 relative group/progress cursor-pointer">
          <div className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all" style={{ width: `${playhead}%` }} />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-[var(--shadow-glow)] opacity-0 group-hover/progress:opacity-100 transition-opacity"
            style={{ left: `${playhead}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
              <SkipBack className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
              <SkipForward className="w-3.5 h-3.5" />
            </Button>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">00:42 / 02:15</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
              <Volume2 className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
              <Maximize2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline Tracks */}
      <div className="px-4 pb-4 mt-2">
        <div className="bg-card/50 border border-border rounded-lg overflow-hidden">
          {/* Time ruler */}
          <div className="flex items-center h-5 border-b border-border px-2">
            {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135].map((sec) => (
              <span key={sec} className="text-[8px] text-muted-foreground/60 font-mono" style={{ position: "absolute", left: `${(sec / 135) * 100}%` }}>
              </span>
            ))}
            <div className="flex-1 flex justify-between">
              {["0:00", "0:30", "1:00", "1:30", "2:00"].map((t) => (
                <span key={t} className="text-[8px] text-muted-foreground/60 font-mono">{t}</span>
              ))}
            </div>
          </div>

          {/* Tracks */}
          {mockTracks.map((track) => (
            <div key={track.id} className="flex items-center h-7 border-b border-border/50 last:border-b-0 group/track hover:bg-muted/20">
              <div className="w-16 shrink-0 px-2 flex items-center gap-1">
                <span className="text-[10px]">{track.emoji}</span>
                <span className="text-[9px] text-muted-foreground">{track.label}</span>
              </div>
              <div className="flex-1 relative h-full px-0.5 py-1">
                {track.segments.map((seg, i) => (
                  <div
                    key={i}
                    className={cn("absolute top-1 bottom-1 rounded-sm cursor-pointer hover:brightness-125 transition-all", track.color)}
                    style={{
                      left: `${seg.start}%`,
                      width: `${seg.end - seg.start}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-px bg-primary z-10 pointer-events-none"
            style={{ left: `calc(64px + ${playhead}% * (100% - 64px) / 100)` }}
          />
        </div>
      </div>
    </div>
  );
}
