import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import type { AdminBannersResponse } from "./types";

export async function getAdminBanners() {
  return apiGet<AdminBannersResponse>("/admin/settings/banners");
}

export async function uploadAdminBanners(formData: FormData) {
  return apiPost<AdminBannersResponse, FormData>(
    "/admin/settings/banners",
    formData,
  );
}

export async function createSampleAdminBanner(imageUrl: string) {
  return apiPost<AdminBannersResponse, { imageUrl: string }>(
    "/admin/settings/banners",
    { imageUrl },
  );
}

export async function updateAdminBanner(
  bannerId: string,
  payload: FormData | { imageUrl: string },
) {
  if (payload instanceof FormData) {
    return apiPut<AdminBannersResponse, FormData>(
      `/admin/settings/banners/${bannerId}`,
      payload,
    );
  }

  return apiPut<AdminBannersResponse, { imageUrl: string }>(
    `/admin/settings/banners/${bannerId}`,
    payload,
  );
}

export async function deleteAdminBanner(bannerId: string) {
  return apiDelete<AdminBannersResponse>(`/admin/settings/banners/${bannerId}`);
}


