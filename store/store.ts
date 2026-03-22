import { create } from "zustand";

type UploadStatus = "uploading" | "completed" | "error";

interface UploadState {
  uploads: Record<
    string,
    {
      progress: number;
      status: UploadStatus;
    }
  >;

  setProgress: (videoId: string, progress: number) => void;
  markCompleted: (videoId: string) => void;
  markError: (videoId: string) => void;
  clearUpload: (videoId: string) => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  uploads: {},

  setProgress: (videoId, progress) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [videoId]: {
          ...(state.uploads[videoId] || { status: "uploading" }),
          progress,
          status: "uploading",
        },
      },
    })),

  markCompleted: (videoId) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [videoId]: {
          ...(state.uploads[videoId] || {}),
          progress: 100,
          status: "completed",
        },
      },
    })),

  markError: (videoId) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [videoId]: {
          ...(state.uploads[videoId] || {}),
          status: "error",
        },
      },
    })),

  clearUpload: (videoId) =>
    set((state) => {
      const updated = { ...state.uploads };
      delete updated[videoId];
      return { uploads: updated };
    }),
}));