import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Upload, X, ChevronDown, ChevronUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachment?: { name: string; type: string };
}

interface Skill {
  id: string;
  label: string;
  emoji: string;
  description: string;
  category: "basic" | "creative" | "enhance" | "output";
}

const skills: Skill[] = [
  { id: "trim", label: "智能裁剪", emoji: "✂️", description: "AI识别精彩片段自动裁剪", category: "basic" },
  { id: "subtitle", label: "自动字幕", emoji: "💬", description: "语音识别生成多语言字幕", category: "basic" },
  { id: "bgm", label: "背景音乐", emoji: "🎵", description: "智能匹配风格配乐", category: "creative" },
  { id: "transition", label: "转场特效", emoji: "✨", description: "自动添加流畅转场", category: "creative" },
  { id: "color", label: "调色滤镜", emoji: "🎨", description: "电影级色彩调整", category: "enhance" },
  { id: "denoise", label: "降噪增强", emoji: "🔇", description: "音频降噪画面增强", category: "enhance" },
  { id: "speed", label: "变速处理", emoji: "⚡", description: "慢动作/延时摄影", category: "basic" },
  { id: "face", label: "人脸追踪", emoji: "👤", description: "自动跟踪裁切人物", category: "creative" },
  { id: "ratio", label: "画幅适配", emoji: "📐", description: "一键适配多平台尺寸", category: "output" },
  { id: "cover", label: "封面生成", emoji: "🖼️", description: "AI生成吸引力封面", category: "output" },
  { id: "highlight", label: "高光时刻", emoji: "🔥", description: "自动提取精彩瞬间", category: "basic" },
  { id: "sticker", label: "贴纸表情", emoji: "😄", description: "智能添加动态贴纸", category: "creative" },
];

const categoryLabels: Record<string, string> = {
  basic: "基础剪辑",
  creative: "创意效果",
  enhance: "画质增强",
  output: "输出优化",
};

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "你好！我是 ClipFlow AI 剪辑助手 ✨\n\n上传一段视频，告诉我你想要的效果，我会自动帮你完成剪辑。\n\n你也可以打开下方的「技能栈」选择多个剪辑技能并行使用！",
    timestamp: new Date(),
  },
];

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleSkill = (id: string) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: selectedSkills.length
        ? `上传了视频，请使用以下技能处理：${selectedSkills.map((s) => skills.find((sk) => sk.id === s)?.label).join("、")}`
        : "上传了一段视频，请帮我剪辑",
      timestamp: new Date(),
      attachment: { name: file.name, type: file.type },
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const skillList = selectedSkills.length
        ? `\n\n已启用技能：${selectedSkills.map((s) => skills.find((sk) => sk.id === s)?.emoji + " " + skills.find((sk) => sk.id === s)?.label).join("、")}`
        : "";
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `收到视频「${file.name}」✅\n\n正在分析视频内容，预计需要 1-2 分钟...${skillList}\n\n处理完成后会在右侧预览区展示结果，你可以随时告诉我需要调整的地方。`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      setSelectedSkills([]);
    }, 1500);

    e.target.value = "";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const skillInfo = selectedSkills.length
      ? `\n[已选技能：${selectedSkills.map((s) => skills.find((sk) => sk.id === s)?.label).join("、")}]`
      : "";

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input + skillInfo,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex animate-fade-in",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border text-card-foreground rounded-bl-md"
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-medium text-primary">ClipFlow AI</span>
                </div>
              )}
              {msg.attachment && (
                <div className="flex items-center gap-2 mb-2 px-2.5 py-1.5 rounded-lg bg-background/20 border border-border/30 text-xs">
                  <span>🎬</span>
                  <span className="truncate">{msg.attachment.name}</span>
                </div>
              )}
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-medium text-primary">ClipFlow AI</span>
              </div>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Skills Panel */}
      <div className="border-t border-border">
        <button
          onClick={() => setSkillsOpen(!skillsOpen)}
          className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="flex items-center gap-2">
            <span>🛠️ 技能栈</span>
            {selectedSkills.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px]">
                已选 {selectedSkills.length}
              </span>
            )}
          </div>
          {skillsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {skillsOpen && (
          <div className="px-4 pb-3 max-h-[240px] overflow-y-auto animate-fade-in space-y-3">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
                  {categoryLabels[category]}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {categorySkills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill.id);
                    return (
                      <button
                        key={skill.id}
                        onClick={() => toggleSkill(skill.id)}
                        title={skill.description}
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all border",
                          isSelected
                            ? "bg-primary/15 border-primary/40 text-primary"
                            : "bg-muted/50 border-border hover:border-primary/30 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span>{skill.emoji}</span>
                        <span>{skill.label}</span>
                        {isSelected && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {selectedSkills.length > 0 && (
              <button
                onClick={() => setSelectedSkills([])}
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                清除全部
              </button>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="video/*"
          className="hidden"
        />
        <div className="flex items-center gap-2 bg-muted border border-border rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/30 transition-all">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0"
            onClick={() => fileInputRef.current?.click()}
            title="上传视频"
          >
            <Upload className="w-4 h-4" />
          </Button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="描述你的剪辑需求，或上传视频开始..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <Button
            variant="glow"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function getAIResponse(input: string): string {
  if (input.includes("裁剪") || input.includes("剪切")) return "好的，我来帮你裁剪视频 ✂️\n\n请告诉我你想保留视频的哪个部分？你可以说：\n• 「保留 00:10 到 01:30」\n• 「去掉开头15秒」\n• 「只保留最后30秒」";
  if (input.includes("音乐") || input.includes("配乐")) return "没问题！🎵 正在为你的视频匹配合适的背景音乐...\n\n我会根据视频内容和节奏自动推荐配乐，处理完成后你可以在右侧预览。";
  if (input.includes("字幕")) return "正在分析视频中的语音内容 🎙️\n\n预计需要约30秒完成字幕生成。生成完成后你可以在时间轨道上编辑每条字幕。";
  if (input.includes("发布")) return "视频准备就绪！🚀\n\n点击右上角的「发布」按钮，可以一键发布到多个平台。";
  return "收到！让我来处理 🚀\n\n正在分析你的需求，处理进度会在右侧预览区实时显示。你可以随时补充更多要求！";
}
