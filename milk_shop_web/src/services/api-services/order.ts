import httpRequest from './config/HttpRequest';
import { ListResponse } from './interfaces';

type CreateOrderRequest = {
  products: { productId: string; quantity: number }[];
}

type CreateOrderResponse = {
  products: { id: string; totalPrice: string }[];
}

export type Order = {
  id: string;
  totalPrice: string;
  updatedAt: Date;
}

export function CreateOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
  return httpRequest.request({
    url: '/orders',
    method: 'post',
    data: data,
  });
}

export function GetOrders(offset: number, limit: number): Promise<ListResponse<Order>> {
  return httpRequest.request({
    url: `/orders?offset=${offset}&limit=${limit}`,
    method: 'get',
  });
}

export function DeleteOrder(orderId: string): Promise<void> {
  return httpRequest.request({
    url: `/orders/${orderId}`,
    method: 'delete',
  });
}
