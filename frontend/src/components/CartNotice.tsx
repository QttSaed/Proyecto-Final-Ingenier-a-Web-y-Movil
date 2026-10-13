import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function CartNotice({ open, onDismiss }: { open: boolean; onDismiss: () => void }) {
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(onDismiss, 2500);
    return () => window.clearTimeout(timer);
  }, [open, onDismiss]);

  if (!open) return null;
  return createPortal(
    <div role="status" aria-live="polite" className="cart-notice" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 100000, padding: '16px 24px', borderRadius: 8, background: '#174b32', color: '#fff', maxWidth: 'calc(100vw - 32px)', boxShadow: '0 4px 16px #0004' }}>
      Producto agregado al carrito
    </div>, document.body
  );
}
