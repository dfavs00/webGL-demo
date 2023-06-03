import React from 'react';
import Render from './Components/Render';

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
