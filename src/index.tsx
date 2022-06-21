import './style.scss';
import * as React from 'react';
import { Link } from 'react-router-dom';
import type { PiletApi} from 'sample-piral';

const Spaceshoot = React.lazy(() => import('./Spaceshoot'));

export function setup(app: PiletApi) {
  const path = '/spaceshoot';

  app.registerMenu?.(() => <Link to={path}>Spaceshoot</Link>);

  app.registerTile?.(
    () => (
      <Link to={path} className="spaceshoot-tile">
        Spaceshoot
      </Link>
    ),
    {
      initialColumns: 2,
      initialRows: 2,
    },
  );

  app.registerPage?.(path, Spaceshoot);
}
