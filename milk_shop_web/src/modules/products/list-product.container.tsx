import React, { useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { CellProps } from 'react-table';

import { useDeleteModal } from '../../hooks/delete-modal';
import { GetProducts, Product, DeleteProduct } from '../../services/api-services/product';
import { DeleteButton, EditButton } from '../../shared/components/ActionButtons';
import { PaginatedTable } from '../../shared/components/tables/paginated-table';
import { ToastContext } from '../../shared/contexts/toast';

function ListProductsContainer(): JSX.Element {
  const setToast = useContext(ToastContext);

  const history = useHistory();

  const fn = useCallback((offset: number, limit: number) => GetProducts(offset, limit), []);

  const onDelete = useCallback(async (product: Product): Promise<void> => {
    try {
      await DeleteProduct(product.id);
      setToast({ type: 'success', message: 'Product deleted successfully' });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  }, [setToast]);

  const nameFn = useCallback((product: Product): string => product.name, []);
  const [DeleteModal, showDeleteModal] = useDeleteModal(onDelete, 'Delete Product', nameFn);

  const nameCell = (data: CellProps<Product>): JSX.Element => {
    const product = data.cell.row.original;

    return (
      <span>{product.name}</span>
    );
  };

  const quantityCell = (data: CellProps<Product>): JSX.Element => {
    const product = data.cell.row.original;

    return (
      <span>{product.quantity}</span>
    );
  };

  const priceCell = (data: CellProps<Product>): JSX.Element => {
    const product = data.cell.row.original;

    return (
      <span>{product.price}</span>
    );
  };

  const unitCell = (data: CellProps<Product>): JSX.Element => {
    const product = data.cell.row.original;

    return (
      <span>{product.scale ? product.scale : 'N/A'}</span>
    );
  };

  const action = (data: CellProps<Product>): JSX.Element | null => {
    const product = data.cell.row.original;

    return (
      <React.Fragment>
        <DeleteButton onClick={(): void => showDeleteModal(product)} />
        <EditButton onClick={(): void => history.push(`/edit-products/${product.id}`)} />
      </React.Fragment>
    );
  };

  const columns = [{
    Header: 'Name',
    Cell: nameCell,
  }, {
    Header: 'Available Quantity',
    Cell: quantityCell,
  }, {
    Header: 'Price per unit',
    Cell: priceCell,
  }, {
    Header: 'Unit',
    Cell: unitCell,
  }, {
    Header: ' ',
    Cell: action,
  }];

  return (
    <div className="shadow-box editable-table">
      <div className="header">
        <p>Products</p>
      </div>
      <PaginatedTable
        fn={fn}
        pageSize={10}
        columns={columns}
      />
      <DeleteModal />
    </div>
  );
}

export default ListProductsContainer;
