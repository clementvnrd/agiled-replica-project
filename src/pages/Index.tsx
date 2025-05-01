
import { Navigate } from 'react-router-dom';

// Redirect from index page to dashboard
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
