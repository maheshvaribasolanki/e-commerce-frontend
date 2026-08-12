import AdminSettingsBannersTable from "@/components/admin/settings/admin-settings-banner-table";
import BannerDialog from "@/components/admin/settings/banner-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAdminSettings } from "@/features/admin/settings/use-admin-settings";
import { ImagePlus, Search, Sparkles } from "lucide-react";

const pageWrapClass = "min-h-screen bg-background";
const contentContainerClass = "mx-auto max-w-7xl px-4 py-8";
const uploadPanelClass = "grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]";

const cardClass = "border-border/60 bg-card/80";
const cardTitleClass = "text-2xl font-semibold text-foreground";
const cardContentClass = "space-y-6";

const uploadBoxClass =
  "flex min-h-[220px] flex-col items-center justify-center gap-4 border border-dashed border-border bg-background/40 p-6 text-center";
const uploadIconWrapClass =
  "flex h-14 w-14 items-center justify-center border border-border bg-secondary/50";
const uploadIconClass = "h-6 w-6 text-primary";
const uploadTextWrapClass = "space-y-2";
const uploadHeadingClass = "text-base font-medium text-foreground";
const fileInputClass = "rounded-none";
const fileCountClass = "text-xs text-muted-foreground";
const fullButtonClass = "w-full rounded-none";
const buttonClass = "rounded-none";

const emptyStateClass =
  "border border-border bg-background/40 p-6 text-sm text-muted-foreground";
const tableHeaderClass = "flex flex-row items-center justify-between gap-3";

function AdminSettings() {
  const {
    search,
    setSearch,
    items,
    files,
    setFiles,
    fileCountLabel,
    loading,
    saving,
    uploading,
    bannerDialogOpen,
    setBannerDialogOpen,
    editingBanner,
    openEditDialog,
    closeBannerDialog,
    refreshBanners,
    handleUpload,
    autoFillSampleBanner,
    saveBanner,
    removeBanner,
    deletingId,
  } = useAdminSettings();

  return (
    <div className={pageWrapClass}>
      <div className={contentContainerClass}>
        <div className={uploadPanelClass}>
          {/* Left Panel: Banner Settings & Upload */}
          <Card className={cardClass}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className={cardTitleClass}>Banner Settings</CardTitle>
            </CardHeader>

            <CardContent className={cardContentClass}>
              <div className={uploadBoxClass}>
                <div className={uploadIconWrapClass}>
                  <ImagePlus className={uploadIconClass} />
                </div>

                <div className={uploadTextWrapClass}>
                  <p className={uploadHeadingClass}>Upload Homepage Banners</p>
                </div>

                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  className={fileInputClass}
                  onChange={(event) =>
                    setFiles(Array.from(event.target.files || []))
                  }
                />

                <p className={fileCountClass}>{fileCountLabel}</p>

                <Button
                  className={fullButtonClass}
                  disabled={uploading}
                  onClick={() => handleUpload()}
                >
                  {uploading ? "Uploading..." : "Upload Banners"}
                </Button>
              </div>

              <div className="pt-2 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 border-primary/40 bg-primary/5 text-primary hover:bg-primary/15 rounded-none"
                  onClick={autoFillSampleBanner}
                  disabled={uploading}
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  Auto-Fill Sample Banner
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Panel: Current Homepage Banners */}
          <Card className={cardClass}>
            <CardHeader className={tableHeaderClass}>
              <CardTitle className={cardTitleClass}>
                Current Homepage Banners
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative w-48 sm:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Banners"
                    className="rounded-none pl-9 h-9 text-sm"
                  />
                </div>
                <Button className={buttonClass} onClick={() => refreshBanners()}>
                  Refresh
                </Button>
              </div>
            </CardHeader>

            <CardContent className={cardContentClass}>
              {loading ? null : !items.length ? (
                <div className={emptyStateClass}>No banners uploaded yet !</div>
              ) : (
                <AdminSettingsBannersTable
                  items={items}
                  loading={loading}
                  onEdit={openEditDialog}
                  onDelete={removeBanner}
                  deletingId={deletingId}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <BannerDialog
        open={bannerDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeBannerDialog();
            return;
          }
          setBannerDialogOpen(true);
        }}
        banner={editingBanner}
        saving={saving}
        onSaved={saveBanner}
      />
    </div>
  );
}

export default AdminSettings;



