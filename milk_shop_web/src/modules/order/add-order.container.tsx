import * as FAS from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { CreateOrder } from '../../services/api-services/order';
import { GetProducts, Product, GetProductsByOrderId } from '../../services/api-services/product';
import { EntityStatBox } from '../../shared/components/EntityStatBox';
import { ToastContext } from '../../shared/contexts/toast';

import { ProductInfo } from './product-info';

import './add-order.container.scss';

export function AddOrderContainer(): JSX.Element {
  const setToast = useContext(ToastContext);

  const { orderId } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const response = await GetProducts(0, 100);

        setProducts(response.data);
      } catch (err) {
        setToast({ type: 'error', message: err.message });
      }
    }
    fetchData();
  }, [setToast]);

  useEffect(() => {
    async function fetchData(_orderId: string): Promise<void> {
      try {
        const response = await GetProductsByOrderId(_orderId);
        // setProducts(response.data);
        const _orders = response.data.map(_product => {
          const { orderProducts, ..._prod } = _product;

          return { ..._prod, ...{ price: +orderProducts.price, quantity: +orderProducts.quantity } };
        });

        setOrders(_orders);
      } catch (err) {
        setToast({ type: 'error', message: err.message });
      }
    }

    if (orderId) {
      fetchData(orderId);
    }
  }, [orderId]);

  const addOrder = (orderedProduct: Product): void => {
    const foundOrderIndex = orders.findIndex(o => o.id === orderedProduct.id);
    const originalProduct = products.find(p => p.id === orderedProduct.id);

    if (!originalProduct) {
      throw new Error('Product not found');
    }

    if (foundOrderIndex > -1) {
      const newOrderItems = [...orders];

      newOrderItems[foundOrderIndex].quantity = newOrderItems[foundOrderIndex].quantity + orderedProduct.quantity;
      newOrderItems[foundOrderIndex].price = originalProduct.price * newOrderItems[foundOrderIndex].quantity;
      setOrders(newOrderItems);
    } else {
      orderedProduct.price = originalProduct.price * orderedProduct.quantity;
      setOrders([...orders, orderedProduct]);
    }
  };

  const removeOrder = (id: number): void => {
    setOrders([...orders.slice(0, id), ...orders.slice(id + 1, orders.length)]);
  };

  const confirmOrder = async(): Promise<void> => {
    try {
      await CreateOrder({ products: orders.filter(o => o.quantity > 0).map(o => ({ productId: o.id, quantity: o.quantity })) });
      setToast({ type: 'success', message: 'Order placed successfully' });
      setOrders([]);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  const onProductEdit = (value: string, itemIndex: number): void => {
    const newOrderItems = [...orders];

    const originalProduct = products.find(p => p.id === newOrderItems[itemIndex].id);

    if (!originalProduct) {
      throw new Error('Product not found');
    }

    newOrderItems[itemIndex].quantity = +value;
    newOrderItems[itemIndex].price = originalProduct.price * newOrderItems[itemIndex].quantity;
    setOrders(newOrderItems);
  };

  return (
    <React.Fragment>
      <Row>
        <Col md="8">
          <ProductInfo products={products} submit={addOrder}/>
        </Col>
        <Col md="4">
          <div className="shadow-box">
            <div className="header">
              <p>Cart</p>
              <hr />
            </div>
            <div className="order-items">
              {orders.map((order, key) => (
                <div key={key} className="order-item">
                  <div className="order-quantity">
                    <div className="quantity"><input value={order.quantity} type="number" min="1" onChange={(e: React.ChangeEvent<HTMLInputElement>): void => onProductEdit(e.target.value, key)}/></div>
                    <div className="name">
                      <p>{order.name}</p>
                      <span>{`${order.quantity} ${order.scale}`}</span>
                    </div>
                    <div className="price">
                      Rs. <span>{order.price}</span>
                    </div>
                  </div>
                  <Button variant="danger" className="btn-lg-danger" onClick={() => removeOrder(key)}>
                    <span className="icon"><FontAwesomeIcon icon={FAS.faTimesCircle} /></span>
                    <span>Delete</span>
                  </Button>
                </div>
              ))}
            </div>

            <Button type="submit" variant="success" className="total" onClick={confirmOrder}>
              <span>Pay</span>
              <span className="amount">Rs. {orders.reduce((red, o) => red + o.price, 0.00) }</span>
            </Button>
          </div>
        </Col>
      </Row>

      <hr />
      <div className="shadow-box">
        <h3>Product Stats</h3>

        <Row>
          {products.map((product, key) => (
            <Col key={key} xs="3" lg="3" md="3">
              <EntityStatBox entity={product.name} count={product.quantity} unit={product.scale} />
            </Col>
          ))}
        </Row>
      </div>
    </React.Fragment>
  );
}
