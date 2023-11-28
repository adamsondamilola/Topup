import React, { Component } from 'react';
import toastr from 'reactjs-toastr';
import 'reactjs-toastr/lib/toast.css';

const SuccessMessageAlert = (message) => {
return toastr.success(message, 'Successful!', {displayDuration:3000})
 }
export default SuccessMessageAlert;
