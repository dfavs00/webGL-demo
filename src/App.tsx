import React from 'react';
import Render from './Render';

function App() {
  return (
    <>
      <div style={{display: "flex", justifyContent: 'space-between', gap: '1rem'}}>
        <Render loading={false}/>
      </div>
    </>
  )
}

export default App;
