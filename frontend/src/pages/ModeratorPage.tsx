import DeploymentsTable from "@/components/deployments-table";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeployModeratorMutation,
  useModeratorDeploymentsQuery,
  useModeratorQuery,
  useModeratorStatsQuery,
} from "@/hooks/moderators-hooks";
import { MessagePlatformType } from "@/openapi";
import { Bot } from "lucide-react";
import React, { useState, type FC } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const StatsCards: FC<{ totalMessages: number; totalActions: number }> = ({
  totalMessages,
  totalActions,
}) => (
  <div className="mb-6 flex h-30 gap-3">
    <Card className="h-full w-70 gap-2">
      <CardHeader className="mb-0">
        <CardTitle className="text-muted-foreground">
          Total Messages Processed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{totalMessages.toLocaleString()}</p>
      </CardContent>
    </Card>
    <Card className="h-full w-70 gap-2">
      <CardHeader className="mb-0">
        <CardTitle className="text-muted-foreground">
          Total Actions Taken
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{totalActions.toLocaleString()}</p>
      </CardContent>
    </Card>
  </div>
);

const MessagesChart: FC<{
  chartData: { week: string; messages: number }[];
}> = ({ chartData }) => (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle>Messages Processed (Last 6 Weeks)</CardTitle>
    </CardHeader>
    <CardContent className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="messages"
            fill="hsl(var(--primary))"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const DeploySheet: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}> = ({ open, onOpenChange, onSubmit }) => {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<MessagePlatformType | "">("");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] px-5 pt-10 sm:w-[480px]">
        <SheetClose className="absolute top-0 right-0 focus:!outline-none">
          x
        </SheetClose>

        <form onSubmit={onSubmit}>
          <h4 className="mb-4 font-semibold underline">Deploy Moderator</h4>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Deployment Name</label>
              <Input
                placeholder="Enter deployment name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Platform</label>
              <Select
                name="platform"
                value={platform}
                onValueChange={(val) => setPlatform(val as MessagePlatformType)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MessagePlatformType).map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="">
              <label className="text-sm font-medium">Configuration</label>
              <div className="">
                <Input type="checkbox" name="mute" />
                Mute
              </div>
              <div className="">
                <Input type="checkbox" name="ban" />
                Ban
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="w-full border-1">
                Deploy
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

const DeploymentsSection: FC<{
  deployments: any[];
  page: number;
  setPage: (p: number) => void;
  navigate: ReturnType<typeof useNavigate>;
}> = ({ deployments, page, setPage, navigate }) => (
  <DeploymentsTable
    deployments={deployments}
    page={page}
    hasNextPage={false}
    onPrevPage={() => setPage((p) => p - 1)}
    onNextPage={() => setPage((p) => p + 1)}
    onRowClick={(d) => navigate(`/deployments/${d.deployment_id}`)}
  />
);

const ModeratorPage: FC = () => {
  const { moderatorId } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [deploySheetOpen, setDeploySheetOpen] = useState(false);

  const moderatorQuery = useModeratorQuery(moderatorId);
  const moderatorStatsQuery = useModeratorStatsQuery(moderatorId);
  const moderatorDeploymentsQuery = useModeratorDeploymentsQuery(moderatorId, {
    page,
  });
  const deployMutation = useDeployModeratorMutation();

  const chartData = [
    { week: "6w ago", messages: 800 },
    { week: "5w ago", messages: 950 },
    { week: "4w ago", messages: 1100 },
    { week: "3w ago", messages: 1020 },
    { week: "2w ago", messages: 1200 },
    { week: "Last Week", messages: 1300 },
  ];

  const handleDeploy = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries());
    const actions = [];

    if (fd["mute"]) {
      actions.push({ type: "mute" });
    }

    if (fd["ban"]) {
      actions.push({ type: "ban" });
    }

    deployMutation
      .mutateAsync({
        moderatorId: moderatorId!,
        data: {
          name: fd["name"] as string,
          platform: fd["platform"] as MessagePlatformType,
          conf: {
            guild_id: 101010101010,
            allowed_channels: ["*"],
            allowed_actions: ["*"],
          },
        },
      })
      .then(() => moderatorDeploymentsQuery.refetch());
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between pt-5">
        {moderatorQuery.isFetching ? (
          <Skeleton />
        ) : (
          <div className="flex items-center gap-2">
            <Bot />
            <h4 className="font-semibold">{moderatorQuery.data?.name}</h4>
          </div>
        )}
        <Button onClick={() => setDeploySheetOpen(true)}>Deploy</Button>
      </div>

      <StatsCards
        totalMessages={moderatorStatsQuery.data?.total_messages ?? 0}
        totalActions={moderatorStatsQuery.data?.total_actions ?? 0}
      />
      <MessagesChart chartData={chartData} />
      <DeploymentsSection
        deployments={moderatorDeploymentsQuery.data?.data ?? []}
        page={page}
        setPage={setPage}
        navigate={navigate}
      />

      <DeploySheet
        open={deploySheetOpen}
        onOpenChange={setDeploySheetOpen}
        onSubmit={handleDeploy}
      />
    </DashboardLayout>
  );
};

export default ModeratorPage;
