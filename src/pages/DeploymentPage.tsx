import DashboardLayout from "@/components/layouts/dashboard-layout";
import MessagesChart from "@/components/messages-chart";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeploymentActionsQuery,
  useUpdateActionStatusMutation,
} from "@/hooks/actions-hooks";
import {
  useDeploymentQuery,
  useDeploymentStatsQuery,
  useStartDeploymentMutation,
  useStopDeploymentMutation,
} from "@/hooks/deployments-hooks";
import {
  ActionStatus as ActionStatusEnum,
  ActionUpdateStatus,
  ModeratorStatus,
  type ActionStatus,
  type DeploymentAction,
} from "@/openapi";
import dayjs from "dayjs";
import { CirclePlus, Loader2 } from "lucide-react";
import { useState, type FC } from "react";
import { useParams } from "react-router";

const DeploymentActionsTable: FC<{
  actions: DeploymentAction[];
  deploymentId: string;
  isLoading: boolean;
}> = (props) => {
  const [selectedAction, setSelectedAction] = useState<DeploymentAction | null>(
    null,
  );
  const [viewedAction, setViewedAction] = useState<DeploymentAction | null>(
    null,
  );
  const updateActionMutation = useUpdateActionStatusMutation();

  const handleApprove = () => {
    if (selectedAction) {
      updateActionMutation.mutate(
        {
          logId: selectedAction.log_id,
          deploymentId: props.deploymentId,
          data: { status: ActionUpdateStatus.approved },
        },
        {
          onSuccess: () => setSelectedAction(null),
        },
      );
    }
  };

  const handleDecline = () => {
    if (selectedAction) {
      updateActionMutation.mutate(
        {
          logId: selectedAction.log_id,
          deploymentId: props.deploymentId,
          data: { status: ActionUpdateStatus.declined },
        },
        {
          onSuccess: () => setSelectedAction(null),
        },
      );
    }
  };

  const getBadge = (status: ActionStatus) => {
    let className = "rounded-md px-2 py-0.5 text-xs font-medium capitalize ";

    switch (status) {
      case ActionStatusEnum.success:
      case ActionStatusEnum.approved:
        className +=
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        break;
      case ActionStatusEnum.pending:
      case ActionStatusEnum.awaiting_approval:
        className +=
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
        break;
      case ActionStatusEnum.failed:
      case ActionStatusEnum.declined:
        className +=
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
        break;
      default:
        className +=
          "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
        break;
    }
    return <span className={className}>{status.replace(/_/g, " ")}</span>;
  };

  return (
    <>
      <div className="border bg-transparent shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-neutral-800">
            <TableRow>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                Type
              </TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                Created At
              </TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                Status
              </TableHead>
              <TableHead className="text-right font-bold text-gray-700 dark:text-gray-200">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {props.isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : props.actions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-muted-foreground py-10 text-center"
                >
                  No actions found for the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              props.actions.map((action) => (
                <TableRow
                  key={action.log_id}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40"
                  onClick={() => setViewedAction(action)}
                >
                  <TableCell className="capitalize">
                    {action.action_type}
                  </TableCell>
                  <TableCell>
                    {dayjs(action.created_at).format("YYYY-MM-DD HH:mm")}
                  </TableCell>
                  <TableCell>{getBadge(action.status)}</TableCell>
                  <TableCell className="text-right">
                    {action.status === ActionStatusEnum.awaiting_approval && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAction(action);
                        }}
                      >
                        Review
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Review Action Dialog */}
      <Dialog
        open={!!selectedAction}
        onOpenChange={(isOpen) => !isOpen && setSelectedAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Action</DialogTitle>
            <DialogDescription>
              Approve or decline the action:{" "}
              <span className="font-semibold capitalize">
                "{selectedAction?.action_type}"
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDecline}
              disabled={updateActionMutation.isPending}
            >
              {updateActionMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Decline
            </Button>
            <Button
              onClick={handleApprove}
              disabled={updateActionMutation.isPending}
            >
              {updateActionMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Action Details Dialog */}
      <Dialog
        open={!!viewedAction}
        onOpenChange={(isOpen) => !isOpen && setViewedAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="!text-2xl capitalize">
              {viewedAction?.action_type.replace(/_/g, " ")}
            </DialogTitle>
            <DialogDescription>
              The following parameters were used for this action.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-64 overflow-y-auto rounded-md bg-gray-100 p-4 dark:bg-neutral-800">
            {viewedAction?.action_params &&
            Object.keys(viewedAction.action_params).length > 0 ? (
              <pre className="text-sm">
                {JSON.stringify(viewedAction.action_params, null, 2)}
              </pre>
            ) : (
              <p className="text-muted-foreground text-sm">
                No parameters for this action.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const DeploymentPage: FC = () => {
  const { deploymentId } = useParams<{ deploymentId: string }>();

  const deploymentQuery = useDeploymentQuery(deploymentId);
  const deploymentStatsQuery = useDeploymentStatsQuery(deploymentId!);
  const deploymentActionsQuery = useDeploymentActionsQuery(deploymentId!, {
    page: 1,
  });

  const [selectedStatuses, setSelectedStatuses] = useState<ActionStatus[]>(
    Object.values(ActionStatusEnum),
  );

  const startDeploymentMutation = useStartDeploymentMutation();
  const stopDeploymentMutation = useStopDeploymentMutation();

  const handleStartDeployment = () => {
    startDeploymentMutation.mutate(deploymentId!);
  };

  const handleStopDeployment = () => {
    stopDeploymentMutation.mutate(deploymentId!);
  };

  const toggleStatus = (status: ActionStatus) => {
    setSelectedStatuses((prev) => {
      if (prev.includes(status)) {
        if (prev.length > 1) {
          return prev.filter((s) => s !== status);
        }

        return prev;
      } else {
        return [...prev, status];
      }
    });
  };

  const filteredActions =
    deploymentActionsQuery.data?.data?.filter((action) =>
      selectedStatuses.length > 0
        ? selectedStatuses.includes(action.status)
        : true,
    ) ?? [];

  const deployment = deploymentQuery.data;
  const isControlBusy =
    startDeploymentMutation.isPending || stopDeploymentMutation.isPending;

  return (
    <DashboardLayout>
      {deploymentQuery.isLoading || !deployment ? (
        <Skeleton className="h-full w-full" />
      ) : (
        <>
          <section className="mb-6 flex items-center justify-between">
            <div>
              <h4 className="text-xl font-semibold">{deployment.name}</h4>
              <p className="text-muted-foreground text-sm">
                Created{" "}
                {dayjs(deployment.created_at).format("YYYY-MM-DD HH:mm")}
              </p>
            </div>

            {deployment.status === ModeratorStatus.online && (
              <Button
                variant="destructive"
                disabled={isControlBusy}
                onClick={handleStopDeployment}
                className="flex w-36 items-center gap-2"
              >
                {stopDeploymentMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {stopDeploymentMutation.isPending
                  ? "Stopping..."
                  : "Stop Deployment"}
              </Button>
            )}

            {deployment.status === ModeratorStatus.offline && (
              <Button
                disabled={isControlBusy}
                onClick={handleStartDeployment}
                className="flex w-36 items-center gap-2 bg-green-600 text-white hover:bg-green-700"
              >
                {startDeploymentMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {startDeploymentMutation.isPending
                  ? "Starting..."
                  : "Start Deployment"}
              </Button>
            )}
          </section>

          <section className="mb-6 grid h-20 grid-cols-3 gap-4">
            {deploymentStatsQuery.isFetching ? (
              <>
                <Skeleton className="h-full w-full" />
                <Skeleton className="h-full w-full" />
                <Skeleton className="h-full w-full" />
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
                  <p className="text-muted-foreground text-sm">
                    Actions Performed
                  </p>
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

          {/* Filters */}
          <div className="mb-4 flex h-8 w-full gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <span className="bg-muted flex w-24 cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-neutral-600 text-sm font-semibold">
                  <CirclePlus size={15} /> Status
                </span>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                {Object.values(ActionStatusEnum).map((s) => (
                  <label
                    key={s}
                    className="flex cursor-pointer items-center gap-2 p-1 text-sm"
                  >
                    <Input
                      type="checkbox"
                      checked={selectedStatuses.includes(s)}
                      onChange={() => toggleStatus(s)}
                      className="w-5"
                    />
                    <span className="capitalize">{s.replace(/_/g, " ")}</span>
                  </label>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          <DeploymentActionsTable
            actions={filteredActions}
            deploymentId={deploymentId!}
            isLoading={deploymentActionsQuery.isFetching}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default DeploymentPage;
