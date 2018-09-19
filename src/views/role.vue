<template>
  <section class="con">
    <roleAuth :show2="pData.show2" :role="pData.role" @Close="Close"></roleAuth>
    <createRole :show="pData.show" @Close="Close"></createRole>
    <figure>
      <figcaption>角色管理</figcaption>
    </figure>
    <div class="box">
      <div class="form-group mb20">
         <button type="button" class="btn w110 r" @click="Create">创建角色</button>
      </div>

      <div class="text-center" v-if="dataList==''"> <h2 class="ptb10p"><img src="../assets/img/load5.gif" class="w40 mr15"/>数据加载中...</h2> </div>
      <div class="text-center" v-if="dataList==null"> <h2 class="ptb10p">未查询到数据</h2> </div>
      <div v-if="dataList">
        <table class="tab">
          <tr>
            <th>角色</th>
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
  </section>
</template>

<script>
import Page from "@/components/page"
import CreateRole from "@/components/createRole"
import RoleAuth from "@/components/roleAuth"
import * as Api from "@/api/api"

const Swal=require("sweetalert2")

export default{
  name:"Role",
  data(){
    return{
      pData:{show:false, show2:false, role:""},
      search:{pageNo:1},
      dataList:""
    }
  },
  components:{
    "page":Page,
    "roleAuth":RoleAuth,
    "createRole":CreateRole
  },
  mounted(){
    this.Initial();
  },
  methods:{
    // 无分页，因此将分页隐藏
    /*Search(){this.search.pageNo=1; this.Initial()},                                              // 查询
    Change(val){this.search.pageNo=val; this.Initial();},                                        // 翻页
    Reset(){                                                                                     // 清空查询
      this.search.pageNo=1;
      this.Initial();
    },*/
    Initial(){                                                                                   // 初始化
      let self=this
      self.dataList=""
      
      Api.Role(
        {
          pageNo:self.search.pageNo
        }
      ).then(function(sj) {
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          self.dataList=sj.object;
          if(sj.object){
            self.search.pageNo=self.dataList.pageNo;
            self.dataList.forEach((obj,index)=>{
              try{
                obj.description=obj.description.replace(/\n/g, "<br>");
              }catch(e){}
            })
          }
        }else{
          Swal({title:"角色列表服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("角色列表请求服务器失败", "", "error")
      })
    },
    Create(){
      this.pData.show=true;
    },
    EditAuth(role){
      this.pData.show2=true;
      this.pData.role=role;
    },
    Close(msg){
      if(msg=="success"){this.Initial();}
      this.pData.show=false;
      this.pData.show2=false;
    }
  }
}
</script>
