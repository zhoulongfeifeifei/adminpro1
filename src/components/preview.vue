<template>
  <div class="preview" >
    <el-dialog title="素材预览" :visible.sync="previewMateria" width="80%" :close-on-click-modal="false" @close="closeList1">
      <template v-if="previewInfo.type === 5">
        <div class="materilGroup clear">
          <div class="materilGroupLeft">
            <div class="materilGroupHead">
               <h3 style="font-size:22px;">{{previewInfo.name}}</h3>
               <i class="el-icon-close" @click="shouDown"></i>
            </div>
            <ul class="materilGroupList">
              <li v-for="(item,index) in previewInfo.options" @click="previewList(item,index)" :class="indexMa == index ? 'activeColor': ''">
                <p>{{item.name}}</p>
                <p style="padding-top:10px;">
                  <span v-show="item.planTimeHours !=='' || item.planTimeHours !=='--'">{{item.hour}}小时</span>
                  <span v-show="item.planTimeMinutes !=='' || item.planTimeMinutes !=='--'">{{item.minute}}分钟</span>
                </p>
              </li>
            </ul>
            <div class="materilBtn">
              <el-button type="primary" @click="shouDown">关闭</el-button>
            </div>
          </div>
          <div class="materilGroupRight">
            <div class='prevDiv' v-if="matrialGroupType === 0">
             <img :src="scr" alt="">
            </div>
            <video class="previewImg" ref="video" v-if="matrialGroupType === 2" :src="scr" controls="controls" autoplay="autoplay" loop="loop" id='myVideo'></video>
            <audio v-if="matrialGroupType === 1" ref="audio" :src="scr" controls="controls" autoplay="autoplay" loop="loop" id='myAudio' class='audioStyle'></audio>
          </div>
        </div>
      </template>
      <template v-if="previewInfo.type !== 5">
        <div class='prevDiv' v-if="previewInfo.type === 0">
          <img :src="previewInfo.url" alt="">
        </div>
        <video class="previewImg" v-if="previewInfo.type === 2" :src="previewInfo.url" controls="controls" autoplay="autoplay" loop="loop" id='myVideo1'></video>
        <audio v-if="previewInfo.type  === 1" :src="previewInfo.url" controls="controls" autoplay="autoplay" loop="loop" id='myAudio1' class='audioStyle'></audio>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  export default{
    name:'Preview',
    props:['previewMateria','previewInfo'],
    data(){
      return{
        scr:'',
        matrialGroupType:'',
        indexMa:0
      }
    },
    watch:{
      previewInfo(val){
        let item = val.options[0]
        this.matrialGroupType =item.type
        if(this.matrialGroupType === 4){
          this.$message({
            message: '本地文件无法预览',
            type: 'warning'
          })
        }else if(item.type === 3){
          window.open(item.url)
        }else{
          this.scr= item.url
        }
      }
    },
    methods:{
      // Initialize(){
      // if(this.previewInfo.matrialType ==='循环素材组'){
      //   this.scr = this.previewInfo.cycleMateralList[0].meteriaUrl
      //   this.matrialGroupType = this.previewInfo.cycleMateralList[0].matrialType
      // }
      // },
      previewList(item,index){
        this.indexMa = index
        this.matrialGroupType =item.type
        if(this.matrialGroupType === 4){
          this.$message({
            message: '本地文件无法预览',
            type: 'warning'
          })
        }else if(item.type === 3){
          window.open(item.url)
        }else{
          this.scr= item.url
        }
      },
      closeList1(){
        this.indexMa = 0
        if(this.previewInfo.type == 5){
          let myVideo = document.getElementById('myVideo')
          let myAudio = document.getElementById('myAudio')
          if(myAudio){
            myAudio.pause()
          }
          if(myVideo){
            myVideo.pause()
          }
        }else if(this.previewInfo.type == 1){
          let myAudio = document.getElementById('myAudio1')
          if(myAudio){
            myAudio.pause()
          }
        }else if(this.previewInfo.type == 2){
          let myVideo = document.getElementById('myVideo1')
          if(myVideo){
            myVideo.pause()
          }
        }
        this.$emit('closePreview',false)
      },
      shouDown(){
        this.indexMa = 0
        if(this.previewInfo.type == 5){
          let myVideo = document.getElementById('myVideo')
          let myAudio = document.getElementById('myAudio')
          if(myAudio){
            myAudio.pause()
          }
          if(myVideo){
            myVideo.pause()
          }
        }
        this.$emit('closePreview',false)
      }
    }
  }
</script>
<style type="text/scss" lang="scss">
.preview{
  .materilGroup{
    height: auto;
    .materilGroupLeft{
      float: left;
      width: 20%;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-top: 20px;
      .materilGroupHead{
        padding: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ccc;
      }
      .materilGroupList{
        max-height: 400px;
        overflow-y: scroll;
        ::-webkit-scrollbar {
          width: 1px;
        }
        li{
          padding: 20px;
           border-bottom: 1px solid #ccc;
        }
      }
      .materilBtn{
        margin-top: 30px;
        padding: 20px;
        background-color: #F5F5F6;
        text-align: center;
        .el-button{
          width: 80%;
        }
      }
    }
    .materilGroupRight{
      width:76%;
      min-height: 500px;
      float: right;
    }
  }
  .prevDiv{
    width: 100%;
    height: 600px;
    margin: 0 auto;
    // display: table-cell;
    text-align: center;
    vertical-align: middle;
    img{
      width:auto;
      height:auto;
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
    }
  }
  .previewImg{
    display: block;
    margin:0 auto;
    width:900px;
    height: 540px;
  }
  .audioStyle{
    width:400px;
  }
  .clear{
    clear: both;
  }
  .activeColor{
    border-right: 5px solid #409eff;
  }
}
</style>