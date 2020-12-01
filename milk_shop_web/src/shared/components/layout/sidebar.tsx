import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import './sidebar.scss';

function RoutingButtons(): JSX.Element {
  const history = useHistory();

  const [currentPath, setCurrentPath] = useState(history.location.pathname);

  useEffect(() => {
    const unlisten = history.listen(async (location): Promise<void> => {
      setCurrentPath(location.pathname);
    });

    return unlisten;
  }, [history]);

  const goto = (path: string): void => {
    history.push(path);
  };

  return (
    <nav className="sidebar">
      <Button className={`${currentPath === '/order' ? 'btn-secondary' : 'btn-primary'}`} onClick={(): void => goto('/order')}>Add New Order</Button>
      <Button className={`${currentPath === '/all-orders' ? 'btn-secondary' : 'btn-primary'}`} onClick={(): void => goto('/all-orders')}>View All Orders</Button>
      <Button className={`${currentPath === '/add-products' ? 'btn-secondary' : 'btn-primary'}`} onClick={(): void => goto('/add-products')}>Add New Product</Button>
      <Button className={`${currentPath === '/all-product' ? 'btn-secondary' : 'btn-primary'}`} onClick={(): void => goto('/all-product')}>View All Products</Button>
    </nav>
  );
}

export default RoutingButtons;
