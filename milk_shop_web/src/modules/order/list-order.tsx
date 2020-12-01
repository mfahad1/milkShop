import React, { useContext, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CellProps } from 'react-table';

import { useDeleteModal } from '../../hooks/delete-modal';
import { GetOrders, Order, DeleteOrder } from '../../services/api-services/order';
import { DeleteButton, EditButton } from '../../shared/components/ActionButtons';
import { PaginatedTable } from '../../shared/components/tables/paginated-table';
import { ToastContext } from '../../shared/contexts/toast';

function ListOrderContainer(): JSX.Element {
  const setToast = useContext(ToastContext);

  const [refresh, setRefresh] = useState(true);

  const history = useHistory();

  const fn = useCallback((offset: number, limit: number) => GetOrders(offset, limit), [refresh]);

  const onDelete = useCallback(async (order: Order): Promise<void> => {
    try {
      await DeleteOrder(order.id);
      setToast({ type: 'success', message: 'Order deleted successfully' });
      setRefresh(!refresh);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  }, [setToast]);

  const nameFn = useCallback((order: Order): string => order.id, []);
  const [DeleteModal, showDeleteModal] = useDeleteModal(onDelete, 'Delete Product', nameFn);

  const nameCell = (data: CellProps<Order>): JSX.Element => {
    const product = data.cell.row.original;

    return (
      <span>{product.id}</span>
    );
  };

  const priceCell = (data: CellProps<Order>): JSX.Element => {
    const product = data.cell.row.original;

    return (
      <span>{product.totalPrice}</span>
    );
  };

  const action = (data: CellProps<Order>): JSX.Element | null => {
    const order = data.cell.row.original;

    return (
      <React.Fragment>
        <DeleteButton onClick={(): void => showDeleteModal(order)} />
        <EditButton onClick={(): void => history.push(`/edit-order/${order.id}`)} />
      </React.Fragment>
    );
  };

  const columns = [{
    Header: 'Name',
    Cell: nameCell,
  }, {
    Header: 'Total Price',
    Cell: priceCell,
  }, {
    Header: ' ',
    Cell: action,
  }];

  return (
    <div className="shadow-box editable-table">
      <div className="header">
        <p>Cart</p>
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

export default ListOrderContainer;
