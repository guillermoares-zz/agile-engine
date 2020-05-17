import Alert from 'react-bootstrap/Alert';
import React from 'react';

export const STATUS_INFO_KIND = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error'
}

const ALERT_VARIANT_BY_KIND = {
  [STATUS_INFO_KIND.INFO]: 'info',
  [STATUS_INFO_KIND.ERROR]: 'danger',
  [STATUS_INFO_KIND.SUCCESS]: 'success'
}

const StatusInfo = ({message, kind}) => {
  return <Alert variant={ALERT_VARIANT_BY_KIND[kind]}>
    {message}
  </Alert>
}

export default StatusInfo