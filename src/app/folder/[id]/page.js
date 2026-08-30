"use client";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { DriveView } from "@/app/page";

export default function FolderPage() {
  const { id } = useParams();
  return (
    <ProtectedRoute>
      <DriveView folderId={id} />
    </ProtectedRoute>
  );
}