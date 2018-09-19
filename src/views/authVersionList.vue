<template>
  <section class="con">
    <figure>
      <figcaption>权限版本管理</figcaption>
<!--       <div class="crumbs">
        <span>商家管理</span>
        <a>权限版本管理</a>
      </div> -->
    </figure>
    <div class="box">
      <div class="text-center" v-if="dataList==''"> <h2 class="ptb10p"><img src="../assets/img/load5.gif" class="w40 mr15"/>数据加载中...</h2> </div>
      <div class="text-center" v-if="dataList==null"> <h2 class="ptb10p">未查询到数据</h2> </div>
      <div v-if="dataList">
        <table class="tab">
          <tr>
            <th width="13%">版本号</th>
            <th width="40%">描述</th>
            <th width="12%">状态</th>
            <th width="15%">使用商家</th>
            <th>操作</th>
          </tr>
          <tr v-for="d in dataList.objects" :key="d.$index">
            <td>{{d.versionNo}}</td>
            <td v-html="d.description" class="wb text-left"></td>
            <td>{{d.statusDesc}}</td>
            <td><a @click="UseShopList(d)" class="pointer">{{d.useShopCount}}</a></td>
            <td class="op">
              <a @click="Check(d)">查看权限</a>
              <a @click="Push(d)" v-if="d.status==0">发布版本</a>
              <a @click="Reset(d)" v-if="d.status==0">重置权限</a>
            </td>
          </tr>
        </table>
        <div class="hidden mt20">
          <page :dataList="dataList" :search="search" @Change="Change"></page>
        </div>
      </div>
    </div>
    <pushAuth :show="pData.show" :versionId="pData.versionId" :versionNo="pData.versionNo" @Close="Close"></pushAuth>
  </section>
</template>

<script>
import Page from "@/components/page"
import PushAuth from "@/components/pushAuth"
import * as Api from "@/api/api"

const Swal=require("sweetalert2")

export default{
  name:"AuthVersionList",
  data(){
    return{
      pData:{show:false},
      search:{pageNo:1, pageRow:20},
      dataList:""
    }
  },
  components:{
    "page":Page,
    "pushAuth":PushAuth
  },
  mounted(){
    this.Initial();
  },
  methods:{
    Search(){this.search.pageNo=1; this.Initial()},                                              // 查询
    Change(val){this.search.pageNo=val; this.Initial();},                                        // 翻页
    Reset(){                                                                                     // 清空查询
      this.search.pageNo=1;
      this.Initial();
    },
    Initial(){                                                                                   // 初始化
      let self=this
      self.dataList=""
      
      Api.AuthVersionList(
        {
          pageNo:self.search.pageNo,
          pageRow:self.search.pageRow
        }
      ).then(function(sj) {
        sj=PF.JsonFormat(sj.data)
        if(sj.status==0){
          self.dataList=sj.object
          if(sj.object){
            self.search.pageNo=self.dataList.pageNo;
            self.dataList.objects.forEach((obj,index)=>{
              try{
                obj.description=obj.description.replace(/\n/g, "<br>");
              }catch(e){}
            });
          }
        }else{
          Swal({title:"权限版本列表服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("权限版本列表请求服务器失败", "", "error")
      })
    },
    UseShopList(d){
      this.$router.push({path:"/authVersionList/useShopList", query:{versionNo:d.versionNo, versionId:d.versionId}});
    },
    Check(d){
      this.$router.push({path:"/authVersionList/checkAuth", query:{versionNo:d.versionNo, versionId:d.versionId}});
    },
    Push(d){
      this.pData.show=true;
      this.pData.versionId=d.versionId;
      this.pData.versionNo=d.versionNo;
    },
    Close(msg){
      if(msg=="success"){this.Initial();}
      this.pData.show=false;
    },
    Reset(d){
      Swal({
        title:"确定重置版本"+d.versionNo+" 权限？",
        type:"warning",
        showCancelButton:true
      }).then((result)=>{
        //  result 的值：单击确定按钮时返回：{value:true}，单击取消按钮时返回：{dismiss:"cancel"}
        //  Swal.DismissReason：包含如下信息：{cancel:"cancel", backdrop:"overlay", close:"close", esc:"esc", timer:"timer"}
        if(result.value){
          Api.ResetAuth(
            {
              versionId:d.versionId
            }
          ).then(function(sj) {
            sj=PF.JsonFormat(sj.data)
            if(sj.status==0){
              Swal({title:"重置成功", text:"2秒后自动关闭", type:"success", timer:2000})            
            }else{
              Swal({title:"重置权限服务器返回错误", text:sj.errorMsg, type:"error"})
            }
          }).catch(function(error) {
            Swal("重置权限请求服务器失败", "", "error")
          })
        }
      })
    }
  }
}
</script>
