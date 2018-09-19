<template>
  <div class="box2" v-show="pData.show">
      <div class="box2con w560">
        <h3>发布{{pData.versionNo}}权限版本</h3>
        <div class="text-center orange mb25">发布后开通的商户，其功能权限将按新版权限设置。</div>
        <div class="form-group2 mb25">
          <label class="w100">版本描述：</label>
          <span>
            <textarea id="description" onfocus="PF.CutString(this,200)" class="w350"></textarea>
          </span>
          <div class="ml115 text-left mt10">
            <em class="notice text-left">限200个字符或100个汉字<i class="ml20" v-show="error.descriptionError">* {{error.descriptionError}}</i></em>
          </div>
        </div>
        <div class="form-group mb30">
          <button type="button" class="btn w100 mr55" @click="Submit">立即发布</button>
          <button type="button" class="btn2 w100" @click="Close">取消</button>
        </div>
      </div>
    </div>
</template>
<script>
import * as Api from "@/api/api"
const Swal=require("sweetalert2")

export default{
  name:"PushAuth",
  data(){
    return{
      pData:{show:false, versionId:""},
      create:{description:""},
      error:{descriptionError:""}
    }
  },
  props:["show", "versionId", "versionNo"],
  watch:{
    "show":function(nVal, oVal){
      this.pData.show=this.show;
      this.pData.versionId=this.versionId;
      this.pData.versionNo=this.versionNo;
      document.querySelector("#description").value="";
    }
  },
  methods:{
    Submit(){
      let self=this;
      self.create.description=document.querySelector("#description").value;
      if(!self.create.description){self.error.descriptionError="请输入发布描述"; return PF.GoTo("description");}
      
      Api.PushAuth({
        versionId:self.pData.versionId,
        description:self.create.description
      }).then(function(sj) {
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          Swal({
              title:"发布成功",
              text:"2秒后自动关闭",
              type:"success",
              timer:2000
            }).then((result)=>{
              self.Close("success");
            })
        }else{
          Swal({title:"发布权限服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("发布权限请求服务器失败", "", "error")
      });
    },
    Close(msg){
      this.$emit("Close", msg);
    }
  }
}
</script>
