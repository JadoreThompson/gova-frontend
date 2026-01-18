import DeploymentStatusCircle from "@/components/deployment-status-circle";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import PaginationControls from "@/components/pagination-controls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebouncedInput } from "@/hooks/debounced-input";
import { useModeratorsQuery } from "@/hooks/queries/moderator-hooks";
import { formatDate } from "@/lib/utils/utils";
import dayjs from "dayjs";
import { ArrowDown, ArrowUp, Minus, Search } from "lucide-react";
import { useState, type FC } from "react";
import { Link, useNavigate } from "react-router";

const ModeratorsPage: FC = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const debouncedInput = useDebouncedInput({
    delay: 2000,
    callback: (e) => {
      setPage(1);
      setName(e.target.value);
    },
  });
  const moderatorsQuery = useModeratorsQuery({
    skip: (page - 1) * 10,
    limit: 10,
    ...(name && { name }),
  });

  const toggleSort = () => {
    setSortOrder((prev) =>
      prev === null ? "asc" : prev === "asc" ? "desc" : null,
    );
  };

  const sortedModerators = (() => {
    const mods = moderatorsQuery.data?.data ?? [];
    if (sortOrder === "asc") {
      return [...mods].sort(
        (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
      );
    }
    if (sortOrder === "desc") {
      return [...mods].sort(
        (a, b) => dayjs(b.created_at).unix() - dayjs(a.created_at).unix(),
      );
    }
    return mods;
  })();

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-semibold">Moderators</h4>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="bg-secondary flex h-fit w-fit items-center rounded-md border p-1">
          <Search size={20} />
          <Input
            type="text"
            placeholder="Search..."
            onChange={debouncedInput.handleChange}
            className="h-7 w-50 border-none !bg-transparent focus:!ring-0"
          />
        </div>
        <Link to="/moderators/create">
          <Button variant="outline">Create Moderator</Button>
        </Link>
      </div>

      <div className="border bg-transparent shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-neutral-800">
            <TableRow>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                Name
              </TableHead>
              <TableHead
                onClick={toggleSort}
                className="flex cursor-pointer items-center gap-1 font-bold text-gray-700 select-none dark:text-gray-200"
              >
                Created At
                {sortOrder === "asc" && <ArrowUp size={14} />}
                {sortOrder === "desc" && <ArrowDown size={14} />}
                {sortOrder === null && <Minus size={14} />}
              </TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-200">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!sortedModerators.length ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <div className="text-muted-foreground flex h-20 w-full items-center justify-center">
                    No moderators found
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedModerators.map((mod) => (
                <TableRow
                  key={mod.moderator_id}
                  onClick={() => navigate(`/moderators/${mod.moderator_id}`)}
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40"
                >
                  <TableCell className="font-medium">{mod.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(mod.created_at)}
                  </TableCell>
                  <TableCell>
                    <DeploymentStatusCircle status={mod.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationControls
        page={page}
        hasNextPage={moderatorsQuery.data?.has_next ?? false}
        onNextPage={() => setPage((p) => p + 1)}
        onPrevPage={() => setPage((p) => p - 1)}
      />
    </DashboardLayout>
  );
};

export default ModeratorsPage;
