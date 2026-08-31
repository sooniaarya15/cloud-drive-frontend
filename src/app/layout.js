import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import QueryProvider from "@/components/QueryProvider";
import UploadModal from "@/components/UploadModal";
import PreviewModal from "@/components/PreviewModal";
import ToastContainer from "@/components/Toast";

export const metadata = {
  title: "CloudDrive — Your files, everywhere",
  description: "A cloud file storage and sharing app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <QueryProvider>
          <AuthProvider>
            {children}
            <UploadModal />
            <PreviewModal />
            <ToastContainer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}