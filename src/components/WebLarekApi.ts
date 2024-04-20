import { Api, ApiListResponse } from './base/api';
import { IOrder, IOrderResult, IProduct, IBasket } from "../types";
import { IWebLarekAPI } from '../types';


export class WebLarekAPI extends Api implements IWebLarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductItem(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    createOrderProducts(order: IOrder): Promise<IOrderResult> {
        return this.post(`/order`, order).then(
            (data: IOrderResult) => data
        );
    }

    getProductList(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

}