import axios from "axios"

export default async({ url, data, method })=>{
    const Swal=require("sweetalert2")
    const Qs=require("qs")
    const request={
        method: method,
        url: url
    }
    if(method==="post") {
        request.data=Qs.stringify(data, { allowDots: true })
    } else if(method==="get") {
        request.params=Qs.parse(data)
    }
    return new Promise((resolve, reject)=>{
        axios(request).then((sj)=>{
            if(sj.data.status===1) {
                if(sj.data.errorCode==="1000") {
                    Swal("商家账号未登录，请登录后重试！","","error").then( (result) => {
                        // window.location.href=process.env.MAIN_URL // 否则全部重定向到登录页
                    });
                }else{
                    resolve(sj)
                }
            }else{
              resolve(sj)
            }
        }).catch((error)=>{
            reject(error)
        })
    })
}

