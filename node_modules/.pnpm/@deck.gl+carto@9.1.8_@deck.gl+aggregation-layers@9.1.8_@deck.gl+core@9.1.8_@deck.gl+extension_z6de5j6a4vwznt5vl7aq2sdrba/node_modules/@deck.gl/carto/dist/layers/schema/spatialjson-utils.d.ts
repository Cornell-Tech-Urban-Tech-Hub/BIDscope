export type IndexScheme = 'h3' | 'quadbin';
type TypedArray = Float32Array | Float64Array;
export type Indices = {
    value: BigUint64Array;
};
export type NumericProps = Record<string, {
    value: number[] | TypedArray;
}>;
export type Properties = Record<string, string | number | boolean | null>;
export type Cells = {
    indices: Indices;
    numericProps: NumericProps;
    properties: Properties[];
};
export type SpatialBinary = {
    scheme?: IndexScheme;
    cells: Cells;
};
export type SpatialJson = {
    id: string | bigint;
    properties: Properties;
}[];
export declare function binaryToSpatialjson(binary: SpatialBinary): SpatialJson;
export {};
//# sourceMappingURL=spatialjson-utils.d.ts.map