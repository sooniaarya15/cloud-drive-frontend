import { FileText, FileImage, FileSpreadsheet, FileArchive, File } from "lucide-react";
import { fileIconType } from "@/utils/format";

const ICON_MAP = {
  image: { Icon: FileImage, color: "text-purple-500" },
  pdf: { Icon: FileText, color: "text-red-500" },
  text: { Icon: FileText, color: "text-gray-500" },
  doc: { Icon: FileText, color: "text-blue-500" },
  sheet: { Icon: FileSpreadsheet, color: "text-green-600" },
  zip: { Icon: FileArchive, color: "text-yellow-600" },
  file: { Icon: File, color: "text-gray-400" },
};

export default function FileIcon({ mimeType, size = 36 }) {
  const { Icon, color } = ICON_MAP[fileIconType(mimeType)];
  return <Icon size={size} className={color} />;
}