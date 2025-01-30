export type SimpleItem = {
    id: string;
    assortId: string;
    name: string;
    description: string;
    width: number;
    height: number;
    weight: number;
    loyaltyLevel: number;
    cost: number;
    fleaPrice: number;
    bundlePath: string;
    itemType: string;
    containerCellsH: number;
    containerCellsV: number;
    containerFilters: string[];
    excludedFilters: string[];
};

export type CraftableItem = {
    craftName: string;
    craftRequiredName: string;
    craftRequired: string;
    craftGiven: string;
};

export type WorkbenchCrafts = {
    [workbenchId: string]: CraftableItem[];
};