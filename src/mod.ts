import { DependencyContainer } from "tsyringe";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
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
import { SimpleItem } from "./types";
import { IItem } from "@spt/models/eft/common/tables/IItem";
import items from "../db/items.json";
import { IBarterScheme } from "@spt/models/eft/common/tables/ITrader";
const customItems = items as SimpleItem[];

class MikhailReznichenko   implements IPreSptLoadMod, IPostDBLoadMod
{
    private mod: string;
    private logger: ILogger;
    private traderHelper: TraderHelper;
    public modHelper = new ModHelper();
    public configToClient = "/tyrian/mikhailreznichenko/config_to_client";

    constructor() 
    {
        this.mod = "Tyr-MikhailReznichenko"; 
    }

    /**
     
     * @param container Dependency container
     */
    public preSptLoad(container: DependencyContainer): void
    {
        
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.debug(`[${this.mod}] preSpt Loading... `);

        const preSptModLoader: PreSptModLoader = container.resolve<PreSptModLoader>("PreSptModLoader");
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig: ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);

        this.traderHelper = new TraderHelper();
        this.traderHelper.registerProfileImage(traderJson, this.mod, preSptModLoader, imageRouter, "Mikhail_Reznichenko.jpg");
        this.traderHelper.setTraderUpdateTime(traderConfig, traderJson, 3600, 4000);
        
        Traders[traderJson._id] = traderJson._id;

        ragfairConfig.traders[traderJson._id] = false;
		
        this.modHelper.init(container, InitStage.PRE_SPT_LOAD);
        this.modHelper.registerStaticRoute(this.configToClient, "MikhailReznichenko-ConfigToClient", MikhailReznichenko.onConfigToClient);

        this.logger.debug(`[${this.mod}] preSpt Loaded`);
    }

    /**
     
      @param container Dependency container
     */
    public postDBLoad(container: DependencyContainer): void
    {
        this.logger.debug(`[${this.mod}] postDb Loading... `);
        
        this.modHelper.init(container, InitStage.POST_DB_LOAD);

        const dbTables = this.modHelper.dbTables;
        const jsonUtil = this.modHelper.jsonUtil;

        this.traderHelper.addTraderToDb(traderJson, dbTables, jsonUtil, assortJson);
        this.traderHelper.addTraderToLocales(traderJson, dbTables, traderJson.name, "MikhailReznichenko", traderJson.nickname, traderJson.location, "Welcome, friend. Here, you'll only find strong and honest wood.");

        for (const item of customItems) 
        {
            this.addSimpleItemToDb(item);
            this.addSimpleItemToTraderAssort(item);
        }
        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static onConfigToClient(url: string, info: any, sessionId: string, output: string, helper: ModHelper): string 
    {
        const configObject:Record<string, string[]> = { ItemIds: [] }
        for (const item of customItems) 
        {
            configObject.ItemIds.push(item.id);
        }
        return JSON.stringify(configObject);
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
            // Builders Backpack
            itemClone._props.Grids[0]._props.cellsH = 7
            itemClone._props.Grids[0]._props.cellsV = 128
        }
        if (itemTemplate.itemType === "5c0a840b86f7742ffa4f2482")
        {
            // Container Items
            if (itemTemplate.id === "678ff6a08def9feca215636e")
            {
                //Large Ammo Box
                itemClone._props.Grids[0]._props.cellsH = 18
                itemClone._props.Grids[0]._props.cellsV = 12
            }
            if (itemTemplate.id === "678ff754fa2aee130bf269da")
            {
                //Stubby Ammo Box
                itemClone._props.Grids[0]._props.cellsH = 14
                itemClone._props.Grids[0]._props.cellsV = 14
            }
            if (itemTemplate.id === "678ff749a1b18d76f8bb08d0")
            {
                //Small Ammo Box
                itemClone._props.Grids[0]._props.cellsH = 12
                itemClone._props.Grids[0]._props.cellsV = 8
            }
            if (itemTemplate.id === "678ff771ed3fba9e8998c76f")
            {
                //Large Weapon Case
                itemClone._props.Grids[0]._props.cellsH = 18
                itemClone._props.Grids[0]._props.cellsV = 12
            }
            if (itemTemplate.id === "678ff7ec91e978af07400932")
            {
                //Massive Supply Case
                itemClone._props.Grids[0]._props.cellsH = 24
                itemClone._props.Grids[0]._props.cellsV = 24
            }
            if (itemTemplate.id === "678ff970bbb8bdc6515a87b2")
            {
                //Fridge
                itemClone._props.Grids[0]._props.cellsH = 16
                itemClone._props.Grids[0]._props.cellsV = 16
            }
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
        const trader = this.modHelper.dbTraders[this.getTraderId("mikhail")];

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
        //trader.assort.loyal_level_items[itemTemplate.assortId] = itemTemplate.loyaltyLevel;
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