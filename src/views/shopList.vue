<template>
  <section class="con">
    <figure>
      <figcaption>商家列表</figcaption>
      <div class="crumbs">
        <span>商家管理</span>
        <a>商家列表</a>
      </div>
    </figure>
    <div class="box">
      <form>
        <!--文件上传组件 begin-->
          <!-- 默认只能上传XLS、XLSX -->
          <el-upload class="none" action="/api/permission/memberShop/export" accept="" :data="{token:pData.token}" :show-file-list="false" :on-success="UploadSuccess" :before-upload="beforeUpload" :disabled="!pData.edit"></el-upload>
        <!--文件上传组件 over-->

        <div class="l form-group mb15">
          <label>商家名称：</label>
          <input type="text" value="" id="shopName" onfocus="PF.CutString(this,60)"/>
        </div>

        <div class="l form-group mb15">
          <label>商家ID：</label>
          <input type="text" value="" id="shopId" maxlength="8" oninput="PF.Integer(this)"/>
        </div>

        <div class="l form-group mb15">
          <label>业态：</label>
          <select class="w100" v-model="search.businessTypeId">
            <option value="">全部</option>
            <option v-for="d in data.businessType" :value="d.sid" :key="d.$index">{{ d.name }}</option>
          </select>
        </div>

        <div class="l form-group mb15">
          <label>地点属性：</label>
          <select class="w100" v-model="search.shopTypeId">
            <option value="">全部</option>
            <option v-for="d in data.shopType" :value="d.sid" :key="d.$index">{{ d.name }}</option>
          </select>
        </div>

        <div class="l form-group mb15">
          <label>等级：</label>
          <select class="w100" v-model="search.memberLevelId">
            <option value="">全部</option>
            <option v-for="d in data.memberLevel" :value="d.sid" :key="d.$index">{{ d.name }}</option>
          </select>
        </div>
        <div class="clear"></div>
        <div class="form-group text-center">
          <button type="button" class="btn w120 mr15" @click="Search"><i class="fa fa-search"></i>查询</button>
          <button type="button" class="btn2 w120" @click="Reset">清空</button>
        </div>
      </form>
    </div>
    <div class="box">
      <div class="form-group mb20">
        <button type="button" class="btn2 w110 l" @click="ShopActive"><i class="fa fa-magic"></i> 激活商家</button>
        <button type="button" class="btn2 w110 r" @click="UpLoad()"><i class="fa fa-sign-in"></i> 批量导入</button>
        <a class="r mt8 gray mr15" href="../static/doc/示例.xlsx" target="_blank"> 示例格式</a>        
      </div>
      <div class="text-center" v-if="dataList==''"> <h2 class="ptb10p"><img src="../assets/img/load5.gif" class="w40 mr15"/>数据加载中...</h2> </div>
      <div class="text-center" v-if="dataList==null"> <h2 class="ptb10p">未查询到数据</h2> </div>
      <div v-if="dataList">
        <table class="tab">
          <tr>
            <th>商户名称</th>
            <th>商户ID</th>
            <th>业态</th>
            <th>地点属性</th>
            <th>等级</th>
            <th>操作</th>
          </tr>
          <tr v-for="d in dataList.objects" :key="d.$index">
            <td>{{d.shopName}}</td>
            <td>{{d.shopId}}</td>
            <td>{{d.businessTypeName}}</td>
            <td>{{d.shopTypeName}}</td>
            <td>{{d.memberLevelName}}</td>
            <td class="op">
              <a @click="ShopEdit(d)">编辑</a>
              <a @click="ShopEditAuth(d)" class="mr25">编辑权限</a>
              <a :href="'http://qrcode-b.dface.cn/#/materielManage/shopMateriel?shopId='+d.shopId">店铺二维码</a>
            </td>
          </tr>
        </table>
        <div class="hidden mt20">
          <page :dataList="dataList" :search="search" @Change="Change"></page>
        </div>
      </div>
    </div>
    <auth :show="pData.show" :shop="pData.shop" @Close="Close"></auth>
  </section>
</template>

<script>
import Page from "@/components/page"
import Auth from "@/components/auth"
import * as Api from "@/api/api"

const Swal=require("sweetalert2")

export default{
  name:"AppList",
  data(){
    return{
      search:{pageNo:1, pageRow:20, shopId:"", shopName:"", businessTypeId:"", shopTypeId:"", memberLevelId:""},
      pData:{doc:{size:1024000, accept:["xls","xlsx"], name:"doc"}, show:false, shop:""},
      data:{businessType:null, shopType:null, memberLevel:null},
      dataList:""
    }
  },
  components:{
    "page":Page,
    "auth":Auth
  },
  mounted(){
    let self=this;
    Api.Business().then(function(sj) {self.data.businessType=sj.data.object});                   // 获取业态
    Api.Address().then(function(sj) {self.data.shopType=sj.data.object;});                       // 获取地点属性
    Api.MemberLevel().then(function(sj) {self.data.memberLevel=sj.data.object;});                // 获取商家等级
    self.Initial();
  },
  methods:{
    UpLoad(){
      document.querySelector(".el-upload__input").click();        // 饿了么上传组件中<input type=file>的样式
    },
    beforeUpload(file){
      let type=file.name.toUpperCase().split(".")[1], pass=false, str="", i;
      for(i=0;i<this.pData.doc.accept.length;i++){
        this.pData.doc.accept[i]=this.pData.doc.accept[i].toUpperCase();
        if(type==this.pData.doc.accept[i]){
          pass=true; break;
        }
        str+=this.pData.doc.accept[i]+"/";
      }
      if(pass){
        if(this.pData.doc.size&&file.size>this.pData.doc.size){
          Swal({title:"文件容量超过上限", type:"error"});
          return false;
        }
      }else{
        str=str.substring(0,str.length-1);
        Swal({title:"只能上传"+str+"格式文件", type:"error"});
        return false;
      }
    },
    UploadSuccess(res, file){
      if(res.errorCode!=0){
        Swal({title:"上传失败", text:res.errorMsg, type:"error"});
      }else{
        if(res.object.length>0){
          let i=0,str="以下地点已激活，不可重复激活：";
          for (; i<res.object.length; i++) {
            str+=res.object[i]+"、"
          }
          str=str.substring(0, str.length-1);
          Swal({title:"上传失败", text:str, type:"error"});
        }else{
          Swal({title:"上传成功", type:"success"});
        }
        this.Initial();
      }
    },
    Search(){this.search.pageNo=1; this.Initial()},                                              // 查询
    Change(val){this.search.pageNo=val; this.Initial();},                                        // 翻页
    Reset(){                                                                                     // 清空查询
      this.search.pageNo=1;
      document.querySelector("#shopId").value="";
      document.querySelector("#shopName").value="";
      this.search.businessTypeId="";
      this.search.shopTypeId="";
      this.search.memberLevelId="";
      this.Initial();
    },
    Initial(){                                                                                   // 初始化
      let self=this
      self.dataList="";
      this.search.shopId=document.querySelector("#shopId").value;
      this.search.shopName=document.querySelector("#shopName").value;
      Api.ShopList(
        {
          pageRow:self.search.pageRow,
          pageNo:self.search.pageNo,
          shopId:self.search.shopId,
          shopName:self.search.shopName,
          businessTypeId:self.search.businessTypeId,
          shopTypeId:self.search.shopTypeId,
          memberLevelId:self.search.memberLevelId
        }
      ).then(function(sj) {
        sj=PF.JsonFormat(sj.data);
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
    ShopActive(){
      this.$router.push({path:"/shop/shopActiveList"});
    },
    ShopEdit(d){
      this.$router.push({path:"/shop/shopEdit", query:{shopId:d.shopId}});
    },
    ShopEditAuth(d){
      this.pData.show=true;
      this.pData.shop=d;
    },
    Close(){
      this.pData.show=false;
    }
  }
}
</script>
