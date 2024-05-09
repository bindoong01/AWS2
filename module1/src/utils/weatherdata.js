const request = require("request");
require("dotenv").config();

const weatherdata = (stationName,callback)=>{
    const url="http://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrInfo";           
    let querys='?'+encodeURIComponent('ServiceKey')+'='+process.env.WEATHER_KEY;  
    querys+='&' + encodeURIComponent('pageNo')+'='+encodeURIComponent("1");
    querys+='&' + encodeURIComponent('numOfRows')+'='+encodeURIComponent('10');
    querys+='&' + encodeURIComponent('dataType')+'='+encodeURIComponent('json'); 
    querys+='&' + encodeURIComponent('stnId')+'='+encodeURIComponent(stationName);
    const fullurl=url+querys;
    console.log('fullurl',fullurl);

    request(fullurl,(error,{body})=>{
        console.log('body ',body)
        const weather = JSON.parse(body);
        console.log('weather ',weather);
        callback(undefined,{
            weather:weather
        })
    })

   
}
module.exports = weatherdata;