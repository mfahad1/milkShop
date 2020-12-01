import { Repository, getConnection, In } from 'typeorm';

import { Product } from '../models/Product';

import { OrderProduct } from './../models/OrderProducts';

class ProductRepo {
    private repo: Repository<Product>;

    constructor() {
        this.repo = getConnection().getRepository(Product);
    }

    async create(name: string, price: number, scale: string, quantity: number, size?: string, brand?: string): Promise<Product> {
        const product = this.repo.create({ name, price, scale, quantity, size, brand });

        return this.repo.save(product);
    }

    async update(productId: string, product: Partial<Product>): Promise<Product> {
        return this.repo.save({
            id: productId,
            ...product,
        });
    }

    async findById(productId: string): Promise<Product | undefined> {
        const product = await this.repo.findOne({
            where: [
                { id: productId },
            ],
        });

        return product;
    }

    async findAllByIds(productIds: string[]): Promise<Product[]> {
        const product = await this.repo.find({
            where: { id: In(productIds) },
        });

        return product;
    }

    async getAll(offset: number, limit: number): Promise<[Product[], number]> {
        return this.repo.createQueryBuilder('product')
            .take(limit)
            .skip(offset)
            .orderBy('"createdAt"')
            .getManyAndCount();
    }

    async delete(productId: string): Promise<void> {
        await this.repo.delete(productId);
    }

    async getProductsByOrderId(orderId: string): Promise<Product[]> {
        return this.repo.createQueryBuilder('product')
            .leftJoinAndMapOne('product.orderProducts', OrderProduct, 'orderProduct', 'product.id = orderProduct.productId')
            .where('orderProduct.orderId = :orderId', { orderId })
            .getMany();
    }
}

export default new ProductRepo();
