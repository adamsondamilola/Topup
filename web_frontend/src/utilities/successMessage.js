import React, { Component } from 'react';
const SuccessMessage = (props) => {
return <div class="col-12 mt-3"> 
<div class="alert alert-success" role="alert">
  {props.message}
</div>
</div>
 }
export default SuccessMessage;
