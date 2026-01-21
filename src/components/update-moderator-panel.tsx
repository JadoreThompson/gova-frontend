import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUpdateModeratorMutation } from "@/hooks/queries/moderator-hooks";
import type { ModeratorResponse } from "@/openapi";
import type { DiscordAction, DiscordConfigBody } from "@/types/discord";
import type { ModeratorUpdateWithConfig } from "@/types/moderator";
import { Loader2, X } from "lucide-react";
import {
  useEffect,
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";
import { toast } from "sonner";

interface UpdateModeratorPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moderator: ModeratorResponse;
}

interface ConfigFieldProps<T> {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
}

type ActionsState = {
  allowAll: boolean;
  allowedActions: {
    [key: string]: {
      requires_approval: boolean;
      params: { [key: string]: string | number };
      enabled: boolean;
    };
  };
};

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

const getInitialActionsState = (): ActionsState => ({
  allowAll: false,
  allowedActions: AVAILABLE_ACTIONS.reduce(
    (acc, action) => {
      acc[action.type] = {
        requires_approval: action.defaultRequiresApproval,
        params: {},
        enabled: false,
      };
      return acc;
    },
    {} as ActionsState["allowedActions"],
  ),
});

const actionsToState = (actions: DiscordAction[]): ActionsState => {
  const state = getInitialActionsState();
  for (const action of actions) {
    if (state.allowedActions[action.type]) {
      state.allowedActions[action.type].enabled = true;
      state.allowedActions[action.type].requires_approval =
        action.requires_approval;
      if (action.type === "timeout" && action.default_params?.duration) {
        state.allowedActions[action.type].params.duration =
          action.default_params.duration;
      }
    }
  }
  return state;
};

const stateToActions = (state: ActionsState): DiscordAction[] => {
  if (state.allowAll) {
    return AVAILABLE_ACTIONS.map((action) => {
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
  }

  return AVAILABLE_ACTIONS.filter(
    (action) => state.allowedActions[action.type].enabled,
  ).map((action) => {
    const config = state.allowedActions[action.type];

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
          duration: duration && typeof duration === "number" ? duration : null,
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
};

const NameField: FC<ConfigFieldProps<string>> = (props) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Moderator Name</label>
      <Input
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        placeholder="Enter moderator name"
      />
    </div>
  );
};

const GuidelinesField: FC<ConfigFieldProps<string>> = (props) => {
  return (
    <div className="space-y-2">
      <textarea
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        placeholder="Enter moderation guidelines..."
        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[120px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      />
    </div>
  );
};

const GuildSummaryField: FC<ConfigFieldProps<string>> = (props) => {
  return (
    <div className="space-y-2">
      <textarea
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        placeholder="Provide a brief summary of your guild/server..."
        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      />
    </div>
  );
};

const InstructionsField: FC<ConfigFieldProps<string>> = (props) => {
  return (
    <div className="space-y-2">
      <textarea
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        placeholder="Enter custom instructions for the moderator agent (optional)..."
        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[120px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      />
    </div>
  );
};

const ActionsField: FC<ConfigFieldProps<ActionsState>> = (props) => {
  const { allowAll, allowedActions } = props.value;

  const handleToggleAction = (actionType: string, checked: boolean) => {
    props.setValue((prev) => ({
      ...prev,
      allowAll: false,
      allowedActions: {
        ...prev.allowedActions,
        [actionType]: {
          ...prev.allowedActions[actionType],
          enabled: checked,
        },
      },
    }));
  };

  const handleToggleRequiresApproval = (
    actionType: string,
    checked: boolean,
  ) => {
    props.setValue((prev) => ({
      ...prev,
      allowedActions: {
        ...prev.allowedActions,
        [actionType]: {
          ...prev.allowedActions[actionType],
          requires_approval: checked,
        },
      },
    }));
  };

  const handleParamChange = (
    actionType: string,
    paramName: string,
    paramValue: string,
  ) => {
    props.setValue((prev) => ({
      ...prev,
      allowedActions: {
        ...prev.allowedActions,
        [actionType]: {
          ...prev.allowedActions[actionType],
          params: {
            ...prev.allowedActions[actionType].params,
            [paramName]: paramValue,
          },
        },
      },
    }));
  };

  const handleAllowAllClick = () => {
    props.setValue((prev) => ({
      ...prev,
      allowAll: !prev.allowAll,
    }));
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium">Action Configuration</span>
        <Button
          variant="outline"
          size="sm"
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
                  onClick={(e) => e.stopPropagation()}
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
                {action.fields.map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={`update-${action.type}-${field.name}`}
                      className="text-sm font-medium"
                    >
                      {field.label
                        ? field.label
                        : field.name.charAt(0).toUpperCase() +
                          field.name.slice(1).replace(/_/g, " ") +
                          " (Optional)"}
                    </label>
                    <Input
                      id={`update-${action.type}-${field.name}`}
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

                <div className="flex w-full items-center justify-start gap-2 pt-2">
                  <Input
                    type="checkbox"
                    id={`update-${action.type}-requires_approval`}
                    className="h-4 w-fit"
                    checked={allowedActions[action.type].requires_approval}
                    onChange={(e) =>
                      handleToggleRequiresApproval(
                        action.type,
                        e.target.checked,
                      )
                    }
                    disabled={!allowedActions[action.type].enabled || allowAll}
                  />
                  <label
                    htmlFor={`update-${action.type}-requires_approval`}
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
  );
};

const UpdateModeratorPanel: FC<UpdateModeratorPanelProps> = (props) => {
  const config = props.moderator.conf as DiscordConfigBody | undefined;

  const [name, setName] = useState(props.moderator.name);
  const [guidelines, setGuidelines] = useState(config?.guidelines ?? "");
  const [guildSummary, setGuildSummary] = useState(config?.guild_summary ?? "");
  const [instructions, setInstructions] = useState(config?.instructions ?? "");
  const [actionsState, setActionsState] = useState<ActionsState>(
    config?.actions ? actionsToState(config.actions) : getInitialActionsState(),
  );

  const updateModeratorMutation = useUpdateModeratorMutation();

  useEffect(() => {
    if (props.open) {
      const conf = props.moderator.conf as DiscordConfigBody | undefined;
      setName(props.moderator.name);
      setGuidelines(conf?.guidelines ?? "");
      setGuildSummary(conf?.guild_summary ?? "");
      setInstructions(conf?.instructions ?? "");
      setActionsState(
        conf?.actions ? actionsToState(conf.actions) : getInitialActionsState(),
      );
    }
  }, [props.open, props.moderator]);

  const handleSubmit = () => {
    const updatedConfig: DiscordConfigBody = {
      guild_id: config?.guild_id ?? "",
      channel_ids: config?.channel_ids ?? [],
      guild_summary: guildSummary,
      guidelines,
      actions: stateToActions(actionsState),
      instructions: instructions.trim() || null,
    };

    const payload: ModeratorUpdateWithConfig<DiscordConfigBody> = {
      name,
      conf: updatedConfig,
    };

    updateModeratorMutation.mutate(
      {
        moderatorId: props.moderator.moderator_id,
        data: payload,
      },
      {
        onSuccess: () => {
          toast.success("Moderator updated successfully");
          props.onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(
            `Failed to update moderator: ${error?.error?.error ?? "Unknown error"}`,
          );
        },
      },
    );
  };

  const hasValidActions =
    actionsState.allowAll ||
    Object.values(actionsState.allowedActions).some((a) => a.enabled);
  const isValid =
    name.trim().length > 0 && guidelines.trim().length >= 10 && hasValidActions;

  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="!text-3xl font-semibold">
              Update Moderator
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
          <SheetDescription>
            Update your moderator's configuration. All fields will be saved
            together.
          </SheetDescription>
        </SheetHeader>

        <div className="scrollbar-hide flex-1 overflow-y-auto">
          <div className="space-y-2 py-4">
            <div className="mb-4 px-4">
              <NameField value={name} setValue={setName} />
            </div>

            <Accordion type="multiple" className="w-full">
              <AccordionItem value="guidelines">
                <AccordionTrigger className="px-4 hover:no-underline">
                  Guidelines
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-4">
                  <GuidelinesField
                    value={guidelines}
                    setValue={setGuidelines}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="guild-summary">
                <AccordionTrigger className="px-4 hover:no-underline">
                  Guild Summary
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-4">
                  <GuildSummaryField
                    value={guildSummary}
                    setValue={setGuildSummary}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="instructions">
                <AccordionTrigger className="px-4 hover:no-underline">
                  Custom Instructions
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-4">
                  <InstructionsField
                    value={instructions}
                    setValue={setInstructions}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="actions">
                <AccordionTrigger className="px-4 hover:no-underline">
                  Actions
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-4">
                  <ActionsField
                    value={actionsState}
                    setValue={setActionsState}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <SheetFooter className="border-t pt-4">
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              onClick={() => props.onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid || updateModeratorMutation.isPending}
              className="flex-1"
            >
              {updateModeratorMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateModeratorPanel;
