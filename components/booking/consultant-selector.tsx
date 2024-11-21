"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { consultants } from "@/lib/consultants-data";

interface ConsultantSelectorProps {
  selectedConsultant?: string;
  onConsultantSelect: (consultantId: string) => void;
}

export function ConsultantSelector({
  selectedConsultant,
  onConsultantSelect,
}: ConsultantSelectorProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {consultants.map((consultant) => (
        <Card
          key={consultant.id}
          className={`p-4 cursor-pointer transition-all ${
            selectedConsultant === consultant.id
              ? "border-primary shadow-lg"
              : "hover:border-primary/50"
          }`}
          onClick={() => onConsultantSelect(consultant.id)}
        >
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={consultant.avatar} />
              <AvatarFallback>{consultant.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{consultant.name}</h3>
              <p className="text-sm text-muted-foreground">{consultant.role}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}