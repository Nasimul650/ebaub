'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface DropdownMenuContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null);

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('DropdownMenu components must be used within a <DropdownMenu />');
  }
  return context;
}

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        (triggerRef.current && triggerRef.current.contains(target)) ||
        (contentRef.current && contentRef.current.contains(target))
      ) {
        return;
      }
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef, contentRef }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({
  asChild,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { open, setOpen, triggerRef } = useDropdownMenu();

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      ref: (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        const originalRef = (child as any).ref;
        if (typeof originalRef === 'function') originalRef(node);
        else if (originalRef) (originalRef as any).current = node;
      },
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        child.props.onClick?.(e);
        setOpen((prev) => !prev);
      },
      'aria-expanded': open,
      'aria-haspopup': true,
    });
  }

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      aria-expanded={open}
      aria-haspopup={true}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  children,
  className,
  align = 'end',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'center' | 'end' }) {
  const { open, triggerRef, contentRef } = useDropdownMenu();
  const [mounted, setMounted] = React.useState(false);
  const [coords, setCoords] = React.useState<{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    transform?: string;
  } | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const approxHeight = 220; // approximate menu height
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const newCoords: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
      transform?: string;
    } = {};

    // Determine vertical placement: open upwards if not enough space below
    if (spaceBelow < approxHeight && spaceAbove > spaceBelow) {
      newCoords.bottom = window.innerHeight - rect.top + 6;
    } else {
      newCoords.top = rect.bottom + 6;
    }

    // Determine horizontal alignment
    if (align === 'end') {
      newCoords.right = Math.max(12, window.innerWidth - rect.right);
    } else if (align === 'start') {
      newCoords.left = Math.max(12, rect.left);
    } else {
      newCoords.left = Math.max(12, rect.left + rect.width / 2);
      newCoords.transform = 'translateX(-50%)';
    }

    setCoords(newCoords);
  }, [align, triggerRef]);

  React.useEffect(() => {
    if (open) {
      updatePosition();

      const handleUpdate = () => updatePosition();
      window.addEventListener('resize', handleUpdate);
      window.addEventListener('scroll', handleUpdate, true);

      return () => {
        window.removeEventListener('resize', handleUpdate);
        window.removeEventListener('scroll', handleUpdate, true);
      };
    }
  }, [open, updatePosition]);

  if (!mounted || !open || !coords) return null;

  const style: React.CSSProperties = {
    position: 'fixed',
    zIndex: 99999,
    maxWidth: 'calc(100vw - 24px)',
    ...(coords.top !== undefined ? { top: `${coords.top}px` } : {}),
    ...(coords.bottom !== undefined ? { bottom: `${coords.bottom}px` } : {}),
    ...(coords.left !== undefined ? { left: `${coords.left}px` } : {}),
    ...(coords.right !== undefined ? { right: `${coords.right}px` } : {}),
    ...(coords.transform ? { transform: coords.transform } : {}),
  };

  return createPortal(
    <div
      ref={contentRef}
      role="menu"
      style={style}
      className={cn(
        'min-w-[12rem] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 text-slate-900 shadow-2xl ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95 duration-100',
        className
      )}
      {...props}
    >
      {children}
    </div>,
    document.body
  );
}

export function DropdownMenuItem({
  children,
  className,
  onClick,
  disabled,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { disabled?: boolean }) {
  const { setOpen } = useDropdownMenu();

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      onClick={(e) => {
        if (disabled) return;
        onClick?.(e);
        setOpen(false);
      }}
      className={cn(
        'relative flex cursor-pointer select-none items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold outline-hidden transition-colors hover:bg-slate-100 focus:bg-slate-100 text-slate-700 hover:text-slate-900',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('-mx-1.5 my-1 h-px bg-slate-100', className)}
      role="separator"
      {...props}
    />
  );
}
