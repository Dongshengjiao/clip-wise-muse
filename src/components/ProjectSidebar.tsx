import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, Search, Clock, ChevronLeft, Film, FileVideo, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  updatedAt: string;
  status: "processing" | "editing" | "done" | "published";
  thumbnail?: string;
}

const mockProjects: Project[] = [
  { id: "1", title: "产品宣传片 - 春季版", updatedAt: "2 小时前", status: "editing" },
  { id: "2", title: "Vlog #12 东京之旅", updatedAt: "昨天", status: "done" },
  { id: "3", title: "教程：如何使用AI剪辑", updatedAt: "3天前", status: "published" },
  { id: "4", title: "公司年会回顾", updatedAt: "1周前", status: "done" },
  { id: "5", title: "短视频 - 美食探店", updatedAt: "2周前", status: "published" },
  { id: "6", title: "产品开箱测评", updatedAt: "2周前", status: "processing" },
];

interface ProjectSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeProject: string | null;
  onSelectProject: (id: string) => void;
}

const statusColors: Record<Project["status"], string> = {
  processing: "bg-amber-500/20 text-amber-400",
  editing: "bg-primary/20 text-primary",
  done: "bg-emerald-500/20 text-emerald-400",
  published: "bg-violet-500/20 text-violet-400",
};

const statusLabels: Record<Project["status"], string> = {
  processing: "处理中",
  editing: "剪辑中",
  done: "已完成",
  published: "已发布",
};

export function ProjectSidebar({
  collapsed,
  onToggle,
  activeProject,
  onSelectProject,
}: ProjectSidebarProps) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = mockProjects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Film className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-semibold text-foreground text-sm">ClipFlow</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-sidebar-foreground hover:text-foreground h-8 w-8"
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-2 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索历史项目..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-muted border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>
      )}

      {/* Project List */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {!collapsed && (
          <div className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            <Clock className="w-3 h-3" />
            <span>历史项目</span>
          </div>
        )}
        {filtered.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={cn(
              "w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-all group mb-0.5",
              activeProject === project.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
              {project.status === "processing" ? (
                <FileVideo className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              ) : (
                <Video className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-xs font-medium truncate">{project.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground">{project.updatedAt}</span>
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full", statusColors[project.status])}>
                    {statusLabels[project.status]}
                  </span>
                </div>
              </div>
            )}
          </button>
        ))}

        {filtered.length === 0 && !collapsed && (
          <div className="text-center py-8 text-muted-foreground">
            <Video className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">暂无匹配项目</p>
          </div>
        )}
      </div>

      {/* Footer hint */}
      {!collapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <p className="text-[10px] text-muted-foreground text-center">
            上传视频自动创建项目
          </p>
        </div>
      )}
    </aside>
  );
}
