import { useState } from "react";
import { X, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Platform {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
}

const platforms: Platform[] = [
  { id: "douyin", name: "抖音", icon: "🎵", connected: true },
  { id: "bilibili", name: "哔哩哔哩", icon: "📺", connected: true },
  { id: "xiaohongshu", name: "小红书", icon: "📕", connected: false },
  { id: "kuaishou", name: "快手", icon: "⚡", connected: true },
  { id: "wechat", name: "微信视频号", icon: "💬", connected: false },
  { id: "youtube", name: "YouTube", icon: "▶️", connected: false },
];

interface PublishDialogProps {
  open: boolean;
  onClose: () => void;
}

export function PublishDialog({ open, onClose }: PublishDialogProps) {
  const [selected, setSelected] = useState<string[]>([]);

  if (!open) return null;

  const togglePlatform = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-[var(--shadow-card)] animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="text-lg font-display font-semibold text-foreground">发布视频</h2>
            <p className="text-xs text-muted-foreground mt-0.5">选择要发布的平台</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Platforms */}
        <div className="p-5 space-y-2">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => platform.connected && togglePlatform(platform.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl border transition-all",
                platform.connected
                  ? selected.includes(platform.id)
                    ? "border-primary/50 bg-primary/5"
                    : "border-border hover:border-primary/20 hover:bg-muted/50"
                  : "border-border/50 opacity-50 cursor-not-allowed"
              )}
            >
              <span className="text-xl">{platform.icon}</span>
              <span className="flex-1 text-sm font-medium text-foreground text-left">
                {platform.name}
              </span>
              {platform.connected ? (
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    selected.includes(platform.id)
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  )}
                >
                  {selected.includes(platform.id) && (
                    <Check className="w-3 h-3 text-primary-foreground" />
                  )}
                </div>
              ) : (
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  未连接 <ExternalLink className="w-3 h-3" />
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-border">
          <span className="text-xs text-muted-foreground">
            已选择 {selected.length} 个平台
          </span>
          <div className="flex gap-2">
            <Button variant="surface" size="sm" onClick={onClose}>
              取消
            </Button>
            <Button variant="glow" size="sm" disabled={selected.length === 0}>
              一键发布
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
