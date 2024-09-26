import { Label, TextInput } from "flowbite-react";

type PlayerToolProps = {
  position: {
    x: number;
    y: number;
  };
  onValueChange?: (x: number, y: number) => void;
};

export default function PlayerTool({
  onValueChange,
  position,
}: PlayerToolProps) {
  return (
    <div>
      <p className="text-lg font-medium mb-2">Boat position:</p>
      <div className="flex gap-7">
        <div className="flex items-center gap-2">
          <Label htmlFor="xPos" value="x" />
          <div className="w-20">
            <TextInput
              onChange={(e) => {
                onValueChange && onValueChange(+e.target.value, position.y);
              }}
              id="xPos"
              type="text"
              value={position.x}
              required
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="yPos" value="y" />
          <div className="w-20">
            <TextInput
              onChange={(e) => {
                onValueChange && onValueChange(position.x, +e.target.value);
              }}
              id="yPos"
              type="text"
              value={position.y}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}
