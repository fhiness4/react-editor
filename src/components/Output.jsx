import React from 'react';
import './Output.css';

const Output = ({ output }) => {
  return (
    <div className="output-wrapper">
      <div className="output-header">
        <h3>📺 Output Preview</h3>
      </div>
      <div className="output-frame">
        <iframe
          title="output"
          srcDoc={output}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          frameBorder="0"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default Output;