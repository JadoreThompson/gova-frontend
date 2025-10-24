import DashboardLayout from "@/components/layouts/dashboard-layout";
import MessagesChart from "@/components/messages-chart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeploymentStatsQuery } from "@/hooks/deployments-hooks";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import { type FC, useState } from "react";
import { useParams } from "react-router";

// Mock data
const MOCK_DEPLOYMENT = {
  id: "dep-001",
  name: "Discord Bot V1.3",
  created_at: new Date().toISOString(),
  messages_processed: 15234,
  actions_performed: 87,
  actions_pending: 5,
};

const MOCK_ACTIONS = [
  { id: 1, type: "ban", created_at: "2025-10-14T10:23:00Z", status: "success" },
  {
    id: 2,
    type: "mute",
    created_at: "2025-10-15T09:12:00Z",
    status: "success",
  },
  {
    id: 3,
    type: "warn",
    created_at: "2025-10-16T12:05:00Z",
    status: "pending",
  },
  { id: 4, type: "kick", created_at: "2025-10-17T07:55:00Z", status: "failed" },
];

const DeploymentPage: FC = () => {
  const { deploymentId } = useParams<{ deploymentId: string }>();
  const [isStopping, setIsStopping] = useState(false);

  const deploymentStatsQuery = useDeploymentStatsQuery(deploymentId!);

  const handleStopDeployment = async () => {
    setIsStopping(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsStopping(false);
    alert("Deployment stopped successfully.");
  };

  const deployment = MOCK_DEPLOYMENT;
  const actions = MOCK_ACTIONS;

  return (
    <DashboardLayout>
      <section className="mb-6 flex items-center justify-between">
        <div>
          <h4 className="text-xl font-semibold">{deployment.name}</h4>
          <p className="text-muted-foreground text-sm">
            Created {dayjs(deployment.created_at).format("YYYY-MM-DD HH:mm")}
          </p>
        </div>

        <Button
          variant="destructive"
          disabled={isStopping}
          onClick={handleStopDeployment}
          className="flex items-center gap-2"
        >
          {isStopping && <Loader2 className="h-4 w-4 animate-spin" />}
          {isStopping ? "Stopping..." : "Stop Deployment"}
        </Button>
      </section>

      <section className="mb-6 grid h-20 grid-cols-3 gap-4">
        {deploymentStatsQuery.isFetching ? (
          <>
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          <>
            <div className="rounded-md border p-4 shadow-sm">
              <p className="text-muted-foreground text-sm">
                Messages Processed
              </p>
              <p className="text-2xl font-bold">
                {deploymentStatsQuery.data?.total_messages.toLocaleString()}
              </p>
            </div>
            <div className="rounded-md border p-4 shadow-sm">
              <p className="text-muted-foreground text-sm">Actions Performed</p>
              <p className="text-2xl font-bold">
                {deploymentStatsQuery.data?.total_actions}
              </p>
            </div>
          </>
        )}
      </section>

      <section className="mb-6">
        <MessagesChart
          chartData={deploymentStatsQuery.data?.message_chart ?? []}
        />
      </section>

      {/* Third Row - Actions Table */}
      <div className="rounded-md border bg-transparent shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-neutral-800">
            <TableRow>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                Type
              </TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                Created At
              </TableHead>
              <TableHead className="text-right font-bold text-gray-700 dark:text-gray-200">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.map((action) => (
              <TableRow
                key={action.id}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40"
              >
                <TableCell className="capitalize">{action.type}</TableCell>
                <TableCell>
                  {dayjs(action.created_at).format("YYYY-MM-DD HH:mm")}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      action.status === "success"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : action.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {action.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default DeploymentPage;
