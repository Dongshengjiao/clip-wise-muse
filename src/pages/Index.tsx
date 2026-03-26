import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectSidebar } from "@/components/ProjectSidebar";
import { ChatPanel } from "@/components/ChatPanel";
import { VideoPreview } from "@/components/VideoPreview";
import { PublishDialog } from "@/components/PublishDialog";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>("1");
  const [publishOpen, setPublishOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ProjectSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeProject={activeProject}
        onSelectProject={setActiveProject}
        onNewProject={() => setActiveProject(null)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-display font-semibold text-foreground">
              {activeProject ? "产品宣传片 - 春季版" : "新建项目"}
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              剪辑中
            </span>
          </div>
          <Button
            variant="glow"
            size="sm"
            className="gap-1.5"
            onClick={() => setPublishOpen(true)}
          >
            <Share2 className="w-3.5 h-3.5" />
            发布
          </Button>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex min-h-0">
          {/* Chat */}
          <div className="w-[420px] border-r border-border flex flex-col shrink-0">
            <ChatPanel />
          </div>

          {/* Video Preview */}
          <div className="flex-1 min-w-0">
            <VideoPreview />
          </div>
        </div>
      </div>

      <PublishDialog open={publishOpen} onClose={() => setPublishOpen(false)} />
    </div>
  );
};

export default Index;
