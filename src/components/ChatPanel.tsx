import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Upload, Wand2, Scissors, Music, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickActions = [
  { icon: Scissors, label: "裁剪视频", prompt: "帮我裁剪视频的前10秒" },
  { icon: Music, label: "添加背景音乐", prompt: "给视频添加轻松愉快的背景音乐" },
  { icon: Type, label: "添加字幕", prompt: "自动生成字幕并添加到视频中" },
  { icon: Wand2, label: "智能剪辑", prompt: "自动识别视频中的精彩片段并剪辑" },
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "你好！我是 ClipFlow AI 剪辑助手 ✨\n\n我可以帮你完成各种视频剪辑任务。你可以上传视频，然后告诉我你想怎么处理它。\n\n试试下面的快捷操作，或者直接告诉我你的需求！",
    timestamp: new Date(),
  },
];

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const content = text || input;
    if (!content.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

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
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
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

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => handleSend(action.prompt)}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-muted transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <action.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 bg-muted border border-border rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/30 transition-all">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary shrink-0">
            <Upload className="w-4 h-4" />
          </Button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="告诉我你想怎么剪辑这个视频..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <Button
            variant="glow"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => handleSend()}
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
  if (input.includes("裁剪")) return "好的，我来帮你裁剪视频 ✂️\n\n请告诉我你想保留视频的哪个部分？你可以说：\n• 「保留 00:10 到 01:30」\n• 「去掉开头15秒」\n• 「只保留最后30秒」";
  if (input.includes("音乐")) return "没问题！🎵\n\n我为你准备了几种风格的背景音乐：\n1. 🎸 轻松活泼 - 适合Vlog和日常记录\n2. 🎹 舒缓优雅 - 适合产品展示\n3. 🥁 动感节奏 - 适合运动和快节奏视频\n\n你想选哪种风格？";
  if (input.includes("字幕")) return "正在分析视频中的语音内容... 🎙️\n\n预计需要约30秒完成字幕生成。你可以选择字幕样式：\n• 经典白色描边\n• 彩色动态字幕\n• 简约底部字幕\n\n生成完成后你还可以逐条编辑字幕内容。";
  if (input.includes("精彩") || input.includes("智能")) return "好的，我来分析视频中的精彩片段 🔍\n\n我会从以下维度进行分析：\n• 画面变化频率\n• 音频高潮点\n• 人物表情变化\n• 运动镜头识别\n\n分析完成后，我会为你生成一个精彩片段合集，你可以预览并调整。";
  return "收到！让我来处理你的请求 🚀\n\n你可以随时告诉我更具体的需求，比如：\n• 调整视频速度\n• 添加转场效果\n• 调色和滤镜\n• 画面裁剪\n\n我会尽力帮你完成！";
}
