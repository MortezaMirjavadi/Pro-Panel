import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import type { GridApi, GridReadyEvent } from "ag-grid-community";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  colorSchemeDark,
  colorSchemeLight,
} from "ag-grid-community";
import { useWindowStore } from "../store";
import { getThemeById } from "../lib/themes";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// ── Map our theme colors to AG Grid CSS variables ──
function getGridCssVars(themeId: string): React.CSSProperties {
  const theme = getThemeById(themeId);
  const c = theme.colors;
  const isDark = !["arctic"].includes(themeId);

  return {
    "--ag-background-color": c["--color-bg"],
    "--ag-foreground-color": c["--color-text"],
    "--ag-border-color": c["--color-border"],
    "--ag-header-background-color": c["--color-surface"],
    "--ag-header-foreground-color": c["--color-text"],
    "--ag-odd-row-background-color": isDark ? `${c["--color-surface"]}cc` : `${c["--color-border"]}33`,
    "--ag-row-hover-color": "transparent",
    "--ag-range-selection-border-color": c["--color-accent"],
    "--ag-range-selection-background-color": `${c["--color-accent"]}15`,
    "--ag-input-focus-border-color": c["--color-accent"],
    "--ag-font-family": "IRANSansXFaNum, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    "--ag-font-size": "13px",
    "--ag-row-height": "40px",
    "--ag-header-height": "44px",
    "--ag-grid-size": "8px",
    "--ag-icon-color": c["--color-text-muted"],
    "--ag-secondary-foreground-color": c["--color-text-muted"],
    "--ag-input-border-color": c["--color-border"],
    "--ag-input-background-color": c["--color-surface"],
    "--ag-checkbox-checked-color": c["--color-accent"],
    "--ag-alpine-active-color": c["--color-accent"],
  } as React.CSSProperties;
}

// ── Build AG Grid theme object ──
function buildGridTheme(themeId: string) {
  const isDark = !["arctic"].includes(themeId);
  const base = themeQuartz.withParams({
    fontFamily: "inherit",
    fontSize: "13px",
    wrapperBorderRadius: "8px",
    spacing: "8px",
  });
  return isDark ? base.withPart(colorSchemeDark) : base.withPart(colorSchemeLight);
}

// ── Sample data ──
interface Employee {
  id: number;
  name: string;
  department: string;
  position: string;
  salary: number;
  startDate: string;
  status: "فعال" | "غیرفعال" | "در مرخصی";
  performance: number;
}

const sampleData: Employee[] = [
  { id: 1, name: "علی محمدی", department: "فنی", position: "توسعه‌دهنده ارشد", salary: 45000000, startDate: "1401/03/15", status: "فعال", performance: 92 },
  { id: 2, name: "سارا احمدی", department: "طراحی", position: "UI/UX Designer", salary: 38000000, startDate: "1401/06/01", status: "فعال", performance: 88 },
  { id: 3, name: "رضا کریمی", department: "فنی", position: "توسعه‌دهنده Frontend", salary: 40000000, startDate: "1402/01/10", status: "فعال", performance: 85 },
  { id: 4, name: "مریم حسینی", department: "بازاریابی", position: "مدیر بازاریابی", salary: 50000000, startDate: "1400/09/20", status: "فعال", performance: 95 },
  { id: 5, name: "حسن رضایی", department: "فنی", position: "Backend Developer", salary: 42000000, startDate: "1402/04/05", status: "غیرفعال", performance: 70 },
  { id: 6, name: "نازنین عباسی", department: "مالی", position: "حسابدار", salary: 35000000, startDate: "1401/11/12", status: "فعال", performance: 90 },
  { id: 7, name: "امیر نوری", department: "فنی", position: "DevOps Engineer", salary: 48000000, startDate: "1402/02/18", status: "فعال", performance: 87 },
  { id: 8, name: "زهرا صادقی", department: "منابع انسانی", position: "مدیر HR", salary: 46000000, startDate: "1400/07/01", status: "فعال", performance: 91 },
  { id: 9, name: "محمد جعفری", department: "فنی", position: "QA Engineer", salary: 37000000, startDate: "1402/05/20", status: "در مرخصی", performance: 78 },
  { id: 10, name: "فاطمه قاسمی", department: "بازاریابی", position: "کارشناس محتوا", salary: 32000000, startDate: "1402/08/01", status: "فعال", performance: 82 },
  { id: 11, name: "امید رحیمی", department: "فنی", position: "توسعه‌دهنده موبایل", salary: 43000000, startDate: "1401/04/15", status: "فعال", performance: 89 },
  { id: 12, name: "لیلا مرادی", department: "مالی", position: "مدیر مالی", salary: 55000000, startDate: "1400/01/10", status: "فعال", performance: 96 },
  { id: 13, name: "سعید فتحی", department: "فنی", position: "Architect", salary: 60000000, startDate: "1399/06/01", status: "فعال", performance: 98 },
  { id: 14, name: "مهسا امیری", department: "طراحی", position: "Graphic Designer", salary: 34000000, startDate: "1402/03/10", status: "فعال", performance: 84 },
  { id: 15, name: "پدرام شریفی", department: "فنی", position: "Data Engineer", salary: 47000000, startDate: "1401/09/01", status: "فعال", performance: 93 },
];

// ── Status cell renderer ──
function StatusCellRenderer(props: { value: string }) {
  const colors: Record<string, string> = {
    "فعال": "bg-green-500/15 text-green-400",
    "غیرفعال": "bg-red-500/15 text-red-400",
    "در مرخصی": "bg-yellow-500/15 text-yellow-400",
  };

  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${colors[props.value] || ""}`}>
      {props.value}
    </span>
  );
}

// ── Performance cell renderer (progress bar) ──
function PerformanceCellRenderer(props: { value: number }) {
  const color = props.value >= 90 ? "bg-green-500" : props.value >= 75 ? "bg-blue-500" : "bg-yellow-500";
  return (
    <div className="flex items-center gap-2 w-full h-full">
      <div className="flex-1 h-2 bg-desktop-border rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${props.value}%` }} />
      </div>
      <span className="text-xs font-medium tabular-nums w-8 text-left">{props.value}%</span>
    </div>
  );
}

// ── Salary formatter ──
function salaryFormatter(params: { value: number }) {
  return `${(params.value / 1000000).toFixed(1)}M تومان`;
}

export default function DataGrid() {
  const theme = useWindowStore((s) => s.theme);
  const [rowData] = useState<Employee[]>(sampleData);
  const [quickFilter, setQuickFilter] = useState("");
  const gridApiRef = useRef<{ sizeColumnsToFit: () => void } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const gridTheme = useMemo(() => buildGridTheme(theme), [theme]);
  const cssVars = useMemo(() => getGridCssVars(theme), [theme]);

  const columnDefs = useMemo(() => [
    {
      field: "id" as const,
      headerName: "#",
      width: 60,
      sortable: true,
      filter: "agNumberColumnFilter",
    },
    {
      field: "name" as const,
      headerName: "نام",
      width: 160,
      sortable: true,
      filter: true,
      pinned: "left" as const,
    },
    {
      field: "department" as const,
      headerName: "دپارتمان",
      width: 130,
      sortable: true,
      filter: true,
    },
    {
      field: "position" as const,
      headerName: "سمت",
      width: 200,
      sortable: true,
      filter: true,
    },
    {
      field: "salary" as const,
      headerName: "حقوق",
      width: 150,
      sortable: true,
      filter: "agNumberColumnFilter",
      valueFormatter: salaryFormatter,
    },
    {
      field: "startDate" as const,
      headerName: "تاریخ شروع",
      width: 120,
      sortable: true,
      filter: true,
    },
    {
      field: "status" as const,
      headerName: "وضعیت",
      width: 110,
      sortable: true,
      filter: true,
      cellRenderer: StatusCellRenderer,
    },
    {
      field: "performance" as const,
      headerName: "عملکرد",
      width: 180,
      sortable: true,
      filter: "agNumberColumnFilter",
      cellRenderer: PerformanceCellRenderer,
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    suppressMovable: false,
    menuTabs: ["filterMenuTab", "generalMenuTab"] as string[],
  }), []);

  // Recalculate columns when the container resizes (sidebar toggle, window resize)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        gridApiRef.current?.sizeColumnsToFit();
      });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const onGridReady = useCallback((params: { api: { sizeColumnsToFit: () => void } }) => {
    gridApiRef.current = params.api;
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <div className="h-full flex flex-col" dir="rtl">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-desktop-border bg-desktop-surface/50 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-desktop-text">جدول داده‌ها (AG Grid)</h2>
          <span className="text-xs text-desktop-text-muted bg-desktop-border/50 px-2 py-0.5 rounded">
            {rowData.length} ردیف
          </span>
        </div>

        {/* Quick filter */}
        <div className="relative w-64">
          <input
            type="text"
            value={quickFilter}
            onChange={(e) => setQuickFilter(e.target.value)}
            placeholder="جستجوی سریع..."
            className="w-full bg-desktop-surface border border-desktop-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-desktop-accent transition-colors text-desktop-text"
          />
        </div>
      </div>

      {/* ── AG Grid (theme synced via CSS variables) ── */}
      <div ref={containerRef} className="flex-1 ag-theme-quartz" style={cssVars}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          theme={gridTheme}
          quickFilterText={quickFilter}
          onGridReady={onGridReady}
          rowSelection="multiple"
          animateRows={true}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 20, 50]}
          domLayout="autoHeight"
          enableRtl={true}
          suppressCellFocus={false}
          rowHeight={40}
          headerHeight={44}
        />
      </div>
    </div>
  );
}
