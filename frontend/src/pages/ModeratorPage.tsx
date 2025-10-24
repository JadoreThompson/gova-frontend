import DeploymentsTable from "@/components/deployments-table";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import MessagesChart from "@/components/messages-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useModeratorDeploymentsQuery,
  useModeratorQuery,
  useModeratorStatsQuery,
} from "@/hooks/moderators-hooks";
import { Bot } from "lucide-react";
import { useState, type FC } from "react";
import { useNavigate, useParams } from "react-router";

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

const ModeratorPage: FC = () => {
  const { moderatorId } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const moderatorQuery = useModeratorQuery(moderatorId);
  const moderatorStatsQuery = useModeratorStatsQuery(moderatorId);
  const moderatorDeploymentsQuery = useModeratorDeploymentsQuery(moderatorId, {
    page,
  });

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
        <Button onClick={() => navigate(`/moderators/${moderatorId}/deploy`)}>
          Deploy
        </Button>
      </div>

      <StatsCards
        totalMessages={moderatorStatsQuery.data?.total_messages ?? 0}
        totalActions={moderatorStatsQuery.data?.total_actions ?? 0}
      />
      <MessagesChart
        chartData={moderatorStatsQuery.data?.message_chart ?? []}
      />
      <DeploymentsTable
        deployments={moderatorDeploymentsQuery.data?.data ?? []}
        page={page}
        hasNextPage={false}
        onPrevPage={() => setPage((p) => p - 1)}
        onNextPage={() => setPage((p) => p + 1)}
        onRowClick={(d) => navigate(`/deployments/${d.deployment_id}`)}
      />
    </DashboardLayout>
  );
};

export default ModeratorPage;
