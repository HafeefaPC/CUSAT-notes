import React from 'react'
import { Button } from 'flowbite-react';

const DownloadButton = ({ id, onClick }) => {
    return (
      <Button key={id} onClick={onClick}>
        {id}
      </Button>
    );
  };

export default DownloadButton