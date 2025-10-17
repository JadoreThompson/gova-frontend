import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MessagePlatformType, ModeratorDeploymentState } from "@/openapi";
import { ChevronLeft, ChevronRight, Loader2, SettingsIcon } from "lucide-react";
import { type FC, useMemo, useState } from "react";

// Mocking Tanstack Query structure for the hook
// In a real project, this dependency would be imported: import { useQuery } from "@tanstack/react-query";
interface MockQueryReturn<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
}

// --- ORVAL TYPE SIMULATION (for local testing) ---
// Since we can't import types from '@/openapi' here and use the mock, we define the required types locally.
// export enum ModeratorDeploymentState {
//   offline = "offline",
//   pending = "pending",
//   online = "online",
// }

// export enum MessagePlatformType {
//   discord = "discord",
// }

export interface DeploymentResponse {
  deployment_id: string;
  moderator_id: string;
  platform: MessagePlatformType;
  name: string;
  conf: unknown;
  state: ModeratorDeploymentState;
  created_at: string;
}

export interface PaginatedResponseDeploymentResponse {
  page: number;
  size: number;
  has_next: boolean;
  data: DeploymentResponse[];
}
// --- END ORVAL TYPE SIMULATION ---

// --- MOCK DATA IMPLEMENTATION ---

const mockDiscordConfig = {
  guild_id: 123456789,
  allowed_channels: [101, 102, 103],
  allowed_actions: [
    { type: "ban", reason: "Violation of rules" },
    { type: "mute", reason: "Spamming" },
  ],
};

const createMockDeployment = (
  id: number,
  state: ModeratorDeploymentState,
  name: string,
): DeploymentResponse => ({
  deployment_id: `dep-${id.toString().padStart(3, "0")}`,
  moderator_id: `mod-${id.toString().padStart(3, "0")}`,
  platform: MessagePlatformType.discord,
  name: name,
  conf: mockDiscordConfig,
  state: state,
  created_at: new Date(Date.now() - id * 86400000).toISOString(), // Days ago
});

const MOCK_DEPLOYMENTS_LIST: DeploymentResponse[] = [
  createMockDeployment(1, ModeratorDeploymentState.online, "Discord Bot V1.2"),
  createMockDeployment(2, ModeratorDeploymentState.online, "Community Mod 2.0"),
  createMockDeployment(3, ModeratorDeploymentState.offline, "Archive 2023"),
  createMockDeployment(
    4,
    ModeratorDeploymentState.pending,
    "Test Deployment 4",
  ),
  createMockDeployment(5, ModeratorDeploymentState.online, "Main Server Mod"),
  createMockDeployment(6, ModeratorDeploymentState.offline, "Debug Instance X"),
  createMockDeployment(
    7,
    ModeratorDeploymentState.online,
    "High Traffic Guard",
  ),
  createMockDeployment(8, ModeratorDeploymentState.pending, "Scheduled Update"),
  createMockDeployment(9, ModeratorDeploymentState.online, "Discord Bot V1.3"),
  createMockDeployment(10, ModeratorDeploymentState.offline, "Stale Instance"),
  createMockDeployment(11, ModeratorDeploymentState.online, "Backup Moderator"),
  createMockDeployment(
    12,
    ModeratorDeploymentState.pending,
    "New Feature Rollout",
  ),
  createMockDeployment(
    13,
    ModeratorDeploymentState.online,
    "Beta Channel Monitor",
  ),
  createMockDeployment(14, ModeratorDeploymentState.offline, "Legacy System"),
  createMockDeployment(15, ModeratorDeploymentState.online, "Deployment 15"),
];

const MOCK_PAGE_SIZE = 5;
const MOCK_DELAY = 700;

const getMockDeploymentPage = (
  page: number,
  size: number = MOCK_PAGE_SIZE,
): PaginatedResponseDeploymentResponse => {
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;

  const data = MOCK_DEPLOYMENTS_LIST.slice(startIndex, endIndex);
  const has_next = endIndex < MOCK_DEPLOYMENTS_LIST.length;

  return {
    page,
    size,
    has_next,
    data,
  };
};

/**
 * MOCK implementation of useDeploymentsQuery for development/mocking purposes.
 * Simulates API fetching and pagination delay.
 */
function useDeploymentsQuery(params: {
  page: number;
}): MockQueryReturn<PaginatedResponseDeploymentResponse> {
  const page = params.page ?? 1;

  // We use a simple local state to simulate fetching and caching
  const [mockData, setMockData] = useState<
    PaginatedResponseDeploymentResponse | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  useMemo(() => {
    if (page < 1) return;

    const fetchData = async () => {
      setIsFetching(true);
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
        const data = getMockDeploymentPage(page);
        setMockData(data);
      } catch (error) {
        // Should handle error state simulation here if needed
        console.error("Mock query error:", error);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    };

    // On page change, simulate refetching/loading
    setIsFetching(true);
    fetchData();
  }, [page]);

  return {
    data: mockData,
    isLoading: isLoading, // Initial loading state
    isError: false, // Simple mock, assume no error
    isFetching: isFetching, // Loading state on subsequent pages
  };
}
// --- END MOCK HOOK IMPLEMENTATION ---

// --- Helper Components ---

/** Renders a stylized badge based on the deployment state. */
const StatusBadge: FC<{ state: ModeratorDeploymentState }> = ({ state }) => {
  const customVariantClass = useMemo(() => {
    switch (state) {
      case ModeratorDeploymentState.online:
        return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200";
      case ModeratorDeploymentState.pending:
        return "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200";
      case ModeratorDeploymentState.offline:
      default:
        return "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200";
    }
  }, [state]);

  return (
    <Badge variant="outline" className={`capitalize ${customVariantClass}`}>
      {state}
    </Badge>
  );
};

/** Renders the pagination controls for the table. */
interface TablePaginationProps {
  page: number;
  hasNext: boolean;
  isFetching: boolean;
  setPage: (page: number) => void;
}

const TablePagination: FC<TablePaginationProps> = ({
  page,
  hasNext,
  isFetching,
  setPage,
}) => (
  <div className="flex items-center justify-between space-x-2 px-2 py-4">
    <div className="text-muted-foreground text-sm">
      Showing page {page} of{" "}
      {Math.ceil(MOCK_DEPLOYMENTS_LIST.length / MOCK_PAGE_SIZE)}
    </div>
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(page - 1)}
        disabled={page <= 1 || isFetching}
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(page + 1)}
        disabled={!hasNext || isFetching}
      >
        Next <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  </div>
);

// --- Main Page Component ---

const DeploymentsPage: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // NOTE: In a real environment, replace this mock hook with:
  // const { data, isLoading, isError, isFetching } = useDeploymentsQuery({ page: currentPage });
  const { data, isLoading, isError, isFetching } = useDeploymentsQuery({
    page: currentPage,
  });

  const deployments = data?.data || [];
  const hasNext = data?.has_next || false;

  const handleSetPage = (page: number) => {
    // Ensure page doesn't go below 1
    setCurrentPage(Math.max(1, page));
  };

  // --- Render States ---

  if (isError) {
    return (
      <DashboardLayout>
        <h4 className="mb-6 text-xl font-semibold">Deployments</h4>
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-600">
          Error loading deployments. Please try again later.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-semibold">Deployments</h4>
        {/* Future action button */}
        {/* <Button>Deploy New</Button> */}
      </div>

      <div className=" border bg-white shadow-lg dark:bg-gray-800">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-700">
            <TableRow>
              <TableHead className="w-[250px] font-bold text-gray-700 dark:text-gray-200">
                Name
              </TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                Platform
              </TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                Status
              </TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                Config
              </TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                Date Created
              </TableHead>
              <TableHead className="text-right font-bold text-gray-700 dark:text-gray-200">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(isLoading || isFetching) && deployments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
                  <p className="text-muted-foreground mt-2 text-sm">
                    Loading deployments...
                  </p>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && deployments.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-muted-foreground h-24 text-center"
                >
                  No deployments found.
                </TableCell>
              </TableRow>
            )}

            {deployments.map((deployment: DeploymentResponse) => (
              <TableRow
                key={deployment.deployment_id}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                  {deployment.name || "Unnamed Deployment"}
                </TableCell>
                <TableCell className="text-muted-foreground capitalize">
                  {deployment.platform}
                </TableCell>
                <TableCell>
                  <StatusBadge state={deployment.state} />
                  {isFetching && (
                    <span className="ml-2 flex items-center text-xs text-blue-500">
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="View Configuration"
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <SettingsIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                  {/* {format(
                    new Date(deployment.created_at),
                    "MMM dd, yyyy HH:mm",
                  )} */}
                  {deployment.created_at}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-blue-50 hover:text-blue-600"
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {/* Show pagination if we are not in initial loading phase and we have data or potential next pages */}
      {!isLoading && (deployments.length > 0 || currentPage > 1 || hasNext) && (
        <TablePagination
          page={currentPage}
          hasNext={hasNext}
          isFetching={isFetching}
          setPage={handleSetPage}
        />
      )}
    </DashboardLayout>
  );
};

export default DeploymentsPage;
