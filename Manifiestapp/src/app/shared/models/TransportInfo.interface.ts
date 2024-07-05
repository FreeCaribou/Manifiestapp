export interface ITransportInfo {
    [key: string]: any;
    id: string;
    title: string;
    path: {current: string};
    field_bus_info: string;
    field_train_info: string;
    field_general_info: string;
}