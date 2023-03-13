export declare enum PromiseState {
    created = 0,
    active = 1,
    completed = 2,
    voided = 3
}
export declare const toPromiseState: (state: any) => PromiseState;
export declare const fromPromiseState: (state: PromiseState) => {
    created: {};
    active?: undefined;
    completed?: undefined;
    voided?: undefined;
} | {
    active: {};
    created?: undefined;
    completed?: undefined;
    voided?: undefined;
} | {
    completed: {};
    created?: undefined;
    active?: undefined;
    voided?: undefined;
} | {
    voided: {};
    created?: undefined;
    active?: undefined;
    completed?: undefined;
};
