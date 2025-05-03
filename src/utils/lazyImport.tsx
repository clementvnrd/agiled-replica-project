import React, { lazy, Suspense } from 'react';

/**
 * Helper pour créer des imports React lazy avec un fallback personnalisé.
 * Permet de charger dynamiquement un composant et de l'encapsuler dans un Suspense.
 *
 * Exemple d'utilisation :
 *   const { MyComponent } = lazyImport(() => import('./MyComponent'), 'MyComponent');
 *
 * Args:
 *   factory (() => Promise<I>): Fonction retournant une promesse du module.
 *   name (K): Nom du composant exporté par défaut dans le module.
 *
 * Returns:
 *   Un objet avec le composant lazy chargé.
 */
export function lazyImport<
  T extends React.ComponentType<any>,
  I extends { [K2 in K]: T },
  K extends keyof I
>(factory: () => Promise<I>, name: K) {
  return Object.create({
    [name]: lazy(() => factory().then((module) => ({ default: module[name] }))),
  });
}

/**
 * Composant utilitaire pour encapsuler un composant lazy dans un Suspense avec fallback.
 *
 * Args:
 *   children (React.ReactNode): Composant(s) à charger.
 *   fallback (React.ReactNode, optionnel): Fallback à afficher pendant le chargement.
 *
 * Returns:
 *   JSX.Element
 */
export function LazyLoad({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (<Suspense fallback={fallback || <div>Chargement...</div>}>{children}</Suspense>);
}
