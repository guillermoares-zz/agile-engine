import Button from 'react-bootstrap/Button';
import {Spinner} from 'react-bootstrap';
import React from 'react';

const RefreshButton = ({refreshAction, isRefreshing}) => {
  if (isRefreshing) {
    return (<Button size="lg" disabled>
      <Spinner
        as="span"
        animation="border"
        size="lg"
        role="status"
        aria-hidden="true"
      />
    </Button>)
  }

  return (<Button size="lg" onClick={refreshAction}>
    Refresh
  </Button>)
}

export default RefreshButton