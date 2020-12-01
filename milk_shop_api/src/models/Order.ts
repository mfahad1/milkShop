import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany, Column } from 'typeorm';

import { OrderProduct } from './OrderProducts';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true, type: 'decimal' })
  totalPrice!: number;

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.order)
  orderProducts!: OrderProduct[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
