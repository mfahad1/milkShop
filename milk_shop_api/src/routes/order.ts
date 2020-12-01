import Joi from '@hapi/joi';
import express, { Router } from 'express';

import { createOrder, getAllOrders, getProductsByOrderId, deleteByOrderId } from '../services/orders';
import { wrapAsync } from '../utils/asyncHandler';

import { Request } from './interfaces';

const router = Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     order:
 *       - Order
 *     summary: Get Order list
 *     parameters:
 *       - $ref: '#/components/parameters/offset'
 *       - $ref: '#/components/parameters/limit'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *             example:
 *               total: 2
 *               data:
 *                 - id: c43a3b0d-e794-4a9c-9c12-e35c6b62de4c
 *                   email: admin@dtech.com
 *                   firstName: John
 *                   lastName: Doe
 *                   role: ADMIN
 *                   invitationAccepted: true
 *                 - id: 2efa52e2-e9fd-4bd0-88bc-0132b2e837d9
 *                   email: admin2@dtech.com
 *                   firstName: John
 *                   lastName: Doe
 *                   role: ADMIN
 *                   invitationAccepted: false
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/orders', wrapAsync(async (req: Request, res: express.Response) => {
    const { limit, offset } = await Joi
        .object({
            offset: Joi.number().integer().default(0).failover(0).label('Offset'),
            limit: Joi.number().integer().default(10).failover(10).label('Limit'),
        })
        .validateAsync({
            offset: req.query.offset,
            limit: req.query.limit,
        });

    const [orders, total] = await getAllOrders(offset, limit);

    res.send({
        total,
        data: orders,
    });
}));

router.get('/orders/:orderId', wrapAsync(async (req: Request, res: express.Response) => {
    const { orderId } = await Joi
        .object({
            orderId: Joi.string().required().label('Order Id'),
        })
        .validateAsync({
            orderId: req.params.orderId,
        });

    const products = await getProductsByOrderId(orderId);

    res.send({
        data: products,
    });
}));

router.delete('/orders/:orderId', wrapAsync(async (req: Request, res: express.Response) => {
    const { orderId } = await Joi
        .object({
            orderId: Joi.string().required().label('Order Id'),
        })
        .validateAsync({
            orderId: req.params.orderId,
        });

    await deleteByOrderId(orderId);

    res.status(204).send();
}));

/**
 * @swagger
 * /orders:
 *   post:
 *     tags:
 *       - Order
 *     summary: Add Order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  description: Product Name
 *                  type: string
 *                  minimum: 3
 *                  maximum: 255
 *                price:
 *                  description: Product Price
 *                  type: number
 *                  minimum: 3
 *                  maximum: 255
 *                scale:
 *                  description: Product Scale
 *                  type: string
 *                  minimum: 3
 *                  maximum: 255
 *                quantity:
 *                  description: Product Quantity
 *                  type: number
 *                  minimum: 3
 *                  maximum: 255
 *                size:
 *                  description: Product Size
 *                  type: string
 *                  minimum: 3
 *                  maximum: 255
 *                brand:
 *                  description: Product Brand
 *                  type: string
 *                  minimum: 3
 *                  maximum: 255
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserInvitation'
 *             example:
 *               id: c43a3b0d-e794-4a9c-9c12-e35c6b62de4c
 *               email: user@client.com
 *               role: CLIENT
 *               invitationAccepted: true
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/orders', wrapAsync(async (req: Request, res: express.Response) => {
    const {
        products,
    } = await Joi
        .object({
            products: Joi.array().items(
                Joi.object({
                    productId: Joi.string().required(),
                    quantity: Joi.number().required(),
                })
            ).min(1).required(),
        })
        .validateAsync(req.body);

    const order = await createOrder(products);

    res.send({
        id: order.id,
        totalPrice: order.totalPrice,
    });
}));

export default router;
