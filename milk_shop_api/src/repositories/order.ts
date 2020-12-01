import { Repository, getConnection } from 'typeorm';

import { OrderProduct } from '../models/OrderProducts';

import { Order } from './../models/Order';

class OrderRepo {
    private repo: Repository<Order>;
    private orderProductRepo: Repository<OrderProduct>;

    constructor() {
        this.repo = getConnection().getRepository(Order);
        this.orderProductRepo = getConnection().getRepository(OrderProduct);
    }

    async create(): Promise<Order> {
        const order = this.repo.create({});

        return this.repo.save(order);
    }

    async update(orderId: string, order: Partial<Order>): Promise<Order> {
        return this.repo.save({
            id: orderId,
            ...order,
        });
    }

    async addProductInOrder(orderId: string, productId: string, price: number, quantity: number): Promise<void> {
        this.orderProductRepo.save({
            orderId,
            productId,
            price,
            quantity,
        });
    }

    async getAllOrders(offset: number, limit: number): Promise<[Order[], number]> {
        return this.repo.createQueryBuilder('order')
            .take(limit)
            .skip(offset)
            .getManyAndCount();
    }

    async deleteByOrderId(orderId: string): Promise<void> {
        await this.repo.delete(orderId);
    }
}

export default new OrderRepo();
