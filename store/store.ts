import { create } from "zustand"

type UploadStatus = "uploading" | "success" | "error"

interface UploadEntry {
  file: File
  progress: number
  status: UploadStatus
  error?: string
}

interface UploadStore {
  uploads: Record<string, UploadEntry>
  setUpload: (videoId: string, entry: UploadEntry) => void
  updateProgress: (videoId: string, percent: number) => void
  markSuccess: (videoId: string) => void
  markError: (videoId: string, errorMsg: string) => void
  removeUpload: (videoId: string) => void
}

export const useUploadStore = create<UploadStore>((set) => ({
  uploads: {},

  setUpload: (videoId, entry) =>
    set((state) => ({
      uploads: { ...state.uploads, [videoId]: entry },
    })),

  updateProgress: (videoId, percent) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [videoId]: { ...state.uploads[videoId], progress: percent },
      },
    })),

  markSuccess: (videoId) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [videoId]: { ...state.uploads[videoId], status: "success", progress: 100 },
      },
    })),

  markError: (videoId, errorMsg) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [videoId]: { ...state.uploads[videoId], status: "error", error: errorMsg },
      },
    })),

  removeUpload: (videoId) =>
    set((state) => {
      const newUploads = { ...state.uploads }
      delete newUploads[videoId]
      return { uploads: newUploads }
    }),
}))