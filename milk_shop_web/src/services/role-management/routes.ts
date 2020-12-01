import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import * as FAS from '@fortawesome/free-solid-svg-icons';

import ListOrderContainer from '../../modules/order/list-order';
import AddProductsContainer from '../../modules/products/add-products.container';
import ListProductsContainer from '../../modules/products/list-product.container';
import WIP from '../../shared/components/WIP';

import { AddOrderContainer } from './../../modules/order/add-order.container';
import { UserRole } from './roles';

export type Route = {
  component: (props?: any) => JSX.Element;
  name: string;
  url: string;
  sidebar: boolean;
  icon?: IconDefinition;
  userRoles: UserRole[];
}

const routes: Route[] = [{
  component: AddOrderContainer,
  name: 'Order',
  url: '/order',
  sidebar: true,
  icon: FAS.faTachometerAlt,
  userRoles: [UserRole.ADMIN],
}, {
  component: ListOrderContainer,
  name: 'All Orders',
  url: '/all-orders',
  sidebar: true,
  icon: FAS.faReceipt,
  userRoles: [UserRole.ADMIN],
}, {
  component: ListProductsContainer,
  name: 'All Product',
  url: '/all-product',
  sidebar: true,
  icon: FAS.faReceipt,
  userRoles: [UserRole.ADMIN],
}, {
  component: AddProductsContainer,
  name: 'Add New Products',
  url: '/add-products',
  sidebar: true,
  icon: FAS.faReceipt,
  userRoles: [UserRole.ADMIN],
}, {
  component: AddProductsContainer,
  name: 'Edit Product',
  url: '/edit-products/:productId',
  sidebar: false,
  icon: FAS.faReceipt,
  userRoles: [UserRole.ADMIN],
}, {
  component: AddOrderContainer,
  name: 'Edit Order',
  url: '/edit-order/:orderId',
  sidebar: false,
  icon: FAS.faReceipt,
  userRoles: [UserRole.ADMIN],
},
];

export function getRoutes(): Route[] {
  return routes;
}
