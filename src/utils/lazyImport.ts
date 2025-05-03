
import { lazy, Suspense } from 'react';

// Helper pour créer des imports lazy avec un fallback personnalisé
export function lazyImport<
  T extends React.ComponentType<any>,
  I extends { [K2 in K]: T },
  K extends keyof I
>(factory: () => Promise<I>, name: K) {
  return Object.create({
    [name]: lazy(() => factory().then((module) => ({ default: module[name] }))),
  });
}

// Composant pour un lazy loading avec Suspense
export function LazyLoad({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <Suspense fallback={fallback || <div>Chargement...</div>}>{children}</Suspense>;
}
