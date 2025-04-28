import { DefaultProps } from '@deck.gl/core';
import { MVTLayer, MVTLayerProps, TileLayer, _Tile2DHeader, _TileLoadProps as TileLoadProps } from '@deck.gl/geo-layers';
import { GeoJsonLayer } from '@deck.gl/layers';
import type { TilejsonResult } from '@carto/api-client';
/** All properties supported by VectorTileLayer. */
export type VectorTileLayerProps<FeaturePropertiesT = unknown> = _VectorTileLayerProps & Omit<MVTLayerProps<FeaturePropertiesT>, 'data'>;
/** Properties added by VectorTileLayer. */
type _VectorTileLayerProps = {
    data: null | TilejsonResult | Promise<TilejsonResult>;
};
export default class VectorTileLayer<FeaturePropertiesT = any, ExtraProps extends {} = {}> extends MVTLayer<FeaturePropertiesT, Required<_VectorTileLayerProps> & ExtraProps> {
    static layerName: string;
    static defaultProps: DefaultProps<VectorTileLayerProps<unknown>>;
    state: MVTLayer['state'] & {
        mvt: boolean;
    };
    constructor(...propObjects: VectorTileLayerProps<FeaturePropertiesT>[]);
    initializeState(): void;
    updateState(parameters: any): void;
    getLoadOptions(): any;
    getTileData(tile: TileLoadProps): Promise<any>;
    renderSubLayers(props: TileLayer['props'] & {
        id: string;
        data: any;
        _offset: number;
        tile: _Tile2DHeader;
    }): GeoJsonLayer | null;
    protected _isWGS84(): boolean;
}
export {};
//# sourceMappingURL=vector-tile-layer.d.ts.map