import React, { Component } from 'react';
const ErrorMessage = (props) => {
return <div class="col-12 mt-3"> 
<div class="alert alert-danger" role="alert">
  {props.message}
</div>
</div>
 }
export default ErrorMessage;
