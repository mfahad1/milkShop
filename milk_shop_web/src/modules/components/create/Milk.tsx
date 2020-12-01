import { Formik, Form as FormikForm } from 'formik';
import React from 'react';
import { Button } from 'react-bootstrap';
import * as Yup from 'yup';

import { InputField } from '../../../shared/components/formik/InputField';

export function AddMilk(): JSX.Element {
  const initialValues = {
    name: '',
    keywords: [] as string[],
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().min(3).max(50).required('Required').label('Name'),
    keywords: Yup.array(
      Yup.string().trim().min(3).max(50).label('Keyword')
    ).required('Required').label('Keyword list'),
  });

  return (
    <div className="shadow-box">
      <h4>Add Milk</h4>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={() => {}}
      >
        {({ isSubmitting }): JSX.Element => (
          <FormikForm>
            <InputField type="number" name="quantity" label="Quantity (Liters)" disabled={isSubmitting} />
            <InputField type="number" name="price" label="Price" disabled={isSubmitting} />
            <Button type="submit" disabled={isSubmitting}>Add</Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
