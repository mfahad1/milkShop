import React from 'react';
import { Image } from 'react-bootstrap';

import MilkLogo from '../../resources/milk.png';

function Logo(): JSX.Element {
  return (
    <div className="logo-container">
      <Image src={MilkLogo} rounded />
      <p>
        MILK <span>SHOP</span>
      </p>
    </div>
  );
}

export default Logo;
