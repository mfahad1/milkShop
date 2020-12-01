import { Column, CreateDateColumn, Entity, UpdateDateColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Order } from './Order';
import { Product } from './Product';

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  orderId!: string;

  @Column()
  productId!: string;

  @Column({ type: 'decimal' })
  price!: number;

  @Column({ type: 'decimal' })
  quantity!: number;

  @ManyToOne(() => Order, order => order.orderProducts, { onDelete: 'CASCADE' })
  order!: Order;

  @ManyToOne(() => Product, product => product.orderProducts, { onDelete: 'CASCADE' })
  product!: Product;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
