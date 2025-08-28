'use client';

import { useEffect } from 'react';

export default function ClientBodyManager() {
  useEffect(() => {
    // This runs only on the client side
    // You can add any body class management logic here if needed
  }, []);

  return null; // This component doesn't render anything
}
