import * as FAS from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import * as Yup from 'yup';

import { Product } from '../../services/api-services/product';
import { InputField } from '../../shared/components/formik/InputField';

import './productInfo.scss';

type ProductInfoProps = {
  products: Product[];
  submit: (product: Product) => void;
}

export function ProductInfo(props: ProductInfoProps): JSX.Element {
  const { products, submit } = props;

  const [chosenProduct, setChosenProduct] = useState<Product>();

  useEffect(() => {
    setChosenProduct({...products[0]});
  }, [products]);

  const initialValues = {
    quantity: 1,
  };
  const validationSchema = Yup.object().shape({
    quantity: Yup.number().required('Required').label('Quantity'),
  });

  const onSubmit = (value: { quantity: number }, { resetForm }: FormikHelpers<{ quantity: number }>): void => {
    if (!value || !chosenProduct) return;
    submit({ ...chosenProduct, quantity: value.quantity });
    resetForm();
  };

  const chooseProduct = (item: Product): void => {
    const _chosenProduct = products.find(p => p.id === item.id);
    if (_chosenProduct) {
      setChosenProduct({..._chosenProduct});
    }
  };

  return (
    <div className="shadow-box product-info">
      <div className="header">
        <p>Add New Order</p>
        <hr />
      </div>
      <Form.Group>
        {/* <Form.Control as="select" value={chosenProduct && chosenProduct.id} onChange={chooseProduct}>
          <option>Choose Product</option>
          {products.map((item, key) => (
            <option key={key} value={item.id}>{item.name}</option>
          ))}
        </Form.Control> */}

        <div className="choose-product">
          {products.map((item, key) => (
            <Button key={key} onClick={(): void => chooseProduct(item)} className={chosenProduct && chosenProduct.id === item.id ? 'selected' : ''}>{item.name}</Button>
          ))}
        </div>
      </Form.Group>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }): JSX.Element => (
          <FormikForm>
            {
              chosenProduct && (
                <div className="form">

                  <Row>
                    <Col>
                      <InputField type="number" name="quantity" label="Quantity" />
                    </Col>
                    <Col>
                      <Form.Label>Scale</Form.Label>
                      <Form.Control value={chosenProduct.scale} disabled />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Label>Size</Form.Label>
                      <Form.Control value={chosenProduct.size} disabled />                    </Col>
                    <Col>
                      <Form.Label>Brand</Form.Label>
                      <Form.Control value={chosenProduct.brand} disabled />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} sm={6}>
                      <Form.Label>Price</Form.Label>
                      <Form.Control value={chosenProduct.price} disabled />
                    </Col>
                  </Row>

                </div>
              )
            }
            <Button type="submit" variant="success">
              <span>Add to cart</span>
              <FontAwesomeIcon icon={FAS.faArrowRight} />
            </Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
