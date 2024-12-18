"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Shirt,
  Sun,
  Package,
  PlusCircle,
  ChevronDown,
  LucideIcon,
  KanbanSquare,
  PersonStandingIcon,
  CheckSquare,
  Calendar,
  Mail,
} from "lucide-react";
import { Session } from "lucia";

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  subItems?: NavItem[];
  color: string;
};

type Section = {
  section: string;
  items: NavItem[];
};

interface SidebarProps {
  className?: string;
  user?: string;
  session: Session | undefined; // Ensure the type matches expected input
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className, session, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [activeItems, setActiveItems] = useState<string[]>([]);

  // Define navigation items
  const navItems: Section[] = useMemo(
    () => [
      {
        section: "USERS",
        items: [
          { href: "/admin/usermanagement", icon: Users, label: "Update Roles", color: "#4CAF50" },
        ],
      },
      {
        section: "Projects",
        items: [
          {href: "/admin/kanban", icon: KanbanSquare, label: "Kanban-Board", color: "orange"}
        ]
      },
      {
        section: "Teams",
        items: [
          {href: "/teams", icon: PersonStandingIcon, label: "Teams", color: "blue"}
        ]
      },
      {
        section: "Tasks",
        items: [
          {href: "/task", icon: CheckSquare, label: "Tasks", color: "red"}
        ]
      },
      {
        section: "Calender",
        items: [
          {href: "/calender", icon: Calendar, label: "Calender", color: "yellow"}
        ]
      },
      {
        section: "Messages",
        items: [
          {href: "/messages", icon: Mail, label: "Messages", color: "black"}
        ]
      },
    ],
    []
  );

  // Update active and open sections based on pathname
  useEffect(() => {
    const updateActiveItems = (items: NavItem[], parentPath: string = "") => {
      items.forEach((item) => {
        const fullPath = `${parentPath}${item.href}`;
        if (pathname?.startsWith(fullPath)) {
          setActiveItems((prev) => [...new Set([...prev, fullPath])]);
          setOpenSections((prev) => [...new Set([...prev, item.label])]);
          if (item.subItems) {
            updateActiveItems(item.subItems, fullPath);
          }
        }
      });
    };

    setActiveItems([]);
    navItems.forEach((section) => updateActiveItems(section.items));
  }, [pathname, navItems]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((sec) => sec !== section)
        : [...prev, section]
    );
  };

  const isItemActive = (href: string): boolean => activeItems.includes(href);

  const renderNavItem = (item: NavItem, parentPath: string = "", depth: number = 0) => {
    const fullPath = `${parentPath}${item.href}`;
    const isActive = isItemActive(fullPath);
    const isOpen = openSections.includes(item.label);
    const hasSubItems = item.subItems !== undefined && item.subItems.length > 0;

    return (
      <div key={fullPath} className="w-full">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left transition-colors duration-200 mb-2",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            depth > 0 && "pl-4"
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (hasSubItems) {
              toggleSection(item.label);
            } else {
              router.push(fullPath);
              onClose?.();
            }
          }}
        >
          <div className="flex w-full items-center">
            <item.icon className="mr-2 h-4 w-4" style={{ color: item.color }} />
            <span className="flex-grow text-sm font-medium">{item.label}</span>
            {hasSubItems && (
              <ChevronDown
                className={cn(
                  "ml-auto h-4 w-4 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            )}
          </div>
        </Button>
        {hasSubItems && item.subItems && (
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="space-y-1 pl-4">
              {item.subItems.map((subItem) => renderNavItem(subItem, fullPath, depth + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "flex h-screen w-64 flex-col overflow-y-auto bg-background p-4 shadow-md",
        className
      )}
    >
      <div className="mb-6 flex items-center">
        <LayoutDashboard className="mr-2 h-6 w-6 text-primary" />
        <Button
          variant="link"
          className="text-xl font-semibold text-primary"
          onClick={(e) => {
            e.preventDefault();
            router.push("/admin");
            onClose?.();
          }}
        >
          Admin Dashboard
        </Button>
      </div>

      <nav className="flex-grow space-y-4">
        {navItems.map((section) => (
          <div key={section.section} className="space-y-2">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">
              {section.section}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => renderNavItem(item))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
