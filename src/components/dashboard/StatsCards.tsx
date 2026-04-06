import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: "primary" | "success" | "warning" | "accent";
  onClick?: () => void;   // ✅ add onClick to type
}

interface StatsCardsProps {
  stats: StatCard[];
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "accent":
        return "text-accent";
      default:
        return "text-primary";
    }
  };

  const getBadgeVariant = (change: string) => {
    return change.startsWith("+") ? "default" : "destructive";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={stat.onClick}   // ✅ use stat.onClick if provided
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`w-5 h-5 ${getColorClasses(stat.color)}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stat.value}</div>
              <Badge variant={getBadgeVariant(stat.change)}>
                {stat.change}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
