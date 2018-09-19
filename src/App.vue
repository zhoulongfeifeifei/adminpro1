<template>
  <main id="Main">
    <sidebar/>
    <div>
      <header><a class="controlNav"><i class="fa fa-bars"></i></a></header>
      <router-view/>
    </div>
  </main>
</template>

<script>
import sidebar from "./components/sidebar"
export default {
  name: "Main",
  data(){
    return{
      pData:{gy:this.$route.query.gy},
    }
  },
  components: { sidebar },
  created () {
    if(PF.Get("gy")){ return false; }
    
    var link="";
    // if(PF.Cookie.IsKey("admin_token_")==false||PF.Cookie.IsKey("username")==false){
    //   if(this.pData.gy){return false;}
    //   switch(window.location.hostname){
    //     case "localhost":                      // 本地
    //     case "192.168.1.30": link="http://192.168.1.30:7132/#/login/signin"; break;                 // 测试
    //     case "adminpro.pre.dface.cn": link="http://bone.pre.dface.cn/#/login/signin"; break;        // 预发布
    //     default: link="http://bone.java.dface.cn/#/login/signin"; break;                            // 线上正式
    //   }
    //   window.location.replace(link);
    // }
  },
  mounted () {
    document.querySelector(".controlNav").onclick = () => {
      if (document.querySelector(".logoArea").parentNode.style.display === "none") {
        document.querySelector(".logoArea").parentNode.style.display = "block"
        document.body.removeAttribute("style")
        document.querySelector(".con").removeAttribute("style")
      } else {
        document.querySelector(".logoArea").parentNode.style.display = "none"
        document.body.style.background = "#f5f5f5"
        document.querySelector(".con").style.marginLeft = "20px"
      }
    }
    window.onscroll = function () {
      document.getElementsByTagName("nav")[0].style.marginTop = document.documentElement.scrollTop + "px"
    }
  }
}
</script>
<style lang="scss" type="text/scss">
  @import "./assets/css/main.scss"
</style>
