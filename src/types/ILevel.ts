type LevelEntitie = {
  type: string;
  xPos: number;
  yPos: number;
};

type ILevel = {
  player: {
    xPos: number;
    yPos: number;
  };

  entities: LevelEntitie[];

  tilemap: number[][];
};

export default ILevel;
