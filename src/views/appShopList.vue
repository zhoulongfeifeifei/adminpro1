<template>
  <section class="con">
    <figure>
      <figcaption>商户列表</figcaption>
      <div class="crumbs">
        <span>应用管理</span>
        <a href="/app">商家应用管理</a>
        <a>商家列表</a>
      </div>
      <a href="/app" class="btn5  btn5-change"><i class="fa fa-reply"></i> 返回</a>
    </figure>
    <div class="box">
      <form>
        <div class="l form-group mb15">
          <label>商家ID：</label>
          <input type="text" value="" id="shopId" maxlength="8" oninput="PF.Integer(this)"/>
        </div>
        <div class="l form-group mb15">
          <label>商家名称：</label>
          <input type="text" value="" id="shopName" onfocus="PF.CutString(this,60)"/>
        </div>
        <div class="l form-group mb15">
          <label>商家区域：</label>
          <select class="w100" v-model="search.provinceEncode" @change="ChangeCity(search.provinceEncode)">
            <option value="">--省--</option>
            <option v-for="d in data.province" :value="d.encoding" :selected="d.selected" :key="d.$index">{{ d.name }}</option>
          </select>

          <select class="w100" v-model="search.cityEncode">
            <option value="">--市--</option>
            <option v-for="d in data.city" :value="d.encoding" :key="d.$index">{{ d.name }}</option>
          </select>
        </div>
        <div class="form-group text-center">
          <button type="button" class="btn l w85 mr15" @click="Search"><i class="fa fa-search"></i>查询</button>
          <button type="button" class="btn2 l w85" @click="Reset">清空</button>
        </div>
      </form>
    </div>
    <div class="box">
      <div class="text-center" v-if="dataList==''"> <h2 class="ptb10p"><img src="../assets/img/load5.gif" class="w40 mr15"/>数据加载中...</h2> </div>
      <div class="text-center" v-if="dataList==null"> <h2 class="ptb10p">未查询到数据</h2> </div>
      <div v-if="dataList">
        <table class="tab">
          <tr>
            <th>应用</th>
            <th>正在使用商户</th>
            <th>操作</th>
          </tr>
          <tr v-for="d in dataList.objects" :key="d.$index">
            <td>霸屏</td>
            <td>8</td>
            <td class="op">
              <a @click="Info(d,'info')">功能管理</a>
              <a @click="Info(d,'edit')">设置权限</a>
            </td>
          </tr>
        </table>
        <div class="hidden mt20">
          <page :dataList="dataList" :search="search" @Change="Change"></page>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Page from "@/components/page"
import * as Api from "@/api/api"

const Swal=require("sweetalert2")

export default{
  name:"appShopList",
  data(){
    return{
      pData:{appId:this.$route.query.appId},
      search:{pageNo:1, shopId:"", shopName:"", provinceEncode:"", cityEncode:""},
      data:{province:"", city:""},
      dataList:""
    }
  },
  components:{
    "page":Page
  },
  mounted(){
    this.Initial();
  },
  methods:{
    Search(){this.search.pageNo=1; this.Initial()},                                              // 查询
    Change(val){this.search.pageNo=val; this.Initial();},                                        // 翻页
    Reset(){                                                                                     // 清空查询
      this.search.pageNo=1;
      document.querySelector("#shopId").value="";
      document.querySelector("#shopName").value="";
      this.search.provinceEncode="";
      this.search.cityEncode="";
      this.Initial();
    },
    Initial(){                                                                                   // 初始化
      let self=this
      self.dataList=""
      self.search.shopId=document.querySelector("#shopId").value;
      self.search.shopName=document.querySelector("#shopName").value;
      Api.AppList(
        {
          pageNo:self.search.pageNo,
          shopId:self.search.shopId,
          shopName:self.search.shopName,
          provinceEncode:self.search.provinceEncode,
          cityEncode:self.search.cityEncode
        }
      ).then(function(sj) {
        sj=PF.JsonFormat(sj.data)
        if(sj.status==0){
          self.dataList=sj.object
          if(sj.object){self.search.pageNo=self.dataList.pageNo}
        }else{
          Swal({title:"商家列表服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("商家列表请求服务器失败", "", "error")
      })
    },
    Info(d, status){
      if(!d){
        this.$router.push({name:"GameInfo"})
      }else{
        this.$router.push({path:"/game/gameInfo", query:{gameId:d.gameId, editFlag:d.editFlag, status:status}});
      }
    }
  }
}
</script>
