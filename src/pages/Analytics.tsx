import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  Users,
  BarChart3,
  ChevronRight,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─── Mock Data ─────────────────────────────────────────────

interface ProjectAnalytics {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail?: string;
  platforms: PlatformData[];
}

interface PlatformData {
  name: string;
  icon: string;
  connected: boolean;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  followers: number;
}

const trendData7d = [
  { date: "03/22", 抖音: 1200, B站: 800, 小红书: 600, 快手: 400 },
  { date: "03/23", 抖音: 1800, B站: 1100, 小红书: 900, 快手: 500 },
  { date: "03/24", 抖音: 3200, B站: 1500, 小红书: 1200, 快手: 700 },
  { date: "03/25", 抖音: 5600, B站: 2800, 小红书: 2100, 快手: 1100 },
  { date: "03/26", 抖音: 4200, B站: 3200, 小红书: 1800, 快手: 900 },
  { date: "03/27", 抖音: 3800, B站: 2600, 小红书: 1500, 快手: 800 },
  { date: "03/28", 抖音: 4500, B站: 3000, 小红书: 2000, 快手: 1000 },
];

const mockProjects: ProjectAnalytics[] = [
  {
    id: "1",
    title: "产品宣传片 - 春季版",
    publishedAt: "2025-03-20",
    platforms: [
      { name: "抖音", icon: "🎵", connected: true, views: 24300, likes: 1820, comments: 342, shares: 218, saves: 560, followers: 45 },
      { name: "B站", icon: "📺", connected: true, views: 15100, likes: 980, comments: 215, shares: 87, saves: 320, followers: 28 },
      { name: "小红书", icon: "📕", connected: true, views: 10200, likes: 1560, comments: 178, shares: 92, saves: 890, followers: 62 },
      { name: "快手", icon: "⚡", connected: true, views: 5400, likes: 420, comments: 65, shares: 38, saves: 120, followers: 12 },
    ],
  },
  {
    id: "2",
    title: "Vlog #12 东京之旅",
    publishedAt: "2025-03-15",
    platforms: [
      { name: "抖音", icon: "🎵", connected: true, views: 89200, likes: 6700, comments: 1230, shares: 890, saves: 2100, followers: 320 },
      { name: "B站", icon: "📺", connected: true, views: 45600, likes: 3200, comments: 890, shares: 450, saves: 1800, followers: 180 },
      { name: "小红书", icon: "📕", connected: true, views: 32100, likes: 4500, comments: 560, shares: 320, saves: 3200, followers: 210 },
    ],
  },
  {
    id: "3",
    title: "教程：如何使用AI剪辑",
    publishedAt: "2025-03-10",
    platforms: [
      { name: "抖音", icon: "🎵", connected: true, views: 156000, likes: 12400, comments: 2300, shares: 3400, saves: 8900, followers: 890 },
      { name: "B站", icon: "📺", connected: true, views: 98000, likes: 8900, comments: 3200, shares: 2100, saves: 6700, followers: 560 },
      { name: "YouTube", icon: "▶️", connected: true, views: 42000, likes: 3100, comments: 450, shares: 890, saves: 2300, followers: 230 },
    ],
  },
  {
    id: "5",
    title: "短视频 - 美食探店",
    publishedAt: "2025-03-05",
    platforms: [
      { name: "抖音", icon: "🎵", connected: true, views: 210000, likes: 18900, comments: 4200, shares: 5600, saves: 12000, followers: 1200 },
      { name: "小红书", icon: "📕", connected: true, views: 78000, likes: 9800, comments: 1800, shares: 2100, saves: 8900, followers: 680 },
      { name: "快手", icon: "⚡", connected: true, views: 34000, likes: 2800, comments: 560, shares: 320, saves: 1200, followers: 150 },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────

function formatNumber(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + "万";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

function sumField(platforms: PlatformData[], field: keyof PlatformData): number {
  return platforms.reduce((s, p) => s + (typeof p[field] === "number" ? (p[field] as number) : 0), 0);
}

const platformColors: Record<string, string> = {
  抖音: "hsl(175 80% 50%)",
  B站: "hsl(200 80% 55%)",
  小红书: "hsl(0 70% 55%)",
  快手: "hsl(35 90% 55%)",
  YouTube: "hsl(0 70% 50%)",
  微信视频号: "hsl(120 40% 45%)",
};

// ─── Component ──────────────────────────────────────────

type TimeRange = "today" | "7d" | "30d";

const Analytics = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  const project = mockProjects.find((p) => p.id === selectedProject);

  // Global totals
  const globalTotals = {
    views: mockProjects.reduce((s, p) => s + sumField(p.platforms, "views"), 0),
    likes: mockProjects.reduce((s, p) => s + sumField(p.platforms, "likes"), 0),
    comments: mockProjects.reduce((s, p) => s + sumField(p.platforms, "comments"), 0),
    followers: mockProjects.reduce((s, p) => s + sumField(p.platforms, "followers"), 0),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0 sticky top-0 bg-background/80 backdrop-blur-sm z-20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => {
              if (selectedProject) setSelectedProject(null);
              else navigate("/");
            }}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h1 className="text-sm font-display font-semibold text-foreground">
              {selectedProject && project ? project.title : "流量监控"}
            </h1>
          </div>
        </div>

        {/* Time Range */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {([
            ["today", "今日"],
            ["7d", "7天"],
            ["30d", "30天"],
          ] as [TimeRange, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTimeRange(key)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                timeRange === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {selectedProject && project ? (
        <ProjectDetail project={project} timeRange={timeRange} />
      ) : (
        <ProjectList
          projects={mockProjects}
          globalTotals={globalTotals}
          onSelect={setSelectedProject}
        />
      )}
    </div>
  );
};

// ─── Project List View ──────────────────────────────────

function ProjectList({
  projects,
  globalTotals,
  onSelect,
}: {
  projects: ProjectAnalytics[];
  globalTotals: { views: number; likes: number; comments: number; followers: number };
  onSelect: (id: string) => void;
}) {
  const stats = [
    { label: "总播放", value: globalTotals.views, icon: Eye, change: +12.5 },
    { label: "总点赞", value: globalTotals.likes, icon: Heart, change: +8.2 },
    { label: "总评论", value: globalTotals.comments, icon: MessageCircle, change: +15.3 },
    { label: "新增粉丝", value: globalTotals.followers, icon: Users, change: +22.1 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      {/* Global Summary */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <div className={cn(
                "flex items-center gap-0.5 text-xs font-medium",
                stat.change >= 0 ? "text-emerald-400" : "text-destructive"
              )}>
                {stat.change >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">
              {formatNumber(stat.value)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Trend Chart */}
      <div className="bg-card border border-border rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-display font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            播放量趋势
          </h2>
        </div>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData7d}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220 18% 10%)",
                  border: "1px solid hsl(220 15% 18%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "hsl(210 20% 92%)" }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              <Line type="monotone" dataKey="抖音" stroke={platformColors["抖音"]} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="B站" stroke={platformColors["B站"]} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="小红书" stroke={platformColors["小红书"]} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="快手" stroke={platformColors["快手"]} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Cards */}
      <div className="mb-4">
        <h2 className="text-sm font-display font-semibold text-foreground flex items-center gap-2 mb-4">
          <Film className="w-4 h-4 text-primary" />
          作品数据
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {projects.map((project) => {
          const totalViews = sumField(project.platforms, "views");
          const totalLikes = sumField(project.platforms, "likes");
          const totalComments = sumField(project.platforms, "comments");
          const totalShares = sumField(project.platforms, "shares");

          return (
            <button
              key={project.id}
              onClick={() => onSelect(project.id)}
              className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-28 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                  <Film className="w-6 h-6 text-muted-foreground/40" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-foreground truncate">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      {project.platforms.map((p) => (
                        <span key={p.name} className="text-xs" title={p.name}>
                          {p.icon}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {project.publishedAt} 发布
                  </p>

                  {/* Stats row */}
                  <div className="flex items-center gap-5 mt-2">
                    <StatBadge icon={Eye} value={totalViews} />
                    <StatBadge icon={Heart} value={totalLikes} />
                    <StatBadge icon={MessageCircle} value={totalComments} />
                    <StatBadge icon={Share2} value={totalShares} />
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatBadge({ icon: Icon, value }: { icon: React.ElementType; value: number }) {
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <Icon className="w-3 h-3" />
      <span className="text-xs font-medium">{formatNumber(value)}</span>
    </div>
  );
}

// ─── Project Detail View ────────────────────────────────

function ProjectDetail({
  project,
  timeRange,
}: {
  project: ProjectAnalytics;
  timeRange: TimeRange;
}) {
  const totalViews = sumField(project.platforms, "views");
  const totalLikes = sumField(project.platforms, "likes");
  const totalComments = sumField(project.platforms, "comments");
  const totalShares = sumField(project.platforms, "shares");
  const totalSaves = sumField(project.platforms, "saves");
  const totalFollowers = sumField(project.platforms, "followers");

  // Bar chart data for platform comparison
  const comparisonData = project.platforms.map((p) => ({
    name: p.name,
    播放: p.views,
    点赞: p.likes,
    评论: p.comments,
    fill: platformColors[p.name] || "hsl(175 80% 50%)",
  }));

  const summaryStats = [
    { label: "总播放", value: totalViews, icon: Eye },
    { label: "总点赞", value: totalLikes, icon: Heart },
    { label: "总评论", value: totalComments, icon: MessageCircle },
    { label: "总转发", value: totalShares, icon: Share2 },
    { label: "总收藏", value: totalSaves, icon: Bookmark },
    { label: "新增粉丝", value: totalFollowers, icon: Users },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-3 text-center"
          >
            <stat.icon className="w-4 h-4 text-primary mx-auto mb-1.5" />
            <p className="text-lg font-display font-bold text-foreground">
              {formatNumber(stat.value)}
            </p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Platform Comparison Chart */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <h2 className="text-sm font-display font-semibold text-foreground flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-primary" />
          平台数据对比
        </h2>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} barGap={4} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }}
                axisLine={false}
                tickLine={false}
                width={50}
                tickFormatter={(v) => formatNumber(v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220 18% 10%)",
                  border: "1px solid hsl(220 15% 18%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "hsl(210 20% 92%)" }}
                formatter={(value: number) => formatNumber(value)}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="播放" fill="hsl(175 80% 50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="点赞" fill="hsl(200 80% 55%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="评论" fill="hsl(35 90% 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platform Detail Cards */}
      <h2 className="text-sm font-display font-semibold text-foreground flex items-center gap-2 mb-4">
        各平台详情
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {project.platforms.map((platform) => {
          const viewPercent = totalViews > 0 ? ((platform.views / totalViews) * 100).toFixed(1) : "0";

          return (
            <div
              key={platform.name}
              className="bg-card border border-border rounded-xl p-4 hover:border-primary/20 transition-colors"
            >
              {/* Platform header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{platform.icon}</span>
                  <span className="text-sm font-medium text-foreground">{platform.name}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  占比 {viewPercent}%
                </span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "播放", value: platform.views, icon: Eye },
                  { label: "点赞", value: platform.likes, icon: Heart },
                  { label: "评论", value: platform.comments, icon: MessageCircle },
                  { label: "转发", value: platform.shares, icon: Share2 },
                  { label: "收藏", value: platform.saves, icon: Bookmark },
                  { label: "涨粉", value: platform.followers, icon: Users },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-sm font-display font-bold text-foreground">
                      {formatNumber(s.value)}
                    </p>
                    <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-0.5 mt-0.5">
                      <s.icon className="w-2.5 h-2.5" />
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mini bar showing proportion */}
              <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${viewPercent}%`,
                    backgroundColor: platformColors[platform.name],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Analytics;
