import { type Widget } from '@deck.gl/core';
export declare function useWidget<T extends Widget, PropsT extends {}>(WidgetClass: {
    new (props: PropsT): T;
}, props: PropsT): T;
//# sourceMappingURL=use-widget.d.ts.map