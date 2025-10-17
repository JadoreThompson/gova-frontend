import DashboardLayout from "@/components/layouts/dashboard-layout";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import dayjs from 'dayjs';
import { useState, type FC } from "react";

interface GuidelineResponse {
  guideline_id: string;
  name: string;
  text: string;
  created_at: string;
  topics: string[];
}

const MOCK_GUIDELINES: GuidelineResponse[] = [
  {
    guideline_id: "1",
    name: "Community Standards",
    text: "Ensure proper behavior across all channels.",
    created_at: "2025-09-21T14:22:00Z",
    topics: ["Language", "Harassment", "Inclusivity", "Moderation"],
  },
  {
    guideline_id: "2",
    name: "Posting Rules",
    text: "Rules around content posting.",
    created_at: "2025-09-15T11:12:00Z",
    topics: ["Spam", "NSFW", "Reposts"],
  },
  {
    guideline_id: "3",
    name: "Admin Operations",
    text: "Internal operations and escalation policies.",
    created_at: "2025-08-30T09:45:00Z",
    topics: ["Escalation", "Reporting", "Audit Logs", "Permissions"],
  },
];

const BADGE_COLORS = [
  "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
  "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300",
  "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300",
  "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300",
  "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300",
  "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300",
];
const randomBadgeClass = () =>
  BADGE_COLORS[Math.floor(Math.random() * BADGE_COLORS.length)];

const GuidelinesPage: FC = () => {
  const [selectedGuideline, setSelectedGuideline] =
    useState<GuidelineResponse | null>(null);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-semibold">Guidelines</h4>
      </div>

      <div className="rounded-md border bg-transparent shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-neutral-800">
            <TableRow>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                Name
              </TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                Created At
              </TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                Topics
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_GUIDELINES.map((g) => (
              <TableRow
                key={g.guideline_id}
                onClick={() => setSelectedGuideline(g)}
                className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40"
              >
                <TableCell className="font-medium">{g.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {dayjs(g.created_at).format("yyyy-MM-dd HH:mm")}
                </TableCell>
                <TableCell className="flex flex-wrap gap-1 py-3">
                  {g.topics.slice(0, 3).map((topic) => (
                    <span
                      key={topic}
                      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${randomBadgeClass()}`}
                    >
                      {topic}
                    </span>
                  ))}
                  {g.topics.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{g.topics.length - 3} more
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Slide-over (Sheet) for topic details */}
      <Sheet open={!!selectedGuideline} onOpenChange={() => setSelectedGuideline(null)}>
        <SheetContent side="right" className="w-[400px] sm:w-[480px]">
          {selectedGuideline && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedGuideline.name}</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedGuideline.topics.map((topic) => (
                    <span
                      key={topic}
                      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${randomBadgeClass()}`}
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <h4 className="mt-6 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Description
                </h4>
                <p className="text-sm leading-relaxed text-foreground">
                  {selectedGuideline.text}
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default GuidelinesPage;
