import { Button, Kbd } from "flowbite-react";
import { Plus } from "lucide-react";

const entities = [
  {
    label: "Mine",
    key: "sea_mine",
  },
  {
    label: "Oxygen",
    key: "oxygen",
  },
  {
    label: "Chest",
    key: "chest",
  },
  {
    label: "Battery",
    key: "battery",
  },
];

type EntityToolProps = {
  onSelect?: (value: string) => void;
  onRemove?: () => void;
};

function EntityTool({ onSelect, onRemove }: EntityToolProps) {
  const entitySelect = (key: string) => {
    onSelect && onSelect(key);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {entities.map((item) => (
        <Button
          key={item.key}
          color="light"
          onClick={() => entitySelect(item.key)}
        >
          <div className="flex gap-1 items-center">
            <Plus size={18} /> <span>{item.label}</span>
          </div>
        </Button>
      ))}

      <div className="my-2">
        Press <Kbd>Ctrl</Kbd> to remove entity
      </div>
    </div>
  );
}

export default EntityTool;
