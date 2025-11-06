import DashboardLayout from "@/components/layouts/dashboard-layout";
import MessagesChart from "@/components/messages-chart";
import PaginationControls from "@/components/pagination-controls";
import CustomToaster from "@/components/toaster";
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
  useDeletModeratorMutation,
  useModeratorActionsQuery,
  useModeratorQuery,
  useModeratorStatsQuery,
  useStartModeratorMutation,
  useStopModeratorMutation,
} from "@/hooks/queries/moderator-hooks";
import { queryKeys } from "@/lib/query/query-keys";
import { handleApi } from "@/lib/utils/base";
import {
  ActionStatus,
  getModeratorModeratorsModeratorIdGet,
  ModeratorStatus,
  type ActionResponse,
} from "@/openapi";
import { useStatusStore } from "@/stores/status-store";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  Bot,
  CirclePlus,
  EllipsisVertical,
  Loader2,
  Trash,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useRef, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

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
              <TableHead>Message</TableHead>
              <TableHead className="text-right font-bold text-gray-700 dark:text-gray-200">
                Action
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
                  <TableCell className="ellipsis">
                    {action.message.slice(0, 20)}
                    {action.message.length > 20 && "..."}
                  </TableCell>
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
            <DialogTitle>Review Action</DialogTitle>
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
          <div className="scrollbar-hide mt-4 max-h-64 space-y-4 overflow-y-auto">
            {viewedActionResponse?.action_params &&
            Object.keys(viewedActionResponse.action_params).length > 0 ? (
              <form className="space-y-3">
                {(
                  [
                    ...Object.entries(viewedActionResponse.action_params),
                    ["message", viewedActionResponse.message],
                  ] as [string, any][]
                ).map(([key, value]) => (
                  <div key={key} className="flex flex-col text-sm">
                    <label className="font-medium text-gray-600 capitalize dark:text-gray-300">
                      {key.replace(/_/g, " ")}
                    </label>
                    {key === "message" ? (
                      <textarea
                        name=""
                        id=""
                        readOnly
                        className="bg-primary-foreground scrollbar-hide h-50 resize-none rounded-md border border-gray-700 px-3 py-1.5 focus:outline-none"
                      >
                        {value}
                      </textarea>
                    ) : (
                      <Input
                        type="text"
                        readOnly
                        value={
                          typeof value === "object"
                            ? JSON.stringify(value, null, 2)
                            : String(value)
                        }
                        className="mt-1 w-full rounded-md border !border-gray-700 px-3 py-1.5 focus:!ring-0"
                      />
                    )}
                  </div>
                ))}
              </form>
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
          Total Actions Taken
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

const ModeratorPage: FC = () => {
  const { moderatorId } = useParams() as { moderatorId: string };
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [selectedStatuses, setSelectedStatuses] = useState<ActionStatus[]>(
    Object.values(ActionStatus),
  );
  const [status, setStatus] = useState<ModeratorStatus>(
    ModeratorStatus.offline,
  );
  const [showDeleteModerator, setShowDeleteModerator] = useState(false);

  const abortControllerRef = useRef(new AbortController());
  const pollingPromiseRef = useRef<Promise<void> | undefined>(undefined);
  const hasSetStatusRef = useRef(false);
  const hasCheckedStoreRef = useRef(false);

  const statusStore = useStatusStore((state) => state.data);
  const setStatusStore = useStatusStore((state) => state.setData);
  const deleteStatusStoreKey = useStatusStore((state) => state.deleteKey);
  const startModeratorMutation = useStartModeratorMutation();
  const stopModeratorMutation = useStopModeratorMutation();
  const moderatorQuery = useModeratorQuery(moderatorId);
  const moderatorStatsQuery = useModeratorStatsQuery(moderatorId);
  const moderatorActionsQuery = useModeratorActionsQuery(moderatorId, {
    page,
    status: selectedStatuses,
  } as any);
  const deleteModeratorMutation = useDeletModeratorMutation();

  useEffect(() => {
    if (!hasSetStatusRef.current && moderatorQuery.data?.status) {
      hasSetStatusRef.current = true;
      setStatus(moderatorQuery.data.status);
    }
  }, [moderatorQuery]);

  useEffect(() => {
    const handle = async () => {
      if (!abortControllerRef.current.signal.aborted) {
        abortControllerRef.current.abort();
        await pollingPromiseRef.current;
      }

      setStatus(ModeratorStatus.pending);
      abortControllerRef.current = new AbortController();
      pollingPromiseRef.current = pollForStatus(
        statusStore[moderatorId].targetStatus,
        abortControllerRef.current,
      );
    };

    if (!hasCheckedStoreRef.current && moderatorId in statusStore) {
      handle();
      hasCheckedStoreRef.current = true;
    }
  }, [statusStore, moderatorQuery]);

  useEffect(() => {
    return () => {
      if (!abortControllerRef.current.signal.aborted) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  async function pollForStatus(
    status: ModeratorStatus,
    signal: AbortController,
  ) {
    let attempts = 0;
    const maxAttempts = 30;

    while (!signal.signal.aborted && attempts < maxAttempts) {
      try {
        const rsp = await queryClient.fetchQuery({
          queryKey: queryKeys.moderator(moderatorId),
          queryFn: async () =>
            handleApi(await getModeratorModeratorsModeratorIdGet(moderatorId)),
        });

        if (rsp.status === status) {
          setStatus(rsp.status);
          deleteStatusStoreKey(moderatorId);
          return;
        }
      } catch (err) {
        attempts++;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  const handlePollForStatus = async (targetStatus: ModeratorStatus) => {
    if (!abortControllerRef.current.signal.aborted) {
      abortControllerRef.current.abort();
      await pollingPromiseRef.current;
    }

    setStatus(ModeratorStatus.pending);
    abortControllerRef.current = new AbortController();
    pollingPromiseRef.current = pollForStatus(
      targetStatus,
      abortControllerRef.current,
    );
    setStatusStore(moderatorId, { targetStatus });
  };

  const toggleModerator = () => {
    if (status === ModeratorStatus.pending) return;

    if (status === ModeratorStatus.offline) {
      setStatus(ModeratorStatus.pending);
      startModeratorMutation
        .mutateAsync(moderatorId)
        .then(() => {
          handlePollForStatus(ModeratorStatus.online);
        })
        .catch((err) => {
          console.error("Failed to start moderator", err);
          setStatus(ModeratorStatus.offline);
        });
    } else if (status === ModeratorStatus.online) {
      setStatus(ModeratorStatus.pending);
      stopModeratorMutation
        .mutateAsync(moderatorId)
        .then(() => {
          handlePollForStatus(ModeratorStatus.offline);
        })
        .catch((err) => {
          console.error("Failed to stop moderator", err);
          setStatus(ModeratorStatus.online);
        });
    }
  };

  const toggleStatus = (statusToToggle: ActionStatus) => {
    setPage(1);
    setSelectedStatuses((prev) => {
      if (prev.includes(statusToToggle)) {
        if (prev.length > 1) {
          return prev.filter((s) => s !== statusToToggle);
        }
        return prev;
      } else {
        return [...prev, statusToToggle];
      }
    });
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const botColorClass = {
    [ModeratorStatus.online]: "text-green-500",
    [ModeratorStatus.offline]: "text-white",
    [ModeratorStatus.pending]: "text-yellow-500",
  }[status];

  return (
    <>
      <CustomToaster position="top-center" />
      {showDeleteModerator && (
        <div className="fixed flex h-screen w-full items-center justify-center">
          <Dialog
            open={showDeleteModerator}
            onOpenChange={(isOpen) => setShowDeleteModerator(isOpen)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex gap-3 !text-2xl capitalize">
                  <TriangleAlert /> Delete Moderator
                </DialogTitle>
                <DialogDescription>
                  The following parameters were used for this action.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModerator(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() =>
                    deleteModeratorMutation
                      .mutateAsync(moderatorId)
                      .then(() => navigate("/moderators"))
                      .catch((err) => {
                        const error = err.error?.error;
                        if (error) {
                          toast(error);
                        } else {
                          toast("An unexpected error occured");
                          console.error(err);
                        }
                      })
                  }
                >
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <DashboardLayout>
        <div className="mb-6 flex items-center justify-between pt-5">
          {moderatorQuery.isFetching && !moderatorQuery.data ? (
            <Skeleton className="h-8 w-48" />
          ) : (
            <div className="flex items-center gap-2">
              <Bot className={`${botColorClass} animate-bot`} />
              <h4 className="font-semibold">{moderatorQuery.data?.name}</h4>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Button
              onClick={toggleModerator}
              disabled={status === "pending"}
              variant={
                status === ModeratorStatus.online ? "destructive" : "default"
              }
            >
              {status === "pending" && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {status === ModeratorStatus.offline && "Launch"}
              {status === ModeratorStatus.online && "Stop"}
              {status === "pending" && "Pending"}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="!bg-transparent">
                  <EllipsisVertical className="text-white"></EllipsisVertical>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-50 p-1">
                <div className="flex flex-col">
                  <div
                    onClick={() => setShowDeleteModerator(true)}
                    className="hover:bg-secondary flex cursor-pointer items-center justify-start gap-3 rounded-sm p-1"
                  >
                    <Trash size="10" className="text-red-500" />
                    <span className="text-xs">Delete Moderator</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
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
    </>
  );
};

export default ModeratorPage;
