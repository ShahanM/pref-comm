import React from 'react';

const Spacing = ({ height = '20px' }) => {
  console.log("Rendering Spacing component with height:", height);
  return <div style={{ height, width: '100%' }} aria-hidden="true" />;
};

export default Spacing;