<template>
  <section class="con">
    <figure>
      <figcaption>等级管理</figcaption>
    </figure>
    <div class="box">
      <div class="text-center" v-if="dataList==''"> <h2 class="ptb10p"><img src="../assets/img/load5.gif" class="w40 mr15"/>数据加载中...</h2> </div>
      <div class="text-center" v-if="dataList==null"> <h2 class="ptb10p">未查询到数据</h2> </div>
      <div v-if="dataList">
        <table class="tab">
          <tr>
            <th>等级</th>
            <th width="33%">描述</th>
            <th width="33%">操作</th>
          </tr>
          <tr v-for="d in dataList" :key="d.$index">
            <td>{{d.name}}</td>
            <td v-html="d.description"></td>
            <td class="op">
              <a @click="EditAuth(d)">编辑权限</a>
            </td>
          </tr>
        </table>
        <!-- <div class="hidden mt20">
          <page :dataList="dataList" :search="search" @Change="Change"></page>
        </div> -->
      </div>
    </div>
    <memberLevelAuth :show="pData.show" :memberLevel="pData.memberLevel" @Close="Close"></memberLevelAuth>
  </section>
</template>

<script>
import Page from "@/components/page"
import MemberLevelAuth from "@/components/memberLevelAuth"
import * as Api from "@/api/api"

const Swal=require("sweetalert2")

export default{
  name:"MemberLevel",
  data(){
    return{
      pData:{show:false, class:""},
      search:{pageNo:1},
      dataList:""
    }
  },
  components:{
    "page":Page,
    "memberLevelAuth":MemberLevelAuth,
  },
  mounted(){
    this.Initial();
  },
  methods:{
    // 无分页，因此将分页隐藏
    /*Search(){this.search.pageNo=1; this.Initial()},                                            // 查询
    Change(val){this.search.pageNo=val; this.Initial();},                                        // 翻页
    Reset(){                                                                                     // 清空查询
      this.search.pageNo=1;
      this.Initial();
    },*/
    Initial(){                                                                                   // 初始化
      let self=this
      self.dataList=""
      
      Api.MemberLevel(
        {
          pageNo:self.search.pageNo
        }
      ).then(function(sj) {
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          self.dataList=sj.object;
          if(sj.object){
            self.search.pageNo=self.dataList.pageNo;
          }
        }else{
          Swal({title:"等级列表服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("等级列表请求服务器失败", "", "error")
      })
    },
    EditAuth(memberLevel){
      this.pData.show=true;
      this.pData.memberLevel=memberLevel;
    },
    Close(msg){
      this.pData.show=false;
    }
  }
}
</script>
