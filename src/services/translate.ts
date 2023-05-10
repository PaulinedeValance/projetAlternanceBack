const frDictionnary: Record<string, string> = {
  strategy: "stratégie",
  deckBuilding: "deck-building",
  family: "famille",
};

export const translate = (keyTrad: string) => {
  return frDictionnary[keyTrad];
};
