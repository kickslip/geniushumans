export interface Consultant {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export const consultants: Consultant[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Senior Full Stack Lead",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "DevOps Engineer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "UI/UX Engineer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop",
  },
];