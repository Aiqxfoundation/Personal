import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Edit, Plus } from "lucide-react";
import { OrgNode as OrgNodeType } from "@shared/schema";

interface OrgNodeProps {
  node: OrgNodeType;
  onEdit?: (node: OrgNodeType) => void;
  onDelete?: (nodeId: string) => void;
  onAddChild?: (parentId: string) => void;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function OrgNode({
  node,
  onEdit,
  onDelete,
  onAddChild,
  isSelected = false,
  onClick,
}: OrgNodeProps) {
  return (
    <Card
      className={`relative min-w-[200px] p-4 text-center cursor-pointer transition-all hover-elevate ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
      data-testid={`node-${node.id}`}
    >
      <div className="space-y-1">
        <h3 className="font-semibold text-sm" data-testid={`text-name-${node.id}`}>
          {node.name}
        </h3>
        <p className="text-xs text-muted-foreground" data-testid={`text-title-${node.id}`}>
          {node.title}
        </p>
      </div>
      
      {(onEdit || onDelete || onAddChild) && (
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          {onAddChild && (
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(node.id);
              }}
              data-testid={`button-add-child-${node.id}`}
            >
              <Plus className="h-3 w-3" />
            </Button>
          )}
          {onEdit && (
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(node);
              }}
              data-testid={`button-edit-${node.id}`}
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.id);
              }}
              data-testid={`button-delete-${node.id}`}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}