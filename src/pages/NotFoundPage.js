import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import FadeIn from 'react-fade-in';

function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/not_found') {
      navigate('/not_found');
    }
  }, []);

  document.title = '404 - CraigsAdList';

  return (
    <FadeIn>
      <div
        align="center"
        style={{ marginTop: '40vh' }}
      >
        <h1>404</h1>
        <p>Sorry, the page you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    </FadeIn>
  );
}

export default NotFoundPage;
