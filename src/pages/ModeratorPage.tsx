import DashboardLayout from "@/components/layouts/dashboard-layout";
import MessagesChart from "@/components/messages-chart";
import PaginationControls from "@/components/pagination-controls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useUpdateActionStatusMutation } from "@/hooks/queries/actions-hooks";
import {
  useModeratorActionsQuery,
  useModeratorQuery,
  useModeratorStatsQuery,
  useStartModeratorMutation,
  useStopModeratorMutation,
} from "@/hooks/queries/moderator-hooks";
import { ActionStatus, ModeratorStatus, type ActionResponse } from "@/openapi";
import dayjs from "dayjs";
import { Bot, CirclePlus, Loader2 } from "lucide-react";
import { useState, type FC } from "react";
import { useParams } from "react-router";

const ActionsTable: FC<{
  actions: ActionResponse[];
  isLoading: boolean;
}> = (props) => {
  const [selectedActionResponse, setSelectedActionResponse] =
    useState<ActionResponse | null>(null);
  const [viewedActionResponse, setViewedActionResponse] =
    useState<ActionResponse | null>(null);
  const updateActionResponseMutation = useUpdateActionStatusMutation();

  const handleApprove = () => {
    if (selectedActionResponse) {
      updateActionResponseMutation.mutate(
        {
          logId: selectedActionResponse.log_id,
          data: { status: ActionStatus.approved },
        },
        {
          onSuccess: () => setSelectedActionResponse(null),
        },
      );
    }
  };

  const handleDecline = () => {
    if (selectedActionResponse) {
      updateActionResponseMutation.mutate(
        {
          logId: selectedActionResponse.log_id,
          data: { status: ActionStatus.declined },
        },
        {
          onSuccess: () => setSelectedActionResponse(null),
        },
      );
    }
  };

  const getBadge = (status: ActionStatus) => {
    let className = "rounded-md px-2 py-0.5 text-xs font-medium capitalize ";

    switch (status) {
      case ActionStatus.success:
      case ActionStatus.approved:
        className +=
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        break;
      case ActionStatus.awaiting_approval:
        className +=
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
        break;
      case ActionStatus.failed:
      case ActionStatus.declined:
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
      <div className="overflow-hidden rounded-lg border shadow-sm">
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
                ActionResponses
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
                  onClick={() => setViewedActionResponse(action)}
                >
                  <TableCell className="capitalize">
                    {action.action_type}
                  </TableCell>
                  <TableCell>
                    {dayjs(action.created_at).format("YYYY-MM-DD HH:mm")}
                  </TableCell>
                  <TableCell>{getBadge(action.status)}</TableCell>
                  <TableCell className="text-right">
                    {action.status === ActionStatus.awaiting_approval && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedActionResponse(action);
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

      {/* Review ActionResponse Dialog */}
      <Dialog
        open={!!selectedActionResponse}
        onOpenChange={(isOpen) => !isOpen && setSelectedActionResponse(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review ActionResponse</DialogTitle>
            <DialogDescription>
              Approve or decline the action:{" "}
              <span className="font-semibold capitalize">
                "{selectedActionResponse?.action_type}"
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDecline}
              disabled={updateActionResponseMutation.isPending}
            >
              {updateActionResponseMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Decline
            </Button>
            <Button
              onClick={handleApprove}
              disabled={updateActionResponseMutation.isPending}
            >
              {updateActionResponseMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View ActionResponse Details Dialog */}
      <Dialog
        open={!!viewedActionResponse}
        onOpenChange={(isOpen) => !isOpen && setViewedActionResponse(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="!text-2xl capitalize">
              {viewedActionResponse?.action_type.replace(/_/g, " ")}
            </DialogTitle>
            <DialogDescription>
              The following parameters were used for this action.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-64 overflow-y-auto rounded-md bg-gray-100 p-4 dark:bg-neutral-800">
            {viewedActionResponse?.action_params &&
            Object.keys(viewedActionResponse.action_params).length > 0 ? (
              <pre className="text-sm">
                {JSON.stringify(viewedActionResponse.action_params, null, 2)}
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

const StatsCards: FC<{
  totalMessages: number;
  totalActionResponses: number;
}> = ({ totalMessages, totalActionResponses }) => (
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
          Total ActionResponses Taken
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">
          {totalActionResponses.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  </div>
);

const ACTIONS_PAGE_SIZE = 10;

const ModeratorPage: FC = () => {
  const { moderatorId } = useParams() as { moderatorId: string };

  const [page, setPage] = useState(1);
  const [selectedStatuses, setSelectedStatuses] = useState<ActionStatus[]>(
    Object.values(ActionStatus),
  );

  const startModeratorMutation = useStartModeratorMutation();
  const stopModeratorMutation = useStopModeratorMutation();
  const moderatorQuery = useModeratorQuery(moderatorId);
  const moderatorStatsQuery = useModeratorStatsQuery(moderatorId);
  const moderatorActionsQuery = useModeratorActionsQuery(moderatorId, {
    page,
    status: selectedStatuses,
  });

  const pollModerator = async () => {
    for (let i = 0; i < 15; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      moderatorQuery.refetch();
    }
  };

  const toggleModerator = () => {
    if (moderatorQuery.data?.status === ModeratorStatus.offline) {
      startModeratorMutation
        .mutateAsync(moderatorId)
        .then((rsp) => {
          console.log(rsp);
          pollModerator();
        })
        .catch((err) => {
          console.error(err);
        });
    } else if (moderatorQuery.data?.status === ModeratorStatus.online) {
      stopModeratorMutation
        .mutateAsync(moderatorId!)
        .then(() => {
          pollModerator();
        })
        .catch((err) => {});
    }
  };

  const toggleStatus = (status: ActionStatus) => {
    setPage(1);
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

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
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
        <Button onClick={toggleModerator}>
          {moderatorQuery.data?.status === ModeratorStatus.offline
            ? "Deploy"
            : moderatorQuery.data?.status == ModeratorStatus.online
              ? "Stop"
              : "Pending"}
        </Button>
      </div>

      <StatsCards
        totalMessages={moderatorStatsQuery.data?.total_messages ?? 0}
        totalActionResponses={moderatorStatsQuery.data?.total_actions ?? 0}
      />
      <MessagesChart
        chartData={moderatorStatsQuery.data?.message_chart ?? []}
      />

      <div className="mb-4 flex h-8 w-full gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <span className="bg-muted flex w-24 cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-neutral-600 text-sm font-semibold">
              <CirclePlus size={15} /> Status
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            {Object.values(ActionStatus).map((s) => (
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

      <ActionsTable
        actions={moderatorActionsQuery.data?.data ?? []}
        isLoading={moderatorActionsQuery.isFetching}
      />
      <div className="mt-4">
        <PaginationControls
          page={page}
          hasNextPage={!!moderatorActionsQuery.data?.has_next}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      </div>
    </DashboardLayout>
  );
};

export default ModeratorPage;
