import { MessageSquare, Send, Search } from "lucide-react";
import { useState } from "react";

const contacts = [
  { id: 1, name: "تیم فنی", lastMsg: "پوش ریکوئست تأیید شد", time: "۱۰:۳۰", unread: 3 },
  { id: 2, name: "سارا احمدی", lastMsg: "جلسه ساعت ۴ فردا", time: "۰۹:۱۵", unread: 0 },
  { id: 3, name: "پشتیبانی", lastMsg: "تیکت جدید #۱۲۳۴", time: "دیروز", unread: 1 },
  { id: 4, name: "مدیریت", lastMsg: "گزارش ماهانه آماده است", time: "دیروز", unread: 0 },
];

export default function Messages() {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [message, setMessage] = useState("");

  return (
    <div className="flex h-full" dir="rtl">
      {/* Contacts list */}
      <div className="w-64 border-l border-desktop-border flex flex-col">
        <div className="p-3 border-b border-desktop-border">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-desktop-text-muted" />
            <input
              type="text"
              placeholder="جستجو..."
              className="w-full bg-desktop-surface border border-desktop-border rounded-lg pr-10 pl-3 py-2 text-sm outline-none focus:border-desktop-accent"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full text-right p-3 flex items-center gap-3 hover:bg-desktop-surface/50 transition-colors border-b border-desktop-border/30 ${
                selectedContact.id === contact.id ? "bg-desktop-surface" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-desktop-accent/20 flex items-center justify-center text-desktop-accent font-bold text-sm">
                {contact.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm truncate">{contact.name}</span>
                  <span className="text-xs text-desktop-text-muted">{contact.time}</span>
                </div>
                <p className="text-xs text-desktop-text-muted truncate">{contact.lastMsg}</p>
              </div>
              {contact.unread > 0 && (
                <span className="bg-desktop-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {contact.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-desktop-border flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-desktop-accent" />
          <span className="font-semibold text-desktop-text">{selectedContact.name}</span>
        </div>

        <div className="flex-1 p-4 overflow-auto space-y-4">
          {/* Sample messages */}
          <div className="flex justify-start">
            <div className="bg-desktop-surface border border-desktop-border rounded-2xl rounded-tr-sm px-4 py-2 max-w-xs">
              <p className="text-sm">سلام، وضعیت پروژه چطوره؟</p>
              <span className="text-xs text-desktop-text-muted mt-1 block">۱۰:۰۰</span>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-desktop-accent rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs">
              <p className="text-sm text-white">سلام! همه چیز طبق برنامه پیش میره.</p>
              <span className="text-xs text-white/60 mt-1 block">۱۰:۰۵</span>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-desktop-surface border border-desktop-border rounded-2xl rounded-tr-sm px-4 py-2 max-w-xs">
              <p className="text-sm">عالیه! پوش ریکوئست رو تأیید کردم.</p>
              <span className="text-xs text-desktop-text-muted mt-1 block">۱۰:۳۰</span>
            </div>
          </div>
        </div>

        {/* Message input */}
        <div className="p-4 border-t border-desktop-border">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="پیام خود را بنویسید..."
              className="flex-1 bg-desktop-surface border border-desktop-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-desktop-accent"
            />
            <button className="bg-desktop-accent hover:bg-desktop-accent-hover text-white p-2.5 rounded-xl transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
