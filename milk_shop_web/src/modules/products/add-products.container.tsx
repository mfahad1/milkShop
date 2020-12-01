import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';

import { CreateProduct, GetProductById, EditProduct } from '../../services/api-services/product';
import { Dropdown } from '../../shared/components/formik/Dropdown';
import { InputField } from '../../shared/components/formik/InputField';
import { ToastContext } from '../../shared/contexts/toast';

type AddProductRequest = {
  name: string;
  price: number;
  scale: string;
  quantity: number;
  size: string;
  brand: string;
}

function AddProductsContainer(): JSX.Element {
  const setToast = useContext(ToastContext);

  const { productId } = useParams();

  const [initialValues, setInitialValues] = useState({
    name: '',
    price: 0,
    scale: '',
    quantity: 0,
    size: '',
    brand: '',
  });
  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().min(1).max(50).required('Required').label('Name'),
    price: Yup.string().trim().min(1).max(50).required('Required').label('Price'),
    scale: Yup.string().trim().min(1).max(50).label('Scale'),
    quantity: Yup.string().trim().min(1).max(50).required('Required').label('Quantity'),
    size: Yup.string().trim().min(1).max(50).label('Size'),
    brand: Yup.string().trim().min(1).max(50).label('Brand'),
  });

  const productScale = ['Kilo', 'Liter', 'Dozen', 'Unit'];
  const productSizes = ['Small', 'Medium', 'Large', 'Extra Large'];

  useEffect(() => {
    async function fetchData(editId: string): Promise<void> {
      if (!editId) {
        throw new Error('Client ID not found');
      }

      try {
        const response = await GetProductById(editId);

        setInitialValues({
          name: response.name,
          price: response.price,
          scale: response.scale,
          quantity: response.quantity,
          size: response.size,
          brand: response.brand,
        });
      } catch (err) {
        setToast({ type: 'error', message: err.message });
      }
    }

    if (productId) {
      fetchData(productId);
    }
  }, [productId, setToast]);

  const onSubmit = async (product: AddProductRequest, { resetForm }: FormikHelpers<AddProductRequest>): Promise<void> => {
    try {
      if (productId) {
        await EditProduct(productId, product);
        setToast({ type: 'success', message: 'Product edited successfully' });
      } else {
        await CreateProduct(product);
        setToast({ type: 'success', message: 'Product created successfully' });
        resetForm();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="shadow-box">
      <div className="header">
        <p>{productId ? 'Edit' : 'Add New'} Product</p>
        <hr />
      </div>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }): JSX.Element => (
          <FormikForm>
            <InputField type="text" name="name" label="Name of Product" disabled={isSubmitting} />
            <InputField type="number" name="price" label="Price" disabled={isSubmitting} />
            <Dropdown label="Scale of product" name="scale" options={productScale} disabled={isSubmitting} />
            <InputField type="number" name="quantity" label="Quantity in number" disabled={isSubmitting} />
            <Dropdown label="size of product" name="size" options={productSizes} disabled={isSubmitting} />
            <InputField type="text" name="brand" label="Brand" disabled={isSubmitting} />
            <Button type="submit" disabled={isSubmitting}>{productId ? 'Edit' : 'Add'}</Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}

export default AddProductsContainer;
