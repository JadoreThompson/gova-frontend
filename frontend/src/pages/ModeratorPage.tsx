import DeploymentsTable from "@/components/deployments-table";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { useOwnedDiscordGuildsQuery } from "@/hooks/connections-hooks";
import {
  useDeployModeratorMutation,
  useModeratorDeploymentsQuery,
  useModeratorQuery,
  useModeratorStatsQuery,
} from "@/hooks/moderators-hooks";
import {
  MessagePlatformType,
  type BaseActionDefinition,
  type NewMessageChartData,
} from "@/openapi";
import { Bot } from "lucide-react";
import React, { useMemo, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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

const MessagesChart: FC<{ chartData: NewMessageChartData[] }> = ({
  chartData,
}) => {
  const flattenedData = useMemo(() => {
    return chartData.map((entry) => ({
      date: entry.date,
      ...entry.counts,
    }));
  }, [chartData]);

  const platforms = useMemo(() => {
    if (flattenedData.length === 0) return [];
    return Object.keys(flattenedData[0]).filter((k) => k !== "date");
  }, [flattenedData]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Messages Processed (Last 6 Weeks)</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={flattenedData}
            barGap={4}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.95)",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              labelStyle={{ color: "#374151", fontWeight: 500 }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ fontSize: "12px", paddingBottom: "8px" }}
            />

            {platforms.map((platform) => {
              let color = "#9CA3AF";

              if (platform.toLowerCase().includes("discord")) color = "#5865F2";
              else if (platform.toLowerCase().includes("telegram"))
                color = "#229ED9";
              else if (platform.toLowerCase().includes("slack"))
                color = "#ECB22E";

              return (
                <Bar
                  key={platform}
                  dataKey={platform}
                  stackId="a"
                  fill={color}
                  radius={
                    platform === platforms[platforms.length - 1]
                      ? [6, 6, 0, 0]
                      : [0, 0, 0, 0]
                  }
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Define the type for the final allowed_actions array item
type AllowedAction = BaseActionDefinition | "*";

// Define the structure for action configuration passed to the submit handler
type DeploymentConfigData = {
  name: string;
  platform: MessagePlatformType;
  allowed_actions: AllowedAction[];
};

// Define a type for action definitions to be used in the frontend
type ActionField = {
  name: string;
  type: "number" | "text"; // Simplified for form input types
};

type ActionConfig = {
  type: string;
  fields: ActionField[];
  defaultRequiresApproval: boolean;
};

// Mock list of available actions for configuration
const AVAILABLE_ACTIONS: ActionConfig[] = [
  {
    type: "Mute",
    fields: [{ name: "duration_minutes", type: "number" }],
    defaultRequiresApproval: false,
  },
  {
    type: "Ban",
    fields: [{ name: "reason", type: "text" }],
    defaultRequiresApproval: true,
  },
  {
    type: "Kick",
    fields: [],
    defaultRequiresApproval: false,
  },
];

const DeploySheet: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DeploymentConfigData) => void;
}> = ({ open, onOpenChange, onSubmit }) => {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<MessagePlatformType | "">("");

  // New state for action configuration
  const [allowAll, setAllowAll] = useState(false);
  const [allowedActions, setAllowedActions] = useState<{
    [key: string]: {
      requires_approval: boolean;
      params: { [key: string]: string | number };
      enabled: boolean;
    };
  }>(
    AVAILABLE_ACTIONS.reduce((acc, action) => {
      acc[action.type] = {
        requires_approval: action.defaultRequiresApproval,
        params: {},
        enabled: false,
      };
      return acc;
    }, {} as any),
  );

  const handleToggleAction = (actionType: string, checked: boolean) => {
    setAllowAll(false); // Uncheck "Allow All" on fine-tune change
    setAllowedActions((prev) => ({
      ...prev,
      [actionType]: {
        ...prev[actionType],
        enabled: checked,
      },
    }));
  };

  const handleToggleRequiresApproval = (
    actionType: string,
    checked: boolean,
  ) => {
    setAllowedActions((prev) => ({
      ...prev,
      [actionType]: {
        ...prev[actionType],
        requires_approval: checked,
      },
    }));
  };

  const handleParamChange = (
    actionType: string,
    paramName: string,
    value: string,
  ) => {
    setAllowedActions((prev) => ({
      ...prev,
      [actionType]: {
        ...prev[actionType],
        params: {
          ...prev[actionType].params,
          [paramName]: value,
        },
      },
    }));
  };

  const handleAllowAllClick = () => {
    setAllowAll((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = Object.fromEntries(new FormData(e.currentTarget).entries());

    let finalActions: AllowedAction[];

    if (allowAll) {
      finalActions = ["*"];
    } else {
      finalActions = AVAILABLE_ACTIONS.filter(
        (action) => allowedActions[action.type].enabled,
      ).map((action) => {
        const config = allowedActions[action.type];

        // Collect parameters only if they have a non-empty string value
        const collectedParams = Object.entries(config.params).reduce(
          (acc, [key, value]) => {
            if (typeof value === "string" && value.trim() !== "") {
              // Attempt to convert to number if type is 'number'
              const fieldDef = action.fields.find((f) => f.name === key);
              if (fieldDef?.type === "number") {
                const numVal = parseFloat(value);
                if (!isNaN(numVal)) {
                  acc[key] = numVal;
                  return acc;
                }
              }
              acc[key] = value;
            } else if (typeof value === "number") {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, unknown>,
        );

        const baseAction: BaseActionDefinition = {
          type: action.type,
          requires_approval: config.requires_approval,
          ...collectedParams,
        } as BaseActionDefinition;

        return baseAction;
      });
    }

    onSubmit({
      name: fd["name"] as string,
      platform: fd["platform"] as MessagePlatformType,
      allowed_actions: finalActions,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] px-5 pt-10 sm:w-[480px]">
        <SheetClose className="absolute top-0 right-0 focus:!outline-none">
          x
        </SheetClose>

        <form onSubmit={handleSubmit}>
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

            <div className="mb-6">
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

            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Action Configuration
                </label>
                <Button
                  variant={allowAll ? "default" : "outline"}
                  size="sm"
                  className="w-fit text-xs"
                  type="button"
                  onClick={handleAllowAllClick}
                >
                  {allowAll ? "Allow All (Enabled)" : "Allow All"}
                </Button>
              </div>
              <Accordion
                type="multiple"
                className="mt-3 w-full border"
                disabled={allowAll}
              >
                {AVAILABLE_ACTIONS.map((action, idx) => (
                  <AccordionItem
                    value={`item-${idx + 1}`}
                    key={action.type}
                    className="transition-colors"
                  >
                    <AccordionTrigger className="flex items-center justify-between px-4 focus:!outline-none">
                      <div className="flex items-center gap-2">
                        <Input
                          type="checkbox"
                          className="h-4 w-fit"
                          checked={allowedActions[action.type].enabled}
                          onClick={(e) => e.stopPropagation()} // Prevent accordion toggle
                          onChange={(e) =>
                            handleToggleAction(action.type, e.target.checked)
                          }
                          disabled={allowAll}
                        />
                        <span>{action.type}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-secondary border-t p-4">
                      <div className="space-y-3">
                        {/* Action-specific fields */}
                        {action.fields.map((field) => (
                          <div key={field.name}>
                            <label
                              htmlFor={`${action.type}-${field.name}`}
                              className="text-sm font-medium"
                            >
                              {field.name.charAt(0).toUpperCase() +
                                field.name.slice(1).replace(/_/g, " ")}{" "}
                              (Optional)
                            </label>
                            <Input
                              id={`${action.type}-${field.name}`}
                              type={field.type === "number" ? "number" : "text"}
                              min={field.type === "number" ? 1 : undefined}
                              placeholder="Optional default value"
                              value={
                                allowedActions[action.type].params[
                                  field.name
                                ] || ""
                              }
                              onChange={(e) =>
                                handleParamChange(
                                  action.type,
                                  field.name,
                                  e.target.value,
                                )
                              }
                              className="mt-1"
                              disabled={
                                !allowedActions[action.type].enabled || allowAll
                              }
                            />
                          </div>
                        ))}

                        {/* Requires Approval checkbox */}
                        <div className="flex w-full items-center justify-start gap-2 pt-2">
                          <Input
                            type="checkbox"
                            id={`${action.type}-requires_approval`}
                            className="h-4 w-fit"
                            checked={
                              allowedActions[action.type].requires_approval
                            }
                            onChange={(e) =>
                              handleToggleRequiresApproval(
                                action.type,
                                e.target.checked,
                              )
                            }
                            disabled={
                              !allowedActions[action.type].enabled || allowAll
                            }
                          />
                          <label
                            htmlFor={`${action.type}-requires_approval`}
                            className="cursor-pointer text-sm font-medium"
                          >
                            Requires Approval
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {allowAll && (
                <p className="mt-2 text-sm text-gray-500">
                  All actions will be allowed with default settings. Disable
                  "Allow All" to fine configure.
                </p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="w-full border-1"
                disabled={!name || !platform}
              >
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
  const ownedDiscordGuildsQuery = useOwnedDiscordGuildsQuery();

  const handleDeploy = (data: DeploymentConfigData) => {
    console.log(data);
    return;
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
      <MessagesChart
        chartData={moderatorStatsQuery.data?.message_chart ?? []}
      />
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
