
let host = 'http://39.108.247.49:8081'
let proxy = '/api'

// document.cookie = ''
// document.cookie = 'JSESSIONID=5fac8c1f-cdb0-4c72-95e4-741f8e872977';

let api = {
    login() {
        let formData = new FormData();
        formData.append('username','18676666375')
        formData.append('password', '123456')
        formData.append('verifyCode','TC3B' )
        return new Promise((resolve, reject) => {
            $.ajax({
                url:proxy+'/login',
                type:"post",
                data:formData,
                dataType:"json",
                processData: false,
                contentType: false,
                cache:false,
                ifModified:true,
                success(data){
                    resolve(data)
                },
                error(err){
                    reject(err)
                }
            })
        })
    },
    getImageList() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type:"get",
                url:proxy+'/sys/material/list',
                data:{
                    limit:10,
                    offset:1
                },
                xhrFields: {
                    withCredentials: true
                },
                dataType:'json',
                success(data){
                    resolve(data)
                },
                error(err){
                    reject(err)
                }
            })
        })
    }
}