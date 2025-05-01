import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import router from './RouteConfig';
import Loader from './UI/loader/Loader';
import { ErrorMessage } from './ErrorMessage/ErrorMessage';
import '../config/i18n';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrandingProvider } from '../hooks';

function App() {
  return (
    <ErrorBoundary fallbackRender={ErrorMessage}>
      <BrandingProvider>
        <Suspense fallback={<Loader />}>
          <RouterProvider router={router} />
        </Suspense>
      </BrandingProvider>
    </ErrorBoundary>
  );
}

export default App;
