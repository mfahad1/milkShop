import Boom from '@hapi/boom';

import ProductRepo from '../repositories/products';

import { Product } from './../models/Product';

export async function createProduct(name: string, price: number, scale: string, quantity: number, size?: string, brand?: string): Promise<Product> {
    return ProductRepo.create(name, price, scale, quantity, size, brand);
}

export async function updateProduct(productId: string, product: Partial<Product>): Promise<Product> {
    return ProductRepo.update(productId, product);
}

export async function getProducts(offset: number, limit: number): Promise<[Product[], number]> {
    return ProductRepo.getAll(offset, limit);
}

export async function getProductById(productId: string): Promise<Product> {
    const product = await ProductRepo.findById(productId);
    if (!product) {
        throw Boom.notFound('Product with this id does not exist');
    }

    return product;
}

export async function deleteProduct(productId: string): Promise<void> {
    return ProductRepo.delete(productId);
}
