import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { OrderProduct } from './OrderProducts';

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ type: 'decimal' })
    price!: number;

    @Column()
    scale!: string;

    @Column({ type: 'decimal' })
    quantity?: number;

    @Column({ nullable: true })
    size?: string;

    @Column({ nullable: true })
    brand?: string;

    @OneToMany(() => OrderProduct, orderProduct => orderProduct.order)
    orderProducts!: OrderProduct[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
