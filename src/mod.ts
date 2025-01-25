import { DependencyContainer } from "tsyringe";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
//import { ILogger } from "@spt/models/spt/utils/ILogger";
import { PreSptModLoader } from "@spt/loaders/PreSptModLoader";
import { ImageRouter } from "@spt/routers/ImageRouter";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { ITraderConfig } from "@spt/models/spt/config/ITraderConfig";
import { IRagfairConfig } from "@spt/models/spt/config/IRagfairConfig";
import { Traders } from "@spt/models/enums/Traders";
import { TraderHelper } from "../src/trader_helper";
import traderJson = require("../db/trader.json");
import assortJson = require("../db/assort.json");
import { FileUtils, InitStage, ModHelper } from "../src/mod_helper";
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { SimpleItem} from "./types";
import { IItem } from "@spt/models/eft/common/tables/IItem";
import items from "../db/items.json";
import { IBarterScheme } from "@spt/models/eft/common/tables/ITrader";
const customItems = items as SimpleItem[];
const itemData: string[] = [];

class MikhailReznichenko   implements IPreSptLoadMod, IPostDBLoadMod
{
    private mod: string;
    //private logger: ILogger;
    private traderHelper: TraderHelper;
    public modHelper = new ModHelper();
    public configToClient = "/tyrian/mikhailreznichenko/config_to_client";
    public traderId = "678fab45ec8b6e5add71985a";

    constructor() 
    {
        this.mod = "tyr-mikhailreznichenko-server";
    }

    /**
     * @param container Dependency container
     */
    public preSptLoad(container: DependencyContainer): void
    {
        
        //this.logger = container.resolve<ILogger>("WinstonLogger");
        //this.logger.debug(`[${this.mod}] preSpt Loading... `);

        const preSptModLoader: PreSptModLoader = container.resolve<PreSptModLoader>("PreSptModLoader");
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig: ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);

        this.traderHelper = new TraderHelper();
        this.traderHelper.registerProfileImage(traderJson, this.mod, preSptModLoader, imageRouter, this.traderId+".jpg");
        this.traderHelper.setTraderUpdateTime(traderConfig, traderJson, 3600, 4000);
        
        Traders[traderJson._id] = traderJson._id;

        ragfairConfig.traders[traderJson._id] = false;
		
        this.modHelper.init(container, InitStage.PRE_SPT_LOAD);
        this.modHelper.registerStaticRoute(this.configToClient, "MikhailReznichenko-ConfigToClient", MikhailReznichenko.onConfigToClient, MikhailReznichenko, true);

        //this.logger.debug(`[${this.mod}] preSpt Loaded`);
    }

    /**
     * @param container Dependency container
     */
    public postDBLoad(container: DependencyContainer): void
    {
        //this.logger.debug(`[${this.mod}] postDb Loading... `);
        
        this.modHelper.init(container, InitStage.POST_DB_LOAD);

        const dbTables = this.modHelper.dbTables;
        const jsonUtil = this.modHelper.jsonUtil;

        this.traderHelper.addTraderToDb(traderJson, dbTables, jsonUtil, assortJson);
        this.traderHelper.addTraderToLocales(traderJson, dbTables, traderJson.name, "MikhailReznichenko", traderJson.nickname, traderJson.location, "Welcome, friend. Here, you'll only find strong and honest wood.");
        for (const item of customItems) 
        {
            itemData.push(item.id)
        }
        for (const item of customItems) 
        {
            this.addSimpleItemToDb(item);
            this.addSimpleItemToTraderAssort(item);
        }
        //this.logger.debug(`[${this.mod}] postDb Loaded`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static onConfigToClient(url: string, info: any, sessionId: string, output: string, helper: ModHelper): string 
    {
        return JSON.stringify(itemData);
    }
	
    private addSimpleItemToDb(itemTemplate: SimpleItem): void 
    {
        const itemClone: ITemplateItem = FileUtils.jsonClone<ITemplateItem>(this.modHelper.dbItems[itemTemplate.itemType]);
		
        itemClone._id = itemTemplate.id;
        itemClone._name = itemTemplate.name;
        itemClone._props.Name = itemTemplate.name;
        itemClone._props.ShortName = itemTemplate.name;
        itemClone._props.Description = itemTemplate.description;
        itemClone._props.Width = itemTemplate.width;
        itemClone._props.Height = itemTemplate.height;
        itemClone._props.Weight = itemTemplate.weight;
        itemClone._props.Prefab.path = itemTemplate.bundlePath;
		
        if (itemTemplate.itemType === "5df8a4d786f77412672a1e3b")
        {
            itemClone._props.Grids[0]._props.cellsH = itemTemplate.containerCellsH;
            itemClone._props.Grids[0]._props.cellsV = itemTemplate.containerCellsV;
            itemClone._props.Grids[0]._props.filters[0].Filter = itemData
            itemClone._props.Grids[0]._props.filters[0].Filter.push(
                "67893431dcad180324ddcc1d", 
                "67893bbeafe8250ed0fe6770"
            )
        }
        else if (itemTemplate.itemType === "5c0a840b86f7742ffa4f2482")
        {
            itemClone._props.Grids[0]._props.cellsH = itemTemplate.containerCellsH;
            itemClone._props.Grids[0]._props.cellsV = itemTemplate.containerCellsV;
            itemClone._props.Grids[0]._props.filters[0].Filter = []
            itemClone._props.Grids[0]._props.filters[0].Filter.push(...itemTemplate.containerFilters)
        }
        else if (itemTemplate.itemType === "656e0436d44a1bb4220303a0")
        {
            itemClone._props.Grids[0]._props.cellsH = 6;
            itemClone._props.Grids[0]._props.cellsV = 6;
            itemClone._props.Grids[0]._props.filters[0].Filter = []
            itemClone._props.Grids[0]._props.filters[0].Filter.push(...itemTemplate.containerFilters)
            itemClone._props.Grids[1]._props.cellsH = 3;
            itemClone._props.Grids[1]._props.cellsV = 4;
            itemClone._props.Grids[1]._props.filters[0].Filter = []
            itemClone._props.Grids[1]._props.filters[0].Filter.push(...itemTemplate.containerFilters)
            itemClone._props.Grids[2]._props.cellsH = 3;
            itemClone._props.Grids[2]._props.cellsV = 4;
            itemClone._props.Grids[2]._props.filters[0].Filter = []
            itemClone._props.Grids[2]._props.filters[0].Filter.push(...itemTemplate.containerFilters)
        }

        this.modHelper.dbItems[itemTemplate.id] = itemClone;

        this.modHelper.dbHandbook.Items.push({
            Id: itemTemplate.id,
            ParentId: "5b47574386f77428ca22b2ee",
            Price: itemTemplate.fleaPrice
        });

        for (const langKey in this.modHelper.dbLocales.global) 
        {
            const locale = this.modHelper.dbLocales.global[langKey];
            locale[`${itemTemplate.id} Name`] = itemTemplate.name;
            locale[`${itemTemplate.id} ShortName`] = itemTemplate.name;
            locale[`${itemTemplate.id} Description`] = itemTemplate.description;
        }
    }
	
    private addSimpleItemToTraderAssort(itemTemplate: SimpleItem): void 
    {
        const trader = this.modHelper.dbTraders[this.traderId];

        const barter: IBarterScheme = {
            count: 5000,
            _tpl: this.getCurrencyId("rub")
        };

        const item: IItem = {
            _id: itemTemplate.assortId,
            _tpl: itemTemplate.id,
            parentId: "hideout",
            slotId: "hideout",
            upd: {
                UnlimitedCount: true,
                StackObjectsCount: 999999,
                BuyRestrictionMax: 10,
                BuyRestrictionCurrent: 0
            }
        };

        trader.assort.items.push(item);
        trader.assort.barter_scheme[itemTemplate.assortId] = [[barter]];
        trader.assort.loyal_level_items[itemTemplate.assortId] = itemTemplate.loyaltyLevel;
    }
	
    getTraderId(traderName: string): string 
    {
        return ModHelper.traderIdsByName[traderName] ?? traderName;
    }

    getCurrencyId(currencyName: string): string 
    {
        return ModHelper.currencyIdsByName[currencyName] ?? currencyName;
    }
}

export const mod = new MikhailReznichenko();