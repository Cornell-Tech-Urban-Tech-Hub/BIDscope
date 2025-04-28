import type { Properties, NumericProps } from "./layers/schema/spatialjson-utils.js";
export declare function assert(condition: unknown, message?: string): asserts condition;
export declare function createBinaryProxy(data: {
    numericProps: NumericProps;
    properties: Properties[];
}, index: number): Properties;
export declare function getWorkerUrl(id: string, version: string): string;
export declare function scaleIdentity(): {
    (x: any): any;
    invert: any;
    domain: (d: any) => any;
    range(d: any): any;
    unknown(u: any): any;
    copy(): any;
};
export declare const isObject: (x: unknown) => boolean;
export declare const isPureObject: (x: any) => boolean;
//# sourceMappingURL=utils.d.ts.map