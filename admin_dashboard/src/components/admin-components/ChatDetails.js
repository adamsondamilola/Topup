import React, { Component, useEffect, useRef, useState } from 'react';

import images from '../../constants/images';
import logos from '../../constants/logos';
import NumberToNaira from '../../constants/numberToNaira';
import urls from '../../constants/urls';
import dateFormat, { masks } from "dateformat";
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../../utilities/errorMessage';
import LoadingImage from '../loadingImage';
import SuccessMessage from '../../utilities/successMessage';
import FormatNumber from '../../constants/formatNumber';

const ChatDetails = () => {

    const id = useParams() 
    const bottomRef = useRef(null);
    
    const [userData, setUserData] = useState([]);
    const [usersDataList, setUsersDataList] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [amount, setAmount] = useState(100);
    const [numberOfCard, setNumberOfCard] = useState(1);
    const [token, setToken] = useState(localStorage.getItem('loginToken'));
    const [errMsg, setErrMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [chats, setChats] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [message, setMessage] = useState(null)
    const [phone, setPhone] = useState(null)
    const [messageId, setMessageId] = useState(null)

    const onEnter = (event) =>{
        if(event.keyCode === 13){
            replyMessage()
        }
              }

    const replyMessage = () => {
        setErrMsg(null)
        setSuccessMsg(null)
        setLoading(true)
    
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                phone: phone,
            message: message,
            message_id: messageId
             })
        };
        fetch(urls.apiurl +'admin/'+ token+'/replyChat/', postOptions)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json.status == 1) {
                            setMessage("")
                            setErrMsg(null)
                            setLoading(false)
                            getChatsList();
                        }
                        else {
                            setErrMsg(json.message)
                            setLoading(false)
                        }
                    })
                    .catch((error) => console.error(error))
                    .finally(() => setLoading(false));
    }


    const getUserDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'user/'+ token+'/user_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setUserData(json.result)
                    setWallet(json.result.wallet)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    
const getChatDetails = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/'+ id.id+'/opened_chat_details/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setPhone(json.result.phone)
                    setMessageId(id.id)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    const getChatsList = () => {
        setLoading(true)
        fetch(urls.apiurl +'admin/'+ token+'/'+ id.id+'/open_chats_by_message_id/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setChats(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }
   

    const getChatsListChecker = () => {
        fetch(urls.apiurl +'admin/'+ token+'/'+ id.id+'/open_chats_by_message_id/')
            .then((response) => response.json())
            .then((json) => {
                if (json.status == 1) {
                    setChats(json.result)
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }
   
    
   
    useEffect(()=>{
        getUserDetails();
        getChatDetails();
        getChatsList();
        if(token == null){
            window.location.replace("/login");
        }
    },[])

    useEffect(() => {
        const interval = setInterval(() => {
            getChatsListChecker();
        }, 10000); //10 secs
        return () => clearInterval(interval);
      }, []);

      useEffect(() => {
        //scroll to bottom every time chat changes
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
      }, [chats]);


    const getList =  <div class="row">					
        <div class="col-xl-12 col-12">
        <div class="box">
             <div class="box-body">
                 
                   {chats.map(usr =>
                   <div>
                      {usr.message_type == "inbound" ? <div class="d-flex flex-row text-left m-5"><div class="card bg-primary"><span className='m-2'>{usr.message}</span></div> </div> : null}
                      {usr.message_type == "outbound" ? <div class="d-flex flex-row-reverse text-right m-5"><div class="card bg-dark"><span className='m-2'>{usr.message}</span></div></div> : null}
                  </div>
                  )}

            </div>
        </div>
    </div>			

    {/*scroll to bottom*/}	
    <div ref={bottomRef} />
                </div>
    

    return <> <div class="wrapper">
        <div class="content-wrapper">
    <div class="container-full bg-white">
      <section class="content">
          <div class="row">
<b className='mb-3'>Phone: {phone}</b>
{ getList }
             
          </div>
      </section>



    </div>
</div>
</div>

<div class="col-xl-12 col-lg-12" style={{position: 'fixed', left: 0, right: 0, display: `inline-block`, zIndex:4000,
    bottom: 0}}>
                <div class="box">
                    <div class="box-body text-center">
                        <div class="input-group mb-3">
                            <input class="form-control" type="text" 
                             onChange={e => setMessage(e.target.value)} 
                             onKeyDown={e => onEnter(e)}
                            placeholder="Type Message" 
                            value={message} />
                            {isLoading? <LoadingImage /> 
                            : <button onClick={()=>{replyMessage()}} class="btn btn-primary btn-sm"> Send </button>
                            }
                            </div>
                            </div>
                            </div>
                            </div>

</>
;

}

export default ChatDetails;

const style = {
    logo: {width: 45, heiht: 45}
};