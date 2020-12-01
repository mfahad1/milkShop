import React from 'react';
import {Row, Col } from 'react-bootstrap';

import { AddBread } from '../components/create/Bread';
import { AddEggs } from '../components/create/Eggs';
import { AddMilk } from '../components/create/Milk';
import { AddYogurt } from '../components/create/Yogurt';

function DashboardContainer(): JSX.Element | null {
  return (
    <React.Fragment>
      <Row>
        <Col md="6">
          <AddMilk />
        </Col>
        <Col md="6">
          <AddYogurt />
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <AddBread />
        </Col>
        <Col md="6">
          <AddEggs />
        </Col>
      </Row>

    </React.Fragment>
  );
}

export default DashboardContainer;
