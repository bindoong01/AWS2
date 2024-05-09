const request = require("request");
require("dotenv").config();

const areadata = (stationName,callback)=>{
    const url="http://apis.data.go.kr/B551011/KorService1/locationBasedList1";           
    let querys='?'+encodeURIComponent('serviceKey')+'='+process.env.REST_API_KEY;  
    querys+='&' + encodeURIComponent('MobileOS')+'='+encodeURIComponent("ETC");
    querys+='&' + encodeURIComponent('MobileApp')+'='+encodeURIComponent('openapi');
    querys+='&' + encodeURIComponent('_type')+'='+encodeURIComponent('json'); 
    querys+='&' + encodeURIComponent('mapX')+'='+encodeURIComponent("127.07520308397633"); 
    querys+='&' + encodeURIComponent('mapY')+'='+encodeURIComponent("37.482864282545826");
    querys+='&' + encodeURIComponent('radius')+'='+encodeURIComponent(stationName);      
    const fullurl=url+querys;
    console.log('fullurl',fullurl);

    request(fullurl,(error,{body})=>{
        console.log('body ',body)
        const area = JSON.parse(body);
        console.log('area ',area);
        callback(undefined,{
            area:area
        })
    })

   
}
module.exports = areadata;