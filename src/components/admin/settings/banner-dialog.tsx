import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminBanner } from "@/features/admin/settings/types";
import { ImagePlus, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const dialogContentClass =
  "max-h-[92vh] overflow-y-auto border-border bg-background sm:max-w-xl";

const layoutClass = "grid gap-6";

const fieldWrapClass = "space-y-2";

const inputClass = "rounded-none";

const previewBoxClass =
  "relative flex min-h-[180px] w-full items-center justify-center overflow-hidden border border-dashed border-border bg-muted/40 p-2 rounded-lg";

const previewImageClass = "h-44 w-full rounded-md object-cover";

const emptyPreviewClass =
  "flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground";

const footerClass = "flex justify-end gap-3";

const outlineButtonClass = "rounded-none";

const primaryButtonClass = "rounded-none";

type BannerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: AdminBanner | null;
  saving: boolean;
  onSaved: (data: FormData | { imageUrl: string }) => Promise<void>;
};

const SAMPLE_BANNERS = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&auto=format&fit=crop&q=80",
];

export function BannerDialog({
  open,
  onOpenChange,
  banner,
  saving,
  onSaved,
}: BannerDialogProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const isEditMode = !!banner;

  useEffect(() => {
    if (!open) {
      setImageUrl("");
      setFiles([]);
      return;
    }

    if (banner) {
      setImageUrl(banner.imageUrl);
      setFiles([]);
      return;
    }

    setImageUrl("");
    setFiles([]);
  }, [open, banner]);

  function autoFillSampleData() {
    const randomSample =
      SAMPLE_BANNERS[Math.floor(Math.random() * SAMPLE_BANNERS.length)];
    setImageUrl(randomSample);
    setFiles([]);
    toast.success("Form auto-filled with sample banner image!");
  }

  const previewSrc = files.length
    ? URL.createObjectURL(files[0])
    : imageUrl.trim();

  async function submit() {
    if (!files.length && !imageUrl.trim()) {
      toast.error("Please select an image file or enter an image URL");
      return;
    }

    try {
      if (files.length) {
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));
        await onSaved(formData);
      } else {
        await onSaved({ imageUrl: imageUrl.trim() });
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to save banner");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader className="flex flex-row items-center justify-between pr-8">
          <DialogTitle>{isEditMode ? "Edit Banner" : "Add Banner"}</DialogTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={autoFillSampleData}
            className="gap-2 border-primary/40 bg-primary/5 text-primary hover:bg-primary/15"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            Auto-Fill Sample Data
          </Button>
        </DialogHeader>

        <div className={layoutClass}>
          <div className={fieldWrapClass}>
            <Label>Upload Image File</Label>
            <Input
              type="file"
              accept="image/*"
              className={inputClass}
              onChange={(e) => {
                const selected = Array.from(e.target.files || []);
                if (selected.length) {
                  setFiles(selected);
                }
              }}
            />
          </div>

          <div className={fieldWrapClass}>
            <Label>Or Image URL</Label>
            <Input
              type="url"
              className={inputClass}
              value={imageUrl}
              placeholder="https://images.unsplash.com/..."
              onChange={(e) => {
                setImageUrl(e.target.value);
                if (files.length) setFiles([]);
              }}
            />
          </div>

          <div className={fieldWrapClass}>
            <Label>Preview</Label>
            <div className={previewBoxClass}>
              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt="Banner preview"
                  className={previewImageClass}
                />
              ) : (
                <div className={emptyPreviewClass}>
                  <ImagePlus className="h-8 w-8 opacity-40" />
                  <p>Select an image file or enter a URL to see preview</p>
                </div>
              )}
            </div>
          </div>

          <div className={footerClass}>
            <Button
              className={outlineButtonClass}
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={submit}
              disabled={saving}
              className={primaryButtonClass}
            >
              {saving
                ? "Saving..."
                : isEditMode
                  ? "Update Banner"
                  : "Create Banner"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BannerDialog;
