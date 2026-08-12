import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminBanner } from "@/features/admin/settings/types";
import { Edit2, Trash2 } from "lucide-react";

const tableWrapClass = "overflow-x-auto";
const previewWrapClass =
  "h-16 w-28 overflow-hidden rounded-xl border border-border bg-muted";
const imageClass = "h-full w-full object-cover";
const publicIdTextClass =
  "max-w-[360px] truncate text-sm text-muted-foreground font-mono";

function formatDateTime(value: string) {
  return new Date(value).toLocaleDateString();
}

type AdminSettingsBannersTableProps = {
  items: AdminBanner[];
  loading?: boolean;
  onEdit?: (banner: AdminBanner) => void;
  onDelete?: (bannerId: string) => Promise<void>;
  deletingId?: string | null;
};

function AdminSettingsBannersTable({
  items,
  onEdit,
  onDelete,
  deletingId,
}: AdminSettingsBannersTableProps) {
  return (
    <div className={tableWrapClass}>
      <Table>
        <TableHeader>
          <TableHead>Preview</TableHead>
          <TableHead>Public ID</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableHeader>

        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <div className={previewWrapClass}>
                  <img
                    src={item.imageUrl}
                    alt="banner"
                    className={imageClass}
                  />
                </div>
              </TableCell>

              <TableCell>
                <p className={publicIdTextClass}>{item.imagePublicId}</p>
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground">{formatDateTime(item.createdAt)}</p>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => onEdit(item)}
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      disabled={deletingId === item._id}
                      onClick={() => void onDelete(item._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminSettingsBannersTable;
