<template>
  <section class="con">
    <figure>
      <figcaption>激活商家</figcaption>
      <div class="crumbs">
        <span>商家管理</span>
        <a href="/shop">商家列表</a>
        <a href="/shop/shopActiveList">地点列表</a>
        <a>激活商家</a>
      </div>
      <a href="/shop/shopActiveList" class="btn5  btn5-change"><i class="fa fa-reply"></i> 返回</a>
    </figure>
    <div class="box">
      <form>
        <h2 class="title1">商家基本信息</h2>
          <div class="form-group mb10">
            <label class="w100">商家ID：</label>
            <span class="mt8">{{data.shopId}}</span>
          </div>
          <div class="form-group mb10">
            <label class="w100">商家名称：</label>
            <span class="mt8">{{data.shopName}}</span>
          </div>
          
          <div class="form-group mb10">
            <label class="w100">地点属性：</label>
            <span class="mt8">{{data.shopTypeName}}</span>
          </div>
          <div class="form-group mb10">
            <label class="w100">经营类目：</label>
            <span class="mt8">
              {{data.category1Name}}
              {{data.category2Name?"/"+data.category2Name:""}}
              {{data.category3Name?"/"+data.category3Name:""}}
            </span>
          </div>
          <div class="form-group mb25">
            <label class="w100">地址：</label>
            <span class="mt8">{{data.address}}</span>
          </div>

        <h2 class="title1">商家账户信息</h2>

          <div class="form-group mb10">
            <label class="w100" id="BusinessTypeId">业态：</label>
            <span>
              <label v-for="d in data.businessType" :key="d.$index" v-if="d.name!='默认业态'">
                <input type="radio" name="radio" v-model="create.businessTypeId" :value="d.sid" />
                <em class="word l normal mr25 ml-10">{{d.name}}</em>
              </label>
              <em class="notice orange mt6">
                激活后，商家业态不可更改
                <i v-show="error.businessTypeIdError">* {{error.businessTypeIdError}}</i>
              </em>
            </span>
          </div>

          <div class="form-group mb40">
            <label class="w100" id="MemberLevelId">等级：</label>
            <span>
              <label v-for="d in data.memberLevel" :key="d.$index">
                <input type="radio" name="radio2" v-model="create.memberLevelId" :value="d.sid"/>
                <em class="word l normal mr25 ml-10">{{d.name}}</em>
              </label>
              <em class="notice mt6">
                <i v-show="error.memberLevelIdError">* {{error.memberLevelIdError}}</i>
              </em>
            </span>
          </div>
        <div class="form-group">
          <span class="ml115"></span>
          <button type="button" class="btn mw100" @click="Submit">立即激活</button>
        </div>
      </form>
    </div>

  </section>
</template>

<script>
import * as Api from "@/api/api"

const Swal=require("sweetalert2")

export default{
  name:"ShopActive",
  data(){
    return{
      pData:{shopId:this.$route.query.shopId},
      data:{},
      create:{businessTypeId:2, memberLevelId:0},
      error:{businessTypeIdError:"", memberLevelIdError:""}
    }
  },
  mounted(){
    let self=this;
    Api.Business().then(function(sj) {self.data.businessType=sj.data.object});                   // 获取业态
    Api.MemberLevel().then(function(sj) {self.data.memberLevel=sj.data.object;});                // 获取商家等级
    self.Initial();
  },
  methods:{
    ClearError(){
      this.error={businessTypeIdError:"", memberLevelIdError:""};
    },
    Initial(){                                                                                   // 初始化
      let self=this;
      Api.ShopInfo(
        {
          shopId:self.pData.shopId,
        }
      ).then(function(sj) {
        sj=PF.JsonFormat(sj.data)
        if(sj.status==0){
          let copy=self.data;
          self.data=sj.object;
          self.$set(self.data, "businessType", copy.businessType);
          self.$set(self.data, "memberLevel", copy.memberLevel);
        }else{
          Swal({title:"商家详情服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("商家详情请求服务器失败", "", "error")
      })
    },
    Submit(){
      let self=this;

      self.ClearError();
      if(self.create.businessTypeId===""){self.error.businessTypeIdError="请选择业态"; return PF.GoTo("BusinessTypeId");}
      if(self.create.memberLevelId===""){self.error.memberLevelIdError="请选择商家类型"; return PF.GoTo("MemberLevelId");}
      Api.ShopActive(
        {
          shopId:self.pData.shopId,
          businessTypeId:self.create.businessTypeId,
          memberLevelId:self.create.memberLevelId
        }
      ).then(function(sj) {
        sj=PF.JsonFormat(sj.data)
        if(sj.status==0){
          Swal({
            title:"激活成功",
            text:"2秒后自动关闭",
            type:"success",
            timer:"2000"
          }).then((result)=>{
            if(result.dismiss=="timer"||result.value==true){
              self.$router.push({path:"/shop"});
            }
          });
        }else{
          Swal({title:"激活商家服务器返回错误", text:sj.errorMsg, type:"error"});
        }
      }).catch(function(error) {
        Swal("激活商家请求服务器失败", "", "error")
      })
    }
  }
}
</script>
