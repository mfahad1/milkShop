import httpRequest from './config/HttpRequest';
import { ListResponse } from './interfaces';

export type CreateProductRequest = {
  name: string;
  price: number;
  scale: string;
  quantity: number;
  size: string;
  brand: string;
}

export type Product = {
  id: string;
  name: string;
  price: number;
  scale: string;
  quantity: number;
  size: string;
  brand: string;
}

export function CreateProduct(data: CreateProductRequest): Promise<CreateProductRequest> {
  return httpRequest.request({
    url: '/products',
    method: 'post',
    data: data,
  });
}

export function EditProduct(productId: string, data: CreateProductRequest): Promise<CreateProductRequest> {
  return httpRequest.request({
    url: `/products/${productId}`,
    method: 'put',
    data: data,
  });
}

export function GetProducts(offset: number, limit: number): Promise<ListResponse<Product>> {
  return httpRequest.request({
    url: `/products?offset=${offset}&limit=${limit}`,
    method: 'get',
  });
}

export function GetProductById(productId: string): Promise<Product> {
  return httpRequest.request({
    url: `/product/${productId}`,
    method: 'get',
  });
}

export function DeleteProduct(productId: string): Promise<ListResponse<Product>> {
  return httpRequest.request({
    url: `/products/${productId}`,
    method: 'delete',
  });
}

type OrderProducts = {
  orderProducts: {
    price: string;
    quantity: string;
  };
}

export function GetProductsByOrderId(orderId: string): Promise<ListResponse<Product & OrderProducts>> {
  return httpRequest.request({
    url: `/orders/${orderId}`,
    method: 'get',
  });
}
