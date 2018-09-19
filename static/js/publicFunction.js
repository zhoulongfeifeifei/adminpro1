/*
    PublicFunction 1.8.6 基础函数库 目前实现

    （说明：下文中的PF就是PublicFunction的缩写）
     
    1、从页面地址栏获取值：UrlValue()
    2、判断浏览器类型以及它们的内核类型：BrowserName()
    3、JSON格式统一：JsonFormat()
    4、日期格式转换：DateFormat()
    5、截取字符串：CutString()
    6、整数输出：Integer()
    7、浮点数输出：Decimal()
    8、输出整型或字母：IntStr()
    9、输出英文、数字及英文状态下的标点：Engilsh()
    10、跳转到指定锚点：GoTo()
    11、设置localStorage/sessionStorage/cookie/url的值：Set()
    12、获取localStorage/sessionStorage/cookie/url的值：Get()
    13、Cookie设置函数集：Cookie{
                            Set() 设置cookie
                            Get() 获取cookie
                            Remove() 删除cookie
                            IsKey() cookie属性名是否存在
                            KeyName() 获得cookie属性列表
                        }
*/
 var  PF={
        timer: true,
        UrlValue:function(){
            var original, url={}, sub_url, i, n;
                original=window.location.search;
                original=original.substring(1);
                original=original.split("&");
     
            for(i=0;i<original.length;i++){
                original[i]=original[i].split("=");
                url[original[i][0]]=decodeURI(original[i][1]);
            }
            
            for(i in url){
                if(/^[A-za-z]+:\/\/\w+./.test(url[i])){
                    original=window.location.search;
                    original=original.split(url[i]);
                    if(original[1]){
                        url[i]=url[i]+original[1];
                    }
                    sub_url=url[i];
                    sub_url=sub_url.split("&");
                    sub_url[0]=sub_url[0].split("=");
                    url[sub_url[0][0]]=decodeURI(sub_url[0][1]);
                }
            }
            for(i in url){
                if(/%2F|%3F|%3D|/.test(url[i])){
                    url[i]=decodeURIComponent(url[i]);
                }
            }
            for(n in url){
                if(/^(https:\/\/)|(ftp:\/\/)|(http:\/\/)/.test(n)){
                    i=n;
                    n=n.split("?")[1];
                    url[n]=url[i];
                    delete url[i];
                }
            }
            return url;
        },
        BrowserName:function(){
            var bn=window.navigator.userAgent.toLowerCase(), bn2, bn3="无浏览器详细信息";
            if(/trident/i.test(bn)){
                bn2="ie";
                if(/msie/i.test(bn)){
                    bn3="ie10 lowVersion";
                }else{
                    bn3="ie11";
                }
            }else if(/webkit/i.test(bn)){
                bn2="webkit";
                if(/opr/i.test(bn)||/opera/i.test(bn)){
                    bn3="webkit-opera";
                }else if(/chrome/i.test(bn)){
                    bn3="webkit-chrome";
                }else if(/safari/i.test(bn)){
                    bn3="webkit-safari";
                }else if(/iphone/i.test(bn)&&/micromessenger/i.test(bn)){
                    bn3="webkit-iphone-micromessenger";
                }
            }else if(/firefox/i.test(bn)){
                bn2="firefox";
            }else if(/presto/i.test(bn)){
                bn2="presto";
            }else{
               bn2="其他浏览器";
            }
            return [bn2,bn3];
        },
        JsonFormat:function(data,style){
            var i,styleArray=style;
                if(styleArray){
                    styleArray=styleArray.split(",");
                }

            for(n in data){
                if(Object.prototype.toString.call(data[n])=="[object Object]"){
                    data[n]=PF.JsonFormat(data[n],style); continue;
                }
                if(Object.prototype.toString.call(data[n])=="[object Array]"){
                    data[n]=PF.JsonFormat(data[n],style); continue;
                }
                next=false;

                if(Object.prototype.toString.call(styleArray)!="[object Undefined]"){
                    if(styleArray==data[n]){
                        continue;
                    }
                    for(i=0;i<styleArray.length;i++){
                        if(data[n]==styleArray[i]){
                            next=true;
                            break;
                        }
                    }
                }

                if(next==true){ continue; }

                if(/^0\d+$/.test(data[n])){ continue; }

                if(/^\d+$/.test(data[n])){
                    if(parseInt(data[n])>999999999999999) { console.log(n+"字段：",data[n],"超出JavaScript精度范围，不予转换成整型"); continue; }
                    data[n] = parseInt(data[n]); continue; 
                }
                
                if(/^(\d+\.)?\d+$/.test(data[n])){ data[n] = parseFloat(data[n]); continue; }

                if(/^\s+$/.test(data[n])){data[n]=null; continue; }

                switch(data[n]){
                    case "true" : data[n]=true; break;
                    case "false" : data[n]=false; break;
                    case "" :
                    case "null" :
                    case "NULL" :
                    case "undefined" :
                    case "UNDEFINED" :
                    case undefined :  data[n]=null; break;
                }
            }
            return data;
        },
        DateFormat:function(date,number){       
            if(!date){
                date=new Date();
            }else{
                date=date.toString();
                date=date.replace(/(^\s*)|(\s*$)/g,"");
                if(date==1||date==2||date==3){
                    date=new Date();
                    number=date;
                }else{
                    if(/^\d+$/.test(date)){
                        date=new Date(parseInt(date));
                    }else{
                        var bn=PF.BrowserName();
                        if(bn[1]=='webkit-safari'||bn[0]=='ie'||bn[1]=='webkit-iphone-micromessenger'){
                            date=date.replace(/-/g,"/");
                        }
                        date=new Date(date);
                    }
                }
            }

            if(date.toString().match(/Invalid/i)){console.log("/*******传递的日期格式无效*******/");return data;}
            var year,month,day,hour,minute,second;
                year = date.getFullYear();
                month = date.getMonth() + 1;
                month = month < 10 ? "0"+month : month;
                day = date.getDate();
                day = day < 10 ? "0"+day : day;
                hour = date.getHours();
                hour = hour<10 ? "0"+hour : hour;
                minute=date.getMinutes();
                minute = minute<10 ? "0"+minute : minute;
                second=date.getSeconds();
                second = second<10 ? "0"+second : second;
            if(number==1||!number){
                return year+"-"+month+"-"+day;
            }else if(number==2){
               return year+"-"+month+"-"+day+" "+hour+":"+minute;
            }else if(number>=3){
                return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
            }
        },
        CutString:function(obj,max){
            var timer=setInterval(function(){
                console.log("检测字符数");
                var i=len=0;
                for(i=0;i<obj.value.length;i++){
                    len+=(obj.value[i].charCodeAt()<=127 ? 1 : 2 );
                    if(len>max){
                        obj.value=obj.value.slice(0,i);
                        return obj.value;
                    }
                }
            },200)
            obj.onblur=function(){
                clearInterval(timer);
                console.log("停止检测字符数");
            }
        },
        Integer:function(obj,min,max,change){
            if(!obj.value){return obj.value="";}
            clearTimeout(timer);
            var timer=setTimeout(function(){
                obj.value=obj.value.match(/\d+/g);
                obj.value=obj.value.split(",")[0];
                if(obj.value==""){return obj.value="";}
                if(!change){
                    obj.value=new Number(obj.value);
                }
                if(min){
                    if(min>obj.value){return obj.value="";}
                }
                if(max){
                    if(max<obj.value){return obj.value="";}
                }
                return obj.value;
            },200);
        },
        Decimal:function(obj,min,max,part,change){
            if(!obj.value){return obj.value="";}
            clearTimeout(timer);
            var timer=setTimeout(function(){
                obj.value=obj.value.match(/(\d+\.)?\d+/g);
                var number=obj.value.split(",")[0];
                if(part&&/\./.test(number)){
                    number=number.split(".");
                    obj.value=number[0]+"."+number[1].slice(0,part);
                    number=obj.value;
                }
                if(!change){
                    obj.value=Number(obj.value);
                }
                clearTimeout(timer);
                if(min){
                    if(min>number){return obj.value="";}
                }
                if(max){
                    if(max<number){return obj.value="";}
                }
                return obj.value;
            },1500);
        },
        IntStr:function(obj,len){
            obj.value=obj.value.match(/[\da-zA-Z]+/);
            if(len){
               obj.value=obj.value.slice(0,len); 
            }
            return obj.value;
        },
        English:function(obj,len){
            var str=obj.value;
            for(var i=0;i<obj.value.length;i++){
                if(obj.value[i].charCodeAt()>125){
                    obj.value=obj.value.slice(0,i); 
                }
            }
            if(len){
               obj.value=obj.value.slice(0,len)
            }
            return obj.value;
        },
        GoTo:function(name){
            var url=window.location.origin+window.location.pathname+window.location.search;            
            if(url.indexOf("#"+name)){
                url=url.replace("#"+name,"");
            }
            window.location.href=url+"#"+name;
        },
        Set:function(keyName, value, pattern=""){
          var str;
          if(window.location.search){
            if(new RegExp(keyName+"\\=[^&]*").test(window.location.search)){
              str=window.location.search.replace(new RegExp(keyName+"\\=[^&]*"), keyName+"="+value);
            }else{
              str=window.location.search+"&"+keyName+"="+value;
            }
            str=window.location.origin+window.location.pathname+str;
          }else{
            str=window.location.href+"?"+keyName+"="+value;
          }

          pattern=pattern.toUpperCase();
          switch(pattern){
            case "":
            case "L":
            case "LOCAL":
            case "LOCALSTORAGE": window.localStorage.setItem(keyName, value); console.log(keyName+"设置完成，模式：localStorage"); break;
            case "S":
            case "SESSION":
            case "SESSIONSTORAGE": window.sessionStorage.setItem(keyName, value); console.log(keyName+"设置完成，模式：sessionStorage"); break;
            case "C":
            case "COOKIE": PF.Cookie.Set(keyName, value); console.log(keyName+"设置完成，模式：cookie，生效需刷新"); break;
            case "U":
            case "URL": window.history.replaceState("","标题",str); console.log(keyName+"设置完成，模式：url链接，生效需刷新"); break;
            default: throw new Error("未能设置成功，可能模式不正确，目前仅支持：L(localStorage模式)、S(sessionStorage模式)、C(cookie模式)、U(url模式)");
          }
        },
        Get:function(keyName, pattern=""){
            var val="默认值";
            pattern=pattern.toUpperCase();

            if(/^(L|LOCAL|LOCALSTORAGE|\s*)$/.test(pattern)){
                val=window.localStorage.getItem(keyName);
                if(val){
                  console.log(keyName+"属性值，在localStorage模式取得");
                  return val;
                }
            }
            if(/^(S|SESSION|SESSIONSTORAGE|\s*)$/.test(pattern)){
                val=window.sessionStorage.getItem(keyName);
                if(val){
                  console.log(keyName+"属性值，在sessionStorage模式取得");
                  return val;
                }
            }
            if(/^(C|COOKIE|\s*)$/.test(pattern)){
                val=PF.Cookie.Get(keyName);
                if(val){
                  console.log(keyName+"属性值，在cookie模式取得");
                  return val;
                }
            }
            if(/^(U|URL|\s*)$/.test(pattern)){
                val=PF.UrlValue()[keyName];
                if(val){
                  console.log(keyName+"属性值，在url模式取得");
                  return val;
                }
            }
            if(val===null||val===undefined){
                console.log("在localStorage、sessionStorage、cookie、url中都未能获取到值");
            }else if(val=="默认值"){
                console.error("PF.Get()模式不正确，目前仅支持：L(localStorage模式)、S(sessionStorage模式)、C(cookie模式)、U(url模式)");
            }
        },
        Cookie:{
            Set:function(keyName, value, expiresTime, path="", domain="", secure=""){
                if(!keyName){
                    throw new Error("错误：cookie名称不能为空")
                }else if(/^(?:expires|max-age|path|domain|secure)$/i.test(keyName)){
                    throw new Error("错误：cookie名称中不能包含如下特殊字符：expires, max-age, path, domain, secure");
                }

                if(typeof expiresTime=="string" && /^\d+$/i.test(expiresTime)){expiresTime=parseInt(expiresTime);}
                var expires="max-age=86400";
                var _expiresTime;

                if(expiresTime){
                    switch (expiresTime.constructor){
                        case Number:
                            if(expiresTime===Infinity||expiresTime===-1) expires="expires=Fri, 31 Dec 9999 23:59:59 GMT";
                            else expires="max-age="+expiresTime;
                            break;
                        case String:
                            if(/^(?:\d{1,}(y|m|d|h|min|s))$/i.test(expiresTime)){
                                _expiresTime=expiresTime.replace(/^(\d{1,})(?:y|m|d|h|min|s)$/i, "$1");
                                switch(expiresTime.replace(/^(?:\d{1,})(y|m|d|h|min|s)$/i, "$1").toLowerCase()){
                                    case "y": expires="max-age="+_expiresTime*31104000; break;
                                    case "m": expires="max-age="+_expiresTime*259200; break;
                                    case "d": expires="max-age="+_expiresTime*86400; break;
                                    case "h": expires="max-age="+_expiresTime*3600; break;
                                    case "min": expires="max-age="+_expiresTime*60; break;
                                    case "s": expires="max-age="+_expiresTime; break;
                                    default: throw new Error("错误：cookie设置 expiresTime参数未知匹配错误");
                                }
                            }else{
                                _expiresTime=new Date(expiresTime);
                                if(_expiresTime.toString().match(/Invalid/i)){
                                    throw new Error("错误：cookie设置，expiresTime参数 输入字符串只支持：数字y|m|d|h|min|s 形式，0000-00-00 00:00:00形式");
                                }else{
                                    expires="expires="+_expiresTime.toUTCString();
                                }
                            }
                            break;
                        case Date:
                            expires="expires="+expiresTime.toUTCString();
                            break;
                    }
                }
                document.cookie=keyName+"="+escape(value).toString()+"; "+expires+"; domain="+domain+"; path="+path+"; "+secure;
            },
            Get:function(keyName){
                return unescape(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + keyName.replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1"))||null;
            },
            Remove:function(keyName, path="", domain=""){         
                if(!keyName||!PF.Cookie.IsKey(keyName)){
                  return false;
                }
                document.cookie=keyName+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain="+domain+"; path="+path;
                if(PF.Cookie.IsKey(keyName)){
                  confirm("未能删除，请指定"+keyName+"属性的path路径");
                  return false;
                }
                return true;
            },
            IsKey:function(keyName){
                return (new RegExp("(^|;\\s*)" + keyName.replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
            },
            KeyList:function(){
                if(!document.cookie) return [];
                var keyNames=document.cookie.replace(/\=[^\=;]*/g, "").split(/\s*;\s*/);
                var keyValuePair={};
                for(var i in keyNames){
                	keyValuePair[keyNames[i]]=PF.Cookie.Get(keyNames[i]);
            	}
            	return Object.assign({"keyNames":keyNames}, keyValuePair);
        	}
    	}
    }