import Joi from '@hapi/joi';
import express, { Router } from 'express';

import { createProduct, updateProduct, getProducts, deleteProduct, getProductById } from '../services/products';
import { wrapAsync } from '../utils/asyncHandler';

import { Request } from './interfaces';

const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get Products list
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
router.get('/products', wrapAsync(async (req: Request, res: express.Response) => {
    const { limit, offset } = await Joi
        .object({
            offset: Joi.number().integer().default(0).failover(0).label('Offset'),
            limit: Joi.number().integer().default(10).failover(10).label('Limit'),
        })
        .validateAsync({
            offset: req.query.offset,
            limit: req.query.limit,
        });

    const [products, total] = await getProducts(offset, limit);

    res.send({
        total,
        data: products,
    });
}));

/**
 * @swagger
 * /product:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get Product By Id
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
router.get('/product/:productId', wrapAsync(async (req: Request, res: express.Response) => {
    const { productId } = await Joi
        .object({
            productId: Joi.string().required().label('Product Id'),
        })
        .validateAsync({
            productId: req.params.productId,
        });

    const product = await getProductById(productId);

    res.send(product);
}));

/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - Product
 *     summary: Add Product
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
router.post('/products', wrapAsync(async (req: Request, res: express.Response) => {
    const {
        name,
        price,
        scale,
        quantity,
        size,
        brand,
    } = await Joi
        .object({
            name: Joi.string().required().label('Name'),
            price: Joi.number().required().label('Price'),
            scale: Joi.string().label('Scale').allow('', null),
            quantity: Joi.number().required().label('Quantity'),
            size: Joi.string().label('Size').allow('', null),
            brand: Joi.string().label('Brand').allow('', null),
        })
        .validateAsync(req.body);

    const product = await createProduct(
        name,
        price,
        scale,
        quantity,
        size,
        brand
    );

    res.send({
        price: product.price,
        scale: product.scale,
        quantity: product.quantity,
        size: product.size,
        brand: product.brand,
    });
}));

/**
* @swagger
 * /products/{productId}:
 *   put:
 *     tags:
 *       - Product
 *     summary: Update Product
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
router.put('/products/:productId', wrapAsync(async (req: Request, res: express.Response) => {
    const {
        productId,
        ...product
    } = await Joi
        .object({
            productId: Joi.string().required().label('Product Id'),
            name: Joi.string().required().label('Name'),
            price: Joi.number().required().label('Price'),
            scale: Joi.string().label('Scale').allow('', null),
            quantity: Joi.number().required().label('Quantity'),
            size: Joi.string().label('Size').allow('', null),
            brand: Joi.string().label('Brand').allow('', null),
        })
        .validateAsync({
            productId: req.params.productId,
            ...req.body,
        });

    const _product = await updateProduct(
        productId,
        product
    );

    res.send({
        price: _product.price,
        scale: _product.scale,
        quantity: _product.quantity,
        size: _product.size,
        brand: _product.brand,
    });
}));

/**
 * @swagger
 * /product/{productId}:
 *   delete:
 *     tags:
 *       - Product
 *     summary: Delete a Product
 *     security:
 *       - JWT: []
 *     parameters:
 *       - $ref: '#/components/parameters/clientId'
 *     produces:
 *       - application/json
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContentResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.delete('/product/:productId', wrapAsync(async (req: Request, res: express.Response) => {
    const { productId } = await Joi
        .object({
            productId: Joi.string().trim().uuid().required().label('Product ID'),
        })
        .validateAsync({
            productId: req.params.productId,
        });

    await deleteProduct(productId);

    res.send(204);
}));

export default router;
