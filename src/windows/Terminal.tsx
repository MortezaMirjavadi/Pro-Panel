import { Terminal as TerminalIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Line {
  type: "input" | "output";
  text: string;
}

const mockCommands: Record<string, string> = {
  help: "دستورات موجود: help, ls, pwd, whoami, date, clear, echo",
  ls: "Documents  Pictures  Downloads  Music  Videos  projects",
  pwd: "/home/admin",
  whoami: "admin",
  date: new Date().toLocaleString("fa-IR"),
};

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: "به ترمینال پرو پنل خوش آمدید!" },
    { type: 'output', text: 'برای مشاهده دستورات "help" را تایپ کنید.' },
    { type: "output", text: "" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    const newLines: Line[] = [{ type: "input", text: `$ ${trimmed}` }];

    if (trimmed === "clear") {
      setLines([]);
      return;
    }

    if (trimmed.startsWith("echo ")) {
      newLines.push({ type: "output", text: trimmed.slice(5) });
    } else if (mockCommands[trimmed]) {
      newLines.push({ type: "output", text: mockCommands[trimmed] });
    } else if (trimmed) {
      newLines.push({ type: "output", text: `دستور ناشناخته: ${trimmed}` });
    }

    newLines.push({ type: "output", text: "" });
    setLines((prev) => [...prev, ...newLines]);
  };

  return (
    <div className="h-full flex flex-col bg-[#0d0e1a] font-mono text-sm" dir="ltr">
      <div className="flex-1 p-4 overflow-auto">
        {lines.map((line, i) => (
          <div key={i} className={line.type === "input" ? "text-green-400" : "text-gray-300"}>
            {line.text}
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="text-green-400">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCommand(input);
                setInput("");
              }
            }}
            className="flex-1 bg-transparent outline-none text-gray-200"
            autoFocus
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
