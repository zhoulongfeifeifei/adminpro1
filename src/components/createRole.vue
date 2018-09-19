<template>
  <div class="box2" v-show="pData.show">
      <div class="box2con w560">
        <h3>创建角色</h3>
        <div class="form-group2 mb10">
          <label class="w100">角色名称：</label>
          <span>
            <input type="text" id="name" onfocus="PF.CutString(this,50)"/>
            <em class="notice">限50字符<i v-show="error.nameError">* {{error.nameError}}</i></em>
          </span>
        </div>
        <div class="form-group2 mb25">
          <label class="w100">角色描述：</label>
          <span>
            <textarea id="description" onfocus="PF.CutString(this,200)" class="w180"></textarea>
            <em class="notice text-left">限200个字符或100个汉字<br/><i class="ml0" v-show="error.descriptionError">* {{error.descriptionError}}</i></em>
          </span>
        </div>
        <div class="form-group mb30">
          <button type="button" class="btn w100 mr55" @click="Submit">确定</button>
          <button type="button" class="btn2 w100" @click="Close">取消</button>
        </div>
      </div>
    </div>
</template>
<script>
import * as Api from "@/api/api"
const Swal=require("sweetalert2")

export default{
  name:"CreateRole",
  data(){
    return{
      pData:{show:false},
      create:{name:"", description:""},
      error:{nameError:"", descriptionError:""}
    }
  },
  props:["show"],
  watch:{
    "show":function(nVal, oVal){
      document.querySelector("#name").value="";
      document.querySelector("#description").value="";
      this.ClearError();
      this.pData.show=this.show;
    }
  },
  methods:{
    ClearError(){
      this.error={nameError:"", descriptionError:""};
    },
    Submit(){
      let self=this;
      self.ClearError();
      self.create.name=document.querySelector("#name").value;
      self.create.description=document.querySelector("#description").value;
      if(!self.create.name){self.error.nameError="请输入角色名称"; return false;}
      if(!self.create.description){self.error.descriptionError="请输入角色描述"; return false;}
      
      Api.CreateRole({
        name:self.create.name,
        description:self.create.description
      }).then(function(sj) {
        sj=PF.JsonFormat(sj.data);
        if(sj.status==0){
          Swal({
            title:"创建成功",
            text:"2秒后自动关闭",
            type:"success",
            showCancelButton:true,
            timer:"2000"
          }).then((result)=>{
            self.Close("success");
          })
        }else{
          Swal({title:"创建角色服务器返回错误", text:sj.errorMsg, type:"error"})
        }
      }).catch(function(error) {
        Swal("创建角色请求服务器失败", "", "error")
      });
    },
    Close(msg){
      this.$emit("Close", msg);
    }
  }
}
</script>
