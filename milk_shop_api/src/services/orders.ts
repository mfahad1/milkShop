import Boom from '@hapi/boom';

import { Order } from '../models/Order';
import { Product } from '../models/Product';
import OrderRepo from '../repositories/order';
import ProductRepo from '../repositories/products';

export async function createOrder(orderedProducts: { productId: string; quantity: number }[]): Promise<Order> {
    const allProducts = await ProductRepo.findAllByIds(orderedProducts.map(product => product.productId));
    const order = await OrderRepo.create();

    let totalPrice = 0;

    allProducts.forEach(async product => {
        const orderedProduct = orderedProducts.find(p => p.productId === product.id);
        if (!orderedProduct) {
            return Boom.notFound('A Product is not available');
        }
        if (!product.quantity || product.quantity < 1) {
            return Boom.notFound(`${product.name} doesn't have enough quantity`);
        }
        product.quantity = product.quantity - orderedProduct.quantity;

        const price = orderedProduct.quantity * product.price;

        totalPrice += price;

        await OrderRepo.addProductInOrder(order.id, product.id, price, orderedProduct.quantity);

        await ProductRepo.update(product.id, product);
    });

    return await OrderRepo.update(order.id, { totalPrice });
}

export async function getAllOrders(offset: number, limit: number): Promise<[Order[], number]> {
    return OrderRepo.getAllOrders(offset, limit);
}

export async function getProductsByOrderId(orderId: string): Promise<Product[]> {
    return ProductRepo.getProductsByOrderId(orderId);
}

export async function deleteByOrderId(orderId: string): Promise<void> {
    return OrderRepo.deleteByOrderId(orderId);
}
