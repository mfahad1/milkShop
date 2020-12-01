import { Formik, Form as FormikForm } from 'formik';
import React from 'react';
import { Button } from 'react-bootstrap';
import * as Yup from 'yup';

import { Dropdown } from '../../../shared/components/formik/Dropdown';
import { InputField } from '../../../shared/components/formik/InputField';

export function AddBread(): JSX.Element {
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

  const breadSizes = ['Small', 'Medium', 'Large', 'Extra Large'];

  return (
    <div className="shadow-box">
      <h4>Add Bread</h4>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={() => {}}
      >
        {({ isSubmitting }): JSX.Element => (
          <FormikForm>
            <InputField type="number" name="quantity" label="Quantity (Packs)" disabled={isSubmitting} />
            <Dropdown label="Type" name="type" options={breadSizes} disabled={isSubmitting} />
            <InputField type="text" name="branch" label="Brand" disabled={isSubmitting} />
            <InputField type="number" name="price" label="Price" disabled={isSubmitting} />
            <Button type="submit" disabled={isSubmitting}>Add</Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
