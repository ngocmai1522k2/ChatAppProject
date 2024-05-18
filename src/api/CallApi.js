import axios from 'axios'


var api = axios.create({
    // IP của PC

    baseURL:'http://192.168.43.219:3001/api/user',
    // withCredentials: true 
    // baseURL:'http://192.168.1.13:3001/api/user'
})

var apiMessage = axios.create({
    baseURL:'http://192.168.43.219:3001/api/messages'
    // baseURL:'http://
})


var apiConversation = axios.create({
    baseURL:'http://192.168.43.219:3001/api/conversations'
    // baseURL:'http://
})

// export const getApiWithToken=(url)=>{
//     // const token = getUserStorage().token
//     const token = null;
//     return api.get(url, {
//         headers: {
//             "token":`${token}`
//         //   "Content-Type": "application/json",
//         //   Authorization: `Bearer ${token} `,
//         },
//       });
// }

// export const postApiWithToken=(url,data)=>{
//     // const token = getUserStorage().token
//     const token = null;
//     return api.post(url,data, {
//         headers: {
//             "token":`${token}`
//         //   "Content-Type": "application/json",
//         //   Authorization: `Bearer ${token} `,
//         },
//       });
// }
     
export const postApiNoneToken=(url,data)=>{
    return api.post(url,data)
}

export const uploadFile=(url,formdata,headers)=>{
    return api.post(url, formdata, headers)
}

export const getApiNoneToken=(url,data)=>{
    return api.get(url,data)
}

export const putApiNoneToken=(url,data)=>{
    return api.put(url,data)
}

export const getApiMessageNoneToken=(url,data)=>{
    return apiMessage.get(url,data)
}

export const postApiMessageNoneToken=(url,data)=>{
    return apiMessage.post(url,data)
}


// convesation
export const postApiapiConversation=(url,data)=>{
    return apiConversation.post(url,data)
}

export const getApiapiConversation=(url,data)=>{
    return apiConversation.get(url,data)
}

export const putApiapiConversation=(url,data)=>{
    return apiConversation.put(url,data)
}