<template>
  <section class="con">
    <figure>
      <figcaption>商家应用管理</figcaption>
      <div class="crumbs">
        <span>应用管理</span>
        <a>商家应用管理</a>
      </div>
    </figure>
    <div class="box">
      <form>
        <div class="form-group text-center">
          <label>应用名称：</label>
          <input type="text" v-model="search.date"/>
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
            <th width="33%">正在使用商户</th>
            <th width="33%">操作</th>
          </tr>
          <tr v-for="d in dataList.objects" :key="d.$index">
            <td>霸屏</td>
            <td><a @click="AppShopList" class="pointer">8</a></td>
            <td class="op1">
              <a @click="Fun(d,'info')">功能管理</a>
              <a @click="Auth(d,'edit')">设置权限</a>
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
  name:"AppList",
  data(){
    return{
      search:{pageNo:1, date:""},
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
      this.search.date="";
      this.Initial();
    },
    Initial(){                                                                                   // 初始化
      let self=this
      self.dataList=""
      
      Api.AppList(
        {
          pageNo:self.search.pageNo,
          date:self.search.date
        }
      ).then(function(sj) {
        sj=PF.JsonFormat(sj.data)
        if(sj.status==0){
          self.dataList=sj.object
          if(sj.object){self.search.pageNo=self.dataList.pageNo}
        }else{
          Swal({title:"比赛列表服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("比赛列表请求服务器失败", "", "error")
      })
    },
    AppShopList(d){
      this.$router.push({path:"/app/appShopList", query:{}});
    },
    Fun(d){
      this.$router.push({path:"/app/appFun", query:{}});
    },
    Auth(d){
      this.$router.push({path:"/app/appAuth", query:{}});
    }
  }
}
</script>
