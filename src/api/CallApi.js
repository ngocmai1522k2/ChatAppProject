import axios from 'axios'


var api = axios.create({
    // IP của PC

    baseURL:'http://192.168.42.184:3001/api/user',
    // withCredentials: true 
    // baseURL:'http://192.168.1.13:3001/api/user'
})

var apiMessage = axios.create({
    baseURL:'http://localhost:3001/api/messages'
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