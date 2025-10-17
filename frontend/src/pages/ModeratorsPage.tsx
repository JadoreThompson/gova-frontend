import DeploymentStatusBadge from "@/components/deployment-status-badge";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { ModeratorDeploymentResponse, ModeratorResponse } from "@/openapi";
import dayjs from "dayjs";
import { useState, type FC } from "react";

// --- Mock Types (based on Pydantic model) ---
// interface ModeratorResponse {
//   moderator_id: string;
//   name: string;
//   guideline_id: string;
//   created_at: string;
// }

// interface ModeratorDeploymentResponse {
//   deployment_id: string;
//   moderator_id: string;
//   platform: MessagePlatformType;
//   name: string;
//   conf: Record<string, any>;
//   state: ModeratorDeploymentState;
//   created_at: string;
// }

// --- Mock Data ---
const MOCK_MODERATORS: ModeratorResponse[] = [
  {
    moderator_id: "mod-001",
    name: "Community Moderator",
    guideline_id: "guideline-01",
    created_at: "2025-09-20T10:15:00Z",
  },
  {
    moderator_id: "mod-002",
    name: "Server Guard",
    guideline_id: "guideline-02",
    created_at: "2025-09-25T09:45:00Z",
  },
  {
    moderator_id: "mod-003",
    name: "Discord AutoMod",
    guideline_id: "guideline-03",
    created_at: "2025-10-02T08:30:00Z",
  },
];

const MOCK_DEPLOYMENTS: ModeratorDeploymentResponse[] = [
  {
    deployment_id: "dep-001",
    moderator_id: "mod-001",
    platform: "discord",
    name: "Discord Community Mod",
    state: "online",
    created_at: "2025-09-21T08:00:00Z",
  },
  {
    deployment_id: "dep-002",
    moderator_id: "mod-001",
    platform: "discord",
    name: "Backup Deployment",
    state: "pending",
    created_at: "2025-09-27T11:22:00Z",
  },
  {
    deployment_id: "dep-003",
    moderator_id: "mod-002",
    platform: "discord",
    name: "Guard Instance 1",
    state: "offline",
    created_at: "2025-09-30T12:10:00Z",
  },
  {
    deployment_id: "dep-004",
    moderator_id: "mod-003",
    platform: "discord",
    name: "AutoMod Deployment",
    state: "online",
    created_at: "2025-10-05T14:00:00Z",
  },
];

// --- Random badge colors (for platforms) ---
const BADGE_COLORS = [
  "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
  "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300",
  "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300",
  "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300",
  "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300",
  "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300",
];
const randomBadgeClass = () =>
  BADGE_COLORS[Math.floor(Math.random() * BADGE_COLORS.length)];

const ModeratorsPage: FC = () => {
  const [selectedModerator, setSelectedModerator] =
    useState<ModeratorResponse | null>(null);

  const getDeploymentsForModerator = (moderatorId: string) =>
    MOCK_DEPLOYMENTS.filter((d) => d.moderator_id === moderatorId);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-semibold">Moderators</h4>
      </div>

      <div className="rounded-md border bg-transparent shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-neutral-800">
            <TableRow>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                Name
              </TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                Created At
              </TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                Deployments
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_MODERATORS.map((mod) => {
              const deployments = getDeploymentsForModerator(mod.moderator_id);
              return (
                <TableRow
                  key={mod.moderator_id}
                  onClick={() => setSelectedModerator(mod)}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40"
                >
                  <TableCell className="font-medium">{mod.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {dayjs(mod.created_at).format("yyyy-MM-dd HH:mm")}
                  </TableCell>
                  <TableCell className="flex flex-wrap gap-1 py-3">
                    {deployments.slice(0, 3).map((dep) => (
                      <span
                        key={dep.deployment_id}
                        className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium capitalize ${randomBadgeClass()}`}
                      >
                        {dep.platform}
                      </span>
                    ))}
                    {deployments.length > 3 && (
                      <span className="text-muted-foreground text-xs">
                        +{deployments.length - 3} more
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Slide-over for moderator details */}
      <Sheet
        open={!!selectedModerator}
        onOpenChange={() => setSelectedModerator(null)}
      >
        <SheetContent side="right" className="w-[400px] sm:w-[480px]">
          {selectedModerator && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedModerator.name}</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                    Deployments
                  </h4>
                  <div className="mt-2 flex flex-col gap-3">
                    {getDeploymentsForModerator(
                      selectedModerator.moderator_id,
                    ).map((dep) => (
                      <div
                        key={dep.deployment_id}
                        className="rounded-md border p-3 text-sm shadow-sm"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-foreground font-medium">
                            {dep.name}
                          </span>
                          <DeploymentStatusBadge status={dep.state} />
                        </div>
                        <div className="text-muted-foreground flex justify-between text-xs">
                          <span className="capitalize">{dep.platform}</span>
                          <span>
                            {dayjs(dep.created_at).format("yyyy-MM-dd")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default ModeratorsPage;
