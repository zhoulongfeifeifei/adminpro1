<template>
<div class="sidebar">
  <nav>
      <span class="logoArea"><img src="../assets/img/logo.png" class="logo">脸脸</span>
      <ul>
          <li>
              <a><i class="fa fa-diamond"></i>应用管理</a>
              <ul>
                  <li><router-link :to="{ name:'AppList' }">商家应用管理</router-link></li>
              </ul>
          </li>
          <li>
              <a><i class="fa fa-vcard-o"></i>商家管理</a>
              <ul>
                  <li><router-link :to="{ name:'ShopList' }">商家列表</router-link></li>
                  <li v-if="pData.gy"><router-link :to="{ name:'Menu'}" >菜单管理</router-link></li>
                  <li v-if="pData.gy"><router-link :to="{ name:'Role'}">角色管理</router-link></li>
                  <li v-if="pData.gy"><router-link :to="{ name:'Business'}">业态管理</router-link></li>
                  <li v-if="pData.gy"><router-link :to="{ name:'MemberLevel'}">等级管理</router-link></li>
                  <li v-if="pData.gy"><router-link :to="{ name:'Address'}">地点管理</router-link></li>
                  <li v-if="pData.gy"><router-link :to="{ name:'AuthVersionList'}">权限版本管理</router-link></li>
              </ul>
          </li>
          <li>
              <a><i class="fa fa-play-circle"></i>云播管理</a>
              <ul>
                  <li><router-link :to="{ name:'CloudList' }" style="color:#fff;">编播管理</router-link></li>
                  <li><router-link :to="{ name:'MaterialManageList' }" style="color:#fff;">素材管理</router-link></li>
                  <li><router-link :to="{ name:'PlayPlanList' }" style="color:#fff;">播放计划</router-link></li>
                  <li><router-link :to="{ name:'ScreenManage' }" style="color:#fff;">屏管理</router-link></li>
                  <li><router-link :to="{ name:'BaseLabelConfig' }" style="color:#fff;">基础标签配置</router-link></li>
              </ul>
          </li>
          <!-- <li>
              <a><i class="fa fa-vcard-o"></i><router-link :to="{ name:'MaterialManageList' }" style="color:#fff;">素材管理</router-link></a>
              <ul>
                  <li><router-link :to="{ name:'MaterialModify' }">素材修改记录</router-link></li>
              </ul>
          </li> -->
          <!-- <li>
              <a><i class="fa fa-vcard-o"></i><router-link :to="{ name:'Data' }" style="color:#fff;">数据</router-link></a>
          </li> -->
          <li>
              <a><i class="fa fa-desktop"></i>设备管理</a>
              <ul>
                  <li><router-link :to="{ name:'EquipMent' }" style="color:#fff;">设备管理</router-link></li>
              </ul>
          </li>
          <!-- <li>
              <a><i class="fa fa-vcard-o"><router-link :to="{ name:'Test' }" style="color:#fff;">tb</router-link></i>ces</a>
          </li> -->
      </ul>
  </nav>
  </div>
</template>
<script>
export default{
  name:"Sidebar",
  data(){
    return{
        num:'',
      pData:{gy:this.$route.query.gy?true:true}
    }
  },
  methods:{
    //   switch1 (ev) {
    //     if(this.num === ev){
    //         this.num = ''
    //     }else{
    //         this.num = ev
    //     }
    //   }
  }
}
</script>
<style type="text/scss" lang="scss">
.sidebar{
    position: fixed;
    left: 0;
    top: 0;
    width: 190px;
    height: 100%;
    bottom: 0;
    nav{
        height: 100%;
    }
}
</style>