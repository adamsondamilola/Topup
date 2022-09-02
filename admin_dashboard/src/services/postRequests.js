import React, { Component, useState } from 'react';
import urls from '../constants/urls';
const PostRequests = (apiLink, postOptions) => {

  const [getResponse, setGetResponse] = useState({});

  const refactorPostOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(postOptions)
};

  fetch(urls.apiurl + apiLink, refactorPostOptions)
                    .then((response) => response.json())
                    .then((json) => {
                      setGetResponse(json)  
                    })
                    .catch((error) => setGetResponse({status: 0, message: "An unknown error occured."}))
                    .finally(() => console.log("done"));

return getResponse;
 }

export default PostRequests;
