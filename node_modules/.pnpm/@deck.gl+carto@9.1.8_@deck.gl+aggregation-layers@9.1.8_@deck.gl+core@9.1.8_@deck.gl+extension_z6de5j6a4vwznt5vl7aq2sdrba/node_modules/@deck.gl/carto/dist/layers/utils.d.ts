import { Tile as PropertiesTile } from "./schema/carto-properties-tile.js";
import { Tile as VectorTile } from "./schema/carto-tile.js";
import type { TilejsonResult } from '@carto/api-client';
/**
 * Adds access token to Authorization header in loadOptions
 */
export declare function injectAccessToken(loadOptions: any, accessToken: string): void;
export declare function mergeBoundaryData(geometry: VectorTile, properties: PropertiesTile): VectorTile;
export declare const TilejsonPropType: {
    type: "object";
    value: null | TilejsonResult;
    validate: (value: TilejsonResult, propType: any) => any;
    equal: (value1: any, value2: any) => boolean;
    async: boolean;
};
//# sourceMappingURL=utils.d.ts.map