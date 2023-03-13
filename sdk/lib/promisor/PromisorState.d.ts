export declare enum PromisorState {
    active = 0,
    inactive = 1
}
export declare const toPromisorState: (state: any) => PromisorState;
export declare const fromPromisorState: (state: PromisorState) => {
    active: {};
    inActive?: undefined;
} | {
    inActive: {};
    active?: undefined;
};
