import DashboardLayout from "@/components/layouts/dashboard-layout";
import MessagePlatformImg from "@/components/message-platform-image";
import CustomToaster from "@/components/toaster";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDiscordChannelsQuery,
  useOwnedDiscordGuildsQuery,
} from "@/hooks/queries/connections-hooks";
import { useCreateModeratorMutation } from "@/hooks/queries/moderator-hooks";
import { cn } from "@/lib/utils";
import { MessagePlatform, type ModeratorCreate } from "@/openapi";
import type { DiscordAction, DiscordConfigBody } from "@/types/discord";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { ArrowLeft, RefreshCcwIcon } from "lucide-react";
import { useState, type FC } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface ModeratorCreationStageProps<T> {
  onNext: (arg: T) => void;
}

const AVAILABLE_ACTIONS = [
  {
    type: "reply" as const,
    fields: [],
    defaultRequiresApproval: false,
  },
  {
    type: "timeout" as const,
    fields: [{ name: "duration", type: "number", label: "Duration (ms)" }],
    defaultRequiresApproval: false,
  },
  {
    type: "kick" as const,
    fields: [],
    defaultRequiresApproval: false,
  },
] as const;

const EnterGuidelinesCard: FC<ModeratorCreationStageProps<string>> = (
  props,
) => {
  const [guidelines, setGuidelinesText] = useState("");

  return (
    <>
      <h4 className="mb-3 font-semibold">Enter Guidelines</h4>
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col gap-4">
          <textarea
            id="guidelines"
            placeholder="Enter your moderation guidelines (minimum 10 characters)..."
            value={guidelines}
            onChange={(e) => setGuidelinesText(e.target.value)}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 min-h-[150px] max-w-2xl rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          />

          <Button
            type="button"
            onClick={() => props.onNext(guidelines)}
            disabled={guidelines.trim().length < 10}
            className="w-fit"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

const SetModeratorNameCard: FC<ModeratorCreationStageProps<string>> = (
  props,
) => {
  const [name, setName] = useState("");

  return (
    <>
      <h4 className="mb-3 font-semibold">Name your Moderator</h4>
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col gap-4">
          <Input
            id="moderator-name"
            placeholder="e.g. My-Discord-Moderator"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 max-w-sm"
          />

          <Button
            type="button"
            onClick={() => props.onNext(name)}
            disabled={name.trim().length === 0}
            className="w-fit"
          >
            Create Moderator
          </Button>
        </div>
      </div>
    </>
  );
};

const EnterInstructionsCard: FC<ModeratorCreationStageProps<string | null>> = (
  props,
) => {
  const [instructions, setInstructions] = useState("");

  return (
    <>
      <h4 className="mb-3 font-semibold">Custom Instructions (Optional)</h4>
      <p className="text-muted-foreground mb-3 text-sm">
        Provide custom instructions to tailor the agent's behavior. This is
        optional.
      </p>
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col gap-4">
          <textarea
            id="instructions"
            placeholder="Enter custom instructions for the moderator agent..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 min-h-[150px] max-w-2xl rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          />

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => props.onNext(null)}
              className="w-fit"
            >
              Skip
            </Button>
            <Button
              type="button"
              onClick={() => props.onNext(instructions.trim() || null)}
              className="w-fit"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const SelectActionsCard: FC<ModeratorCreationStageProps<DiscordAction[]>> = (
  props,
) => {
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
    console.log("Action type ", actionType, "checked, ", checked);
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

  const finalizeAndSubmit = () => {
    let finalActions: DiscordAction[];

    if (allowAll) {
      finalActions = AVAILABLE_ACTIONS.map((action) => {
        if (action.type === "reply") {
          return {
            type: "reply" as const,
            platform: "discord" as const,
            requires_approval: false,
            default_params: null,
          };
        } else if (action.type === "timeout") {
          return {
            type: "timeout" as const,
            platform: "discord" as const,
            requires_approval: false,
            default_params: { duration: null },
          };
        } else {
          return {
            type: "kick" as const,
            platform: "discord" as const,
            requires_approval: false,
            default_params: null,
          };
        }
      });
    } else {
      finalActions = AVAILABLE_ACTIONS.filter(
        (action) => allowedActions[action.type].enabled,
      ).map((action) => {
        const config = allowedActions[action.type];

        if (action.type === "reply") {
          return {
            type: "reply" as const,
            platform: "discord" as const,
            requires_approval: config.requires_approval,
            default_params: null,
          };
        } else if (action.type === "timeout") {
          const duration = config.params.duration;
          return {
            type: "timeout" as const,
            platform: "discord" as const,
            requires_approval: config.requires_approval,
            default_params: {
              duration:
                duration && typeof duration === "number" ? duration : null,
            },
          };
        } else {
          return {
            type: "kick" as const,
            platform: "discord" as const,
            requires_approval: config.requires_approval,
            default_params: null,
          };
        }
      });
    }

    props.onNext(finalActions);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="font-semibold">Action Configuration</h4>
          <Button
            variant="outline"
            size="sm"
            className=""
            type="button"
            onClick={handleAllowAllClick}
          >
            {allowAll ? "Allow All (Enabled)" : "Allow All"}
          </Button>
        </div>
        <Accordion
          type="multiple"
          className="w-full overflow-hidden rounded-md border"
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
                        {field.label
                          ? field.label
                          : field.name.charAt(0).toUpperCase() +
                            field.name.slice(1).replace(/_/g, " ") +
                            " (Optional)"}
                      </label>
                      <Input
                        id={`${action.type}-${field.name}`}
                        type={field.type === "number" ? "number" : "text"}
                        min={field.type === "number" ? 1 : undefined}
                        placeholder="Optional default value"
                        value={
                          allowedActions[action.type].params[field.name] || ""
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
                      checked={allowedActions[action.type].requires_approval}
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
      </div>
      <div className="mt-6 flex w-full items-center justify-start">
        <Button
          type="button"
          onClick={finalizeAndSubmit}
          disabled={
            !allowAll && !Object.values(allowedActions).some((a) => a.enabled)
          }
        >
          Confirm Actions
        </Button>
      </div>
    </div>
  );
};

const SetGuildSummaryCard: FC<ModeratorCreationStageProps<string>> = (
  props,
) => {
  const [summary, setSummary] = useState("");

  return (
    <>
      <h4 className="mb-3 font-semibold">Guild Summary</h4>
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col gap-4">
          <textarea
            id="guild-summary"
            placeholder="Provide a brief summary of your guild/server..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 min-h-[100px] max-w-2xl rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          />

          <Button
            type="button"
            onClick={() => props.onNext(summary)}
            disabled={summary.trim().length === 0}
            className="w-fit"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

const SelectChannelsCard: FC<
  ModeratorCreationStageProps<string[]> & {
    guildId: string;
  }
> = (props) => {
  const discordChannelsQuery = useDiscordChannelsQuery(props.guildId);
  const [selectedChannels, setSelectedChannels] = useState<{
    [key: string]: boolean;
  }>({});

  const handleConfirm = () => {
    props.onNext(Object.keys(selectedChannels));
  };

  const hasError = !!discordChannelsQuery.error;

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col items-start gap-4">
        {discordChannelsQuery.isFetching ? (
          <Skeleton className="h-32 w-full rounded-lg" />
        ) : (
          <div className="w-full">
            <div className="mb-4 flex w-full items-center justify-between">
              <h4 className="font-semibold">Select Channels</h4>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    discordChannelsQuery.refetch();
                  }}
                  className="hover:bg-secondary/80 rounded-md px-4 py-2 transition"
                >
                  <RefreshCcwIcon />
                  Refresh
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    if (!discordChannelsQuery.data) return;
                    props.onNext(discordChannelsQuery.data.map((ch) => ch.id));
                  }}
                  className="hover:bg-secondary/80 rounded-md px-4 py-2 transition"
                  disabled={hasError}
                >
                  Select All
                </Button>
              </div>
            </div>

            {hasError ? (
              <div className="bg-secondary flex h-25 w-full items-center justify-center rounded-md border-gray-500">
                <a
                  href={import.meta.env.VITE_DISCORD_BOT_URL}
                  target="_blank"
                  className="text-blue-200 !underline"
                >
                  Add to guild
                </a>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  {discordChannelsQuery.data?.map((ch) => {
                    const isSelected = ch.id in selectedChannels;

                    return (
                      <div
                        key={ch.id}
                        onClick={() =>
                          setSelectedChannels((prev) => {
                            const updated = { ...prev };
                            if (isSelected) delete updated[ch.id];
                            else updated[ch.id] = true;
                            return updated;
                          })
                        }
                        className={cn(
                          "bg-secondary/40 hover:bg-secondary/60 flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-gray-700 p-3 transition-all duration-200 hover:shadow-md",
                          isSelected &&
                            "border-green-400 bg-green-500/20 hover:bg-green-500/30",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "h-4 w-4 rounded-full border border-gray-500 transition-colors",
                              isSelected && "border-green-500 bg-green-500",
                            )}
                          ></span>
                          <span className="truncate font-medium text-gray-100">
                            {ch.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-start">
                  <Button type="button" onClick={handleConfirm}>
                    Confirm
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SelectGuildCard: FC<ModeratorCreationStageProps<string>> = (props) => {
  const ownedDiscordGuildsQuery = useOwnedDiscordGuildsQuery();
  console.log(ownedDiscordGuildsQuery.data);

  return (
    <>
      <h4 className="mb-3 font-semibold">Select Server</h4>
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-wrap items-start justify-start gap-3">
          {ownedDiscordGuildsQuery.isLoading ? (
            <>
              <Skeleton className="h-30 w-30" />
              <Skeleton className="h-30 w-30" />
              <Skeleton className="h-30 w-30" />
            </>
          ) : (
            ownedDiscordGuildsQuery.data?.map((g, idx) => (
              <Card
                key={idx}
                onClick={() => {
                  console.log(g);
                  props.onNext(g.id);
                }}
                className="flex h-30 w-30 cursor-pointer flex-col items-center justify-between gap-0 py-3 duration-100 ease-in hover:-translate-y-1 hover:scale-101 hover:border-white"
              >
                <CardContent className="flex w-full items-center justify-center">
                  <div className="bg-secondary/20 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
                    {g.icon ? (
                      <img
                        src={g.icon}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="bg-secondary h-full w-full"></div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex w-full justify-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="max-w-[6rem] truncate text-center text-xs font-semibold">
                        {g.name}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={5} className="max-w-[10rem]">
                      <TooltipArrow className="fill-background" />

                      <span className="bg-background block truncate rounded-md p-1 text-sm">
                        {g.name}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
};

const SelectPlatformCard: FC<ModeratorCreationStageProps<MessagePlatform>> = (
  props,
) => {
  const borderCols = {
    [MessagePlatform.discord]: "hover:border-purple-400",
  };

  return (
    <>
      <h4 className="mb-3 font-semibold">Select Platform</h4>
      {Object.values(MessagePlatform).map((v) => (
        <Card
          key={v}
          onClick={() => props.onNext(v)}
          className={cn(
            "relative h-30 w-30 cursor-pointer border duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-101",
            borderCols[v],
          )}
        >
          <CardContent className="flex items-center justify-center">
            <MessagePlatformImg platform={v} className="" />
          </CardContent>
        </Card>
      ))}
    </>
  );
};

const CreateModeratorPage: FC = () => {
  const navigate = useNavigate();

  const [curStage, setCurStage] = useState(1);
  const [maxStages] = useState(8);
  const [guidelines, setGuidelines] = useState<string>("");
  const [moderatorPlatform, setModeratorPlatform] = useState<
    MessagePlatform | undefined
  >(undefined);
  const [discordConfig, setDiscordConfig] = useState<any>({});

  const createModeratorMutation = useCreateModeratorMutation();

  const handleCreateModerator = async (name: string) => {
    if (!guidelines || !moderatorPlatform) return;

    const payload: ModeratorCreate = {
      name,
      platform: moderatorPlatform,
      platform_server_id: discordConfig.guild_id,
      conf: {
        ...discordConfig,
        guidelines,
      } as DiscordConfigBody,
    };

    createModeratorMutation
      .mutateAsync(payload)
      .then((response) => {
        const moderatorId = response.moderator_id;
        navigate(`/moderators/${moderatorId}`);
      })
      .catch((err) => {
        console.error(err);
        toast(
          `Failed to create moderator: ${err.error?.error ?? "Unknown error"}`,
        );
      });
  };

  return (
    <>
      <CustomToaster position="top-center" />
      <DashboardLayout>
        <div className="mb-3">
          <div className="mb-3 flex w-full items-center justify-start gap-2">
            <div className="flex items-center justify-start">
              <ArrowLeft
                size={25}
                onClick={
                  curStage > 1
                    ? () => setCurStage((prev) => prev - 1)
                    : () => navigate(`/moderators`)
                }
                className="text-muted-foreground cursor-pointer"
              />
            </div>
            <h4 className="font-semibold">Create Moderator</h4>
          </div>

          <div className="flex h-1 w-full gap-3">
            {(() => {
              const els = [];
              for (let i = 0; i < maxStages; i++) {
                els.push(
                  <div
                    key={i}
                    className={cn(
                      "h-full rounded-md",
                      curStage >= i + 1
                        ? "bg-blue-500 shadow-xs shadow-blue-700"
                        : "bg-neutral-500 shadow-xs shadow-neutral-700",
                    )}
                    style={{ width: `calc(100% / ${maxStages})` }}
                  ></div>,
                );
              }
              return els;
            })()}
          </div>
        </div>

        <div className="mb-3">
          <div className="">
            {curStage === 1 && (
              <EnterGuidelinesCard
                onNext={(arg: string) => {
                  setGuidelines(arg);
                  setCurStage((prev) => prev + 1);
                }}
              />
            )}

            {curStage === 2 && (
              <SelectPlatformCard
                onNext={(arg: MessagePlatform) => {
                  setModeratorPlatform(arg);
                  setCurStage((prev) => prev + 1);
                }}
              />
            )}

            {curStage === 3 && (
              <SelectGuildCard
                onNext={(arg: string) => {
                  setDiscordConfig((prev: DiscordConfigBody) => ({
                    ...(prev ?? {}),
                    guild_id: arg,
                  }));
                  setCurStage((prev) => prev + 1);
                }}
              />
            )}

            {curStage === 4 && (
              <SetGuildSummaryCard
                onNext={(arg: string) => {
                  setDiscordConfig((prev: DiscordConfigBody) => ({
                    ...prev,
                    guild_summary: arg,
                  }));
                  setCurStage((prev) => prev + 1);
                }}
              />
            )}

            {curStage === 5 && (discordConfig ?? {}).guild_id && (
              <SelectChannelsCard
                onNext={(arg: string[]) => {
                  setDiscordConfig((prev: DiscordConfigBody) => ({
                    ...prev,
                    channel_ids: arg,
                  }));
                  setCurStage((prev) => prev + 1);
                }}
                guildId={discordConfig.guild_id}
              />
            )}

            {curStage === 6 && (
              <SelectActionsCard
                onNext={(arg: DiscordAction[]) => {
                  setDiscordConfig((prev: DiscordConfigBody) => ({
                    ...prev,
                    actions: arg,
                  }));
                  setCurStage((prev) => prev + 1);
                }}
              />
            )}

            {curStage === 7 && (
              <EnterInstructionsCard
                onNext={(arg: string | null) => {
                  setDiscordConfig((prev: DiscordConfigBody) => ({
                    ...prev,
                    instructions: arg,
                  }));
                  setCurStage((prev) => prev + 1);
                }}
              />
            )}

            {curStage === 8 && (
              <SetModeratorNameCard
                onNext={(arg: string) => {
                  handleCreateModerator(arg);
                }}
              />
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};
export default CreateModeratorPage;
