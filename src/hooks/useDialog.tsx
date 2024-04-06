import { createPortal } from 'react-dom';
import React, { useState } from 'react';
import { css, cx } from '@emotion/css';

interface UseDialogOptions {
  children: React.ReactNode[];
  visible: boolean;
}

function Dialog({ children, visible }: UseDialogOptions) {
  return createPortal(
    visible ? <div className={cx(`
      bg-transparent w-screen h-screen z-1000 
      fixed top-0 right-0 
    `, css`
        transition: all 1s;
        backdrop-filter: blur(6px);
    `)}>{children}</div> : null,
    document.body,
    'useDialog',
  );
}

export function useDialog() {
  const [visible, setVisible] = useState(false);
  return [
    Dialog,
    visible,
    {
      close() {
        setVisible(() => false);
      },
      open() {
        setVisible(() => true);
      },
    },
  ];
}
