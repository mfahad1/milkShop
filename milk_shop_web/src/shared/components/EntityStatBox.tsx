import * as FAS from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type EntityStatBoxPros = {
  entity: string;
  count: number;
  limit?: number;
  unit?: string;
};

export function EntityStatBox(props: EntityStatBoxPros): JSX.Element {
  const { entity, count, limit, unit } = props;

  let text = count ? count.toString() : '-';
  if (limit !== undefined) {
    text += ` / ${limit}`;
  }

  const lowLimit = count < 10;

  return (
    <div className={`shadow-box ${lowLimit ? 'text-danger' : ''}`}>
      <h4 className="space-between-y">
        {entity}
        {lowLimit &&
          <span className="text-danger">&nbsp;
            <FontAwesomeIcon icon={FAS.faExclamationCircle} size="lg" title="Limit Exceeded" />
          </span>}
      </h4>
      <div className="space-between-y">
        <span>
          {text} {unit ? unit : entity}

        </span>
      </div>
    </div>
  );
}
