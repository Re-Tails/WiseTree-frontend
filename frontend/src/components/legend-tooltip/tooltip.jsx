import React from 'react';
import { useHistory } from 'react-router-dom';

import './tooltip.scss';

export default function Tooltip() {
  const history = useHistory();

  return (
      <div className="card__color-legend">
        <div className="card__color-legend__key">
          <div className="card__color-legend__box card__color-legend__tree"></div>
          <p className="card__color-legend__label">Tree</p>
        </div>
        <div className="card__color-legend__key">
          <div className="card__color-legend__box card__color-legend__strategy"></div>
          <p className="card__color-legend__label">Strategy</p>
        </div>
        <div className="card__color-legend__key">
          <div className="card__color-legend__box card__color-legend__lever"></div>
          <p className="card__color-legend__label">Lever</p>
        </div>
        <div className="card__color-legend__key">
          <div className="card__color-legend__box card__color-legend__horizon"></div>
          <p className="card__color-legend__label">Horizon</p>
        </div>
        <div className="card__color-legend__key">
          <div className="card__color-legend__box card__color-legend__injection"></div>
          <p className="card__color-legend__label">Injection</p>
        </div>
    </div>
  );
}
