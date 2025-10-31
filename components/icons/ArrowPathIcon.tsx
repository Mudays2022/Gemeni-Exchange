import React from 'react';

const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001a.75.75 0 0 1 .75.75v3.672c0 3.58-2.91 6.49-6.49 6.49H9.75a.75.75 0 0 1-.75-.75V18c0-.414.336-.75.75-.75h4.5a3.75 3.75 0 0 0 3.75-3.75V9.348Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.348H3.258v-.001a.75.75 0 0 0-.75.75v3.672c0 3.58 2.91 6.49 6.49 6.49H14.25a.75.75 0 0 0 .75-.75V18c0-.414-.336-.75-.75-.75h-4.5a3.75 3.75 0 0 1-3.75-3.75V9.348Z" />
  </svg>
);

export default ArrowPathIcon;