import { FolderOpen, File, Image, FileText, Film, Music, ChevronLeft } from "lucide-react";

const folders = [
  { name: "اسناد", icon: FileText, count: 24, color: "text-blue-400" },
  { name: "تصاویر", icon: Image, count: 156, color: "text-green-400" },
  { name: "ویدیو", icon: Film, count: 12, color: "text-purple-400" },
  { name: "موسیقی", icon: Music, count: 89, color: "text-orange-400" },
  { name: "دانلودها", icon: FolderOpen, count: 43, color: "text-yellow-400" },
];

const recentFiles = [
  { name: "گزارش-ماهانه.pdf", size: "۲.۴ مگابایت", date: "۱۴۰۵/۰۳/۰۵" },
  { name: "قرارداد-v2.docx", size: "۱.۱ مگابایت", date: "۱۴۰۵/۰۳/۰۴" },
  { name: "presentation.pptx", size: "۸.۷ مگابایت", date: "۱۴۰۵/۰۳/۰۳" },
  { name: "data-export.csv", size: "۴۵۶ کیلوبایت", date: "۱۴۰۵/۰۳/۰۲" },
];

export default function FileManager() {
  return (
    <div className="p-6 h-full overflow-auto" dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <FolderOpen className="w-6 h-6 text-desktop-accent" />
        <h2 className="text-xl font-bold">مدیریت فایل</h2>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-desktop-text-muted mb-4">
        <span className="hover:text-desktop-text cursor-pointer">خانه</span>
        <ChevronLeft className="w-3 h-3" />
        <span className="text-desktop-text">اسناد</span>
      </div>

      {/* Folders */}
      <h3 className="text-sm font-medium text-desktop-text-muted mb-3">پوشه‌ها</h3>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {folders.map((folder) => (
          <div
            key={folder.name}
            className="bg-desktop-surface border border-desktop-border rounded-xl p-4 hover:border-desktop-accent/50 cursor-pointer transition-colors"
          >
            <folder.icon className={`w-8 h-8 ${folder.color} mb-2`} />
            <p className="font-medium text-sm">{folder.name}</p>
            <p className="text-xs text-desktop-text-muted">{folder.count} فایل</p>
          </div>
        ))}
      </div>

      {/* Recent files */}
      <h3 className="text-sm font-medium text-desktop-text-muted mb-3">فایل‌های اخیر</h3>
      <div className="space-y-2">
        {recentFiles.map((file) => (
          <div
            key={file.name}
            className="flex items-center gap-3 bg-desktop-surface border border-desktop-border rounded-lg p-3 hover:border-desktop-accent/50 cursor-pointer transition-colors"
          >
            <File className="w-5 h-5 text-desktop-accent" />
            <div className="flex-1">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-desktop-text-muted">{file.size}</p>
            </div>
            <span className="text-xs text-desktop-text-muted">{file.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
