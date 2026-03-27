import { useState } from "react";
import {
  X, Check, ExternalLink, ChevronDown, ChevronUp,
  Image, Sparkles, Clock, Send, Upload, RefreshCw,
  Globe, Hash, Eye, EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ── 平台数据 ── */
interface PlatformAccount {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  username?: string;
  avatar?: string;
  categoryLabel?: string;
  categories?: string[];
  extraFields?: { label: string; placeholder: string }[];
}

const platforms: PlatformAccount[] = [
  {
    id: "douyin", name: "抖音", icon: "🎵", connected: true,
    username: "@creator_dy", avatar: "",
    categoryLabel: "话题", extraFields: [{ label: "话题标签", placeholder: "#产品发布 #春季新品" }],
  },
  {
    id: "bilibili", name: "哔哩哔哩", icon: "📺", connected: true,
    username: "@up主小明", avatar: "",
    categoryLabel: "分区", categories: ["科技", "生活", "知识", "娱乐", "游戏"],
  },
  {
    id: "xiaohongshu", name: "小红书", icon: "📕", connected: false,
  },
  {
    id: "kuaishou", name: "快手", icon: "⚡", connected: true,
    username: "@kuai_creator", avatar: "",
  },
  {
    id: "wechat", name: "微信视频号", icon: "💬", connected: false,
  },
  {
    id: "youtube", name: "YouTube", icon: "▶️", connected: false,
  },
];

/* ── AI 生成的封面候选 ── */
const coverCandidates = [
  { id: 1, color: "from-primary/30 to-accent/20" },
  { id: 2, color: "from-accent/30 to-primary/20" },
  { id: 3, color: "from-primary/20 to-secondary/40" },
  { id: 4, color: "from-secondary/30 to-accent/30" },
];

/* ── Props ── */
interface PublishDialogProps {
  open: boolean;
  onClose: () => void;
}

export function PublishDialog({ open, onClose }: PublishDialogProps) {
  const [selected, setSelected] = useState<string[]>(
    platforms.filter((p) => p.connected).map((p) => p.id)
  );
  const [title, setTitle] = useState("产品宣传片 - 2024春季版");
  const [description, setDescription] = useState(
    "全新春季系列产品发布，融合自然元素与现代设计，带来耳目一新的视觉体验。"
  );
  const [tags, setTags] = useState(["产品发布", "春季新品", "品牌宣传", "创意视频"]);
  const [tagInput, setTagInput] = useState("");
  const [selectedCover, setSelectedCover] = useState(1);
  const [scheduleMode, setScheduleMode] = useState<"now" | "schedule">("now");
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  if (!open) return null;

  const togglePlatform = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const connectedCount = selected.filter((id) =>
    platforms.find((p) => p.id === id)?.connected
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch bg-background/90 backdrop-blur-md animate-fade-in">
      {/* ── 主面板 ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶栏 */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <Send className="w-4 h-4 text-primary" />
            <h1 className="text-base font-display font-semibold text-foreground">发布视频</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              AI 已优化
            </span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </header>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            {/* ─── 左列：视频信息 ─── */}
            <div className="space-y-6">
              {/* 标题 */}
              <section className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    视频标题
                  </label>
                  <button className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition">
                    <Sparkles className="w-3 h-3" /> AI 重新生成
                  </button>
                </div>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition"
                />
              </section>

              {/* 描述 */}
              <section className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    视频描述
                  </label>
                  <button className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition">
                    <Sparkles className="w-3 h-3" /> AI 重新生成
                  </button>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition resize-none"
                />
              </section>

              {/* 标签 */}
              <section className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  标签
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                    >
                      <Hash className="w-3 h-3" />
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-destructive transition">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                    placeholder="添加标签…"
                    className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none min-w-[80px]"
                  />
                </div>
              </section>

              {/* 封面 */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    视频封面
                  </label>
                  <button className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition">
                    <Sparkles className="w-3 h-3" /> AI 智能截取
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {coverCandidates.map((cover) => (
                    <button
                      key={cover.id}
                      onClick={() => setSelectedCover(cover.id)}
                      className={cn(
                        "aspect-video rounded-xl bg-gradient-to-br border-2 transition-all flex items-center justify-center",
                        cover.color,
                        selectedCover === cover.id
                          ? "border-primary shadow-[0_0_12px_hsl(175_80%_50%/0.2)]"
                          : "border-transparent hover:border-border"
                      )}
                    >
                      {selectedCover === cover.id && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition px-1">
                  <Upload className="w-3.5 h-3.5" /> 自定义上传封面
                </button>
              </section>

              {/* 发布设置 */}
              <section className="space-y-3">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  发布设置
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setScheduleMode("now")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all",
                      scheduleMode === "now"
                        ? "border-primary/50 bg-primary/5 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/20"
                    )}
                  >
                    <Send className="w-3.5 h-3.5" /> 立即发布
                  </button>
                  <button
                    onClick={() => setScheduleMode("schedule")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all",
                      scheduleMode === "schedule"
                        ? "border-primary/50 bg-primary/5 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/20"
                    )}
                  >
                    <Clock className="w-3.5 h-3.5" /> 定时发布
                  </button>
                </div>
                {scheduleMode === "schedule" && (
                  <input
                    type="datetime-local"
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition"
                  />
                )}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setVisibility(visibility === "public" ? "private" : "public")}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition"
                  >
                    {visibility === "public" ? (
                      <><Eye className="w-3.5 h-3.5" /> 公开</>
                    ) : (
                      <><EyeOff className="w-3.5 h-3.5" /> 仅自己可见</>
                    )}
                  </button>
                </div>
              </section>
            </div>

            {/* ─── 右列：平台账号 ─── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  发布平台
                </label>
                <span className="text-[10px] text-muted-foreground">
                  已选 {connectedCount} 个
                </span>
              </div>

              <div className="space-y-2">
                {platforms.map((platform) => (
                  <div key={platform.id} className="rounded-xl border border-border overflow-hidden">
                    {/* 平台行 */}
                    <button
                      onClick={() => {
                        if (platform.connected) togglePlatform(platform.id);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 transition-all",
                        platform.connected
                          ? selected.includes(platform.id)
                            ? "bg-primary/5"
                            : "hover:bg-muted/50"
                          : "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <span className="text-lg">{platform.icon}</span>
                      <div className="flex-1 text-left">
                        <span className="text-sm font-medium text-foreground block leading-tight">
                          {platform.name}
                        </span>
                        {platform.connected && platform.username && (
                          <span className="text-[10px] text-muted-foreground">{platform.username}</span>
                        )}
                      </div>
                      {platform.connected ? (
                        <div className="flex items-center gap-2">
                          {/* 平台特有设置展开按钮 */}
                          {selected.includes(platform.id) && (platform.categories || platform.extraFields) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedPlatform(
                                  expandedPlatform === platform.id ? null : platform.id
                                );
                              }}
                              className="p-1 rounded-md hover:bg-muted transition"
                            >
                              {expandedPlatform === platform.id ? (
                                <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                              )}
                            </button>
                          )}
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
                        </div>
                      ) : (
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition px-2 py-1 rounded-lg border border-primary/20 hover:border-primary/40"
                        >
                          <ExternalLink className="w-3 h-3" /> 授权绑定
                        </button>
                      )}
                    </button>

                    {/* 平台特有设置（展开） */}
                    {expandedPlatform === platform.id && selected.includes(platform.id) && (
                      <div className="px-3 pb-3 pt-1 border-t border-border/50 space-y-2">
                        {platform.categories && (
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground">{platform.categoryLabel}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {platform.categories.map((cat) => (
                                <button
                                  key={cat}
                                  className="px-2 py-0.5 rounded-md text-[10px] border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground transition"
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        {platform.extraFields?.map((field) => (
                          <div key={field.label} className="space-y-1">
                            <span className="text-[10px] text-muted-foreground">{field.label}</span>
                            <input
                              placeholder={field.placeholder}
                              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition"
                            />
                          </div>
                        ))}
                        <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition mt-1">
                          <RefreshCw className="w-3 h-3" /> 单独设置标题/封面
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 添加平台 */}
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition">
                <Globe className="w-3.5 h-3.5" /> 添加更多平台
              </button>
            </div>
          </div>
        </div>

        {/* 底栏 */}
        <footer className="h-16 border-t border-border flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              将发布到 <span className="text-foreground font-medium">{connectedCount}</span> 个平台
            </span>
          </div>
          <div className="flex gap-3">
            <Button variant="surface" size="sm" onClick={onClose}>
              取消
            </Button>
            <Button variant="glow" size="sm" disabled={connectedCount === 0} className="gap-1.5 px-5">
              <Send className="w-3.5 h-3.5" />
              {scheduleMode === "now" ? "一键发布" : "定时发布"}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
