<template>
  <div class="uploadMaterial">
    <!-- 新建 -->
      <el-dialog title="上传素材" :visible.sync="diaLogChange" :inline="true" :close-on-click-modal="false" :show-close="false">
        <el-tabs v-model="activeName">
          <el-tab-pane label="图片/视频/音频" name="video"></el-tab-pane>
          <el-tab-pane label="网页" name="webPage"></el-tab-pane>
          <el-tab-pane label="本地文件" name="localFile"></el-tab-pane>
        </el-tabs>
        <template v-if="activeName === 'video'">
          <ul class="ulList">
            <li v-for="(item,index) in videoList">
                <p class="fileList"><span>{{item.fileNames}}</span><span class="removeFileSpan" @click="removeFile(index)">删除</span></p>
                <el-form label-width="70px" label-position="right">
                  <el-form-item label="素材名称">
                    <el-input placeholder="不设置默认取文件名" style="width:80%;" v-model="item.name"></el-input>
                  </el-form-item>
                  <el-form-item label="素材标签">
                    <el-select v-model="item.matriaLabel" placeholder="餐厅广告" style="width:80%;" filterable allow-create>
                      <el-option v-for="item in materalLabelList" :key="item.tagId" :label="item.name" :value="item.tagId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
            </li>
          </ul>
        </template>
        <template v-if="activeName === 'webPage'">
          <ul class="ulList">
            <li v-for="(item,index) in webList">
                <p class="fileList"><span></span><span class="removeFileSpan" @click="removeFile(index)">删除</span></p>
                <el-form label-width="80px" label-position="right">
                  <el-form-item label="素材名称" :required='true'>
                    <el-input placeholder="网页名称" style="width:80%;" v-model="item.name"></el-input>
                  </el-form-item>
                  <el-form-item label="网页链接" :required='true'>
                    <el-input placeholder="输入网页链接" style="width:80%;" v-model="item.webLine"></el-input>
                  </el-form-item>
                  <el-form-item label="素材标签">
                    <el-select v-model="item.matriaLabel" placeholder="餐厅广告" style="width:80%;" filterable allow-create>
                      <el-option v-for="item in materalLabelList" :key="item.tagId" :label="item.name" :value="item.tagId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
            </li>
          </ul>
        </template>
         <template v-if="activeName === 'localFile'">
           <ul class="ulList">
            <li v-for="(item,index) in localList">
                <p class="fileList"><span></span><span class="removeFileSpan" @click="removeFile(index)">删除</span></p>
                <el-form>
                  <el-form-item label="素材名称" :required="true">
                    <el-input placeholder="素材名称" style="width:72%;" v-model="item.name"></el-input>
                  </el-form-item>
                  <el-form-item label="">
                    <span class="warm">输入本地文件全名，包括文件格式，例如：脸脸.jpg</span>
                  </el-form-item>
                  <el-form-item label="素材标签">
                    <el-select v-model="item.matriaLabel" placeholder="餐厅广告" style="width:75%;" filterable allow-create>
                      <el-option v-for="item in materalLabelList" :key="item.tagId" :label="item.name" :value="item.tagId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
            </li>
          </ul>
         </template>
         <div @click="getTokens">
           <el-upload class="upload-demo" icon="el-icon-plus" action="https://up.qiniup.com/" v-if="activeName === 'video'" :on-progress = 'onProgress' :before-upload='beforeUpload'
            :data="{token:token}" list-type="picture" :show-file-list="false" :on-success="success" :on-error="error" :disabled="uploadStatus" >
            <el-button class="addBtn" icon="el-icon-plus" :loading="uploadStatus">添加素材</el-button>
          </el-upload>
         </div>
         
        <el-button class="addBtn" icon="el-icon-plus" v-if="activeName === 'webPage'" @click="addPage">添加网页</el-button>
        <el-button class="addBtn" icon="el-icon-plus" v-if="activeName === 'localFile'" @click="localFiles">添加本地素材</el-button>
        <span slot="footer">
          <el-button type="primary" @click="uploadMaterial">立即上传</el-button>
          <el-button @click="cancelMaterial">取消</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
import * as Api from "@/api/api1"
const Swal=require("sweetalert2")
const lodash = require('lodash')
  export default{
    name:'UploadMaterial',
    props:['diaLogChange','materalLabelList'],
    data(){
      return{
        activeName:'video',
        token:'',
        qiniuKey:'',
        allFormat:['jpg','jpeg','gif','png','bmp','avi','rm','rmvb','wmv','mp4','flv','mov','dwv','dat','amv','mp3','wav','wma','wav','ogg','ape','acc'],
        uploadStatus:false,
        upIndex:'',//上传文件的索引
        allMaterial:[],
        videoList:[],
        webList:[],
        localList:[]
      }
    },
    // watch: {
    //   diaLogChange(){
    //     let obj = {}
    //     obj ={
    //       webLine:'',
    //         name:'',
    //         type:'网页',
    //         matriaLabel:''
    //     }
    //     this.webList=[obj]
    //     let obj1 ={}
    //     obj1 ={
    //       name:'',
    //         matriaLabel:'',
    //         type:'本地文件'
    //     }
    //     this.localList=[obj1]
    //   }
    // },
    methods:{
      uploadMaterial:lodash.debounce(function(){
        this.addFiles(this.allMaterial)
      },300),
      cancelMaterial(){ 
        this.$emit('closeDia',false)
        this.allMaterial = []
        this.videoList = []
        this.webList = []
        this.localList = []
      },
      onProgress(){
        this.uploadStatus = true
      },
      beforeUpload(file){
        let size = file.size
        let lens = file.name.split('.').length-1
        let fileFormat = file.name.split('.')[lens].toLowerCase()
        if(size >104857600 || size ==104857600){
          this.$message({
            message: '上传文件不能大于100M',
            type: 'warning'
          })
          this.uploadStatus = false
          return false;
        }else if(this.allFormat.indexOf(fileFormat) == -1){
          this.$message({
            message: '不支持该格式文件',
            type: 'warning'
          })
          this.uploadStatus = false
          return false;
        }
      },
      error(response, file, fileList){//上传文件
        this.$message({
          message: '上传失败',
          type: 'error'
        })
        this.uploadStatus = false 
      },
      success(response, file, fileList){
        let size = file.size
        if(size >104857600 || size ==104857600){
          this.$message({
            message: '上传文件不能大于100M',
            type: 'warning'
          })
        }else{
          let lens = file.name.split('.').length-1
          let fileFormat = file.name.split('.')[lens].toLowerCase()
          let obj = {}
          if(fileFormat === 'jpg' || fileFormat === 'jpeg' || fileFormat === 'gif' || fileFormat === 'png' || fileFormat === 'bmp'){
            obj.type = '图片'
          }else if(fileFormat === 'avi' || fileFormat === 'rm' || fileFormat === 'rmvb' || fileFormat === 'wmv' || fileFormat === 'mp4' || fileFormat === 'flv' || fileFormat === 'mov' || fileFormat === 'mtv' || fileFormat === 'dwv' || fileFormat === 'dat' || fileFormat === 'amv'){
            obj.type = '视频'
          }else if(fileFormat === 'mp3' || fileFormat === 'wav' || fileFormat === 'wma' || fileFormat === 'wav' || fileFormat === 'ogg' || fileFormat === 'ape' || fileFormat === 'acc'){
            obj.type = '音频'
          }else{
            obj.type = '未知'
          }
          if(obj.type == '未知'){
            this.$message({
              message: '不支持该格式文件',
              type: 'warning'
            })
            this.uploadStatus = false
          }else{
            this.$message({
              message: '上传成功',
              type: 'success'
            })
            this.uploadStatus = false
            let fileNames = []
            for(var i=0;i<lens;i++){
              fileNames.push(file.name.split('.')[i])
            }
            let nameFirst = fileNames.join('.')
            let nameFirsts = fileNames.join('.')
            let nameLast = file.name.split('.')[lens]
            if(nameFirst.length>15){
              nameFirst = nameFirst.slice(0,15)
            }
            obj.fileNames= nameFirst+'.'+nameLast
            obj.fileName= nameFirsts+'.'+nameLast
            obj.name = ''
            obj.url = 'http://fussen-qiniu.dface.cn/'+ file.response.key
            obj.matriaLabel = ''
            this.videoList.push(obj)
          }
        }
      },
      addPage: lodash.debounce(function(){//添加网页
      this.addFiles(this.webList)
      },300),
      localFiles: lodash.debounce(function(){//添加本地文件
        this.addFiles(this.localList)
      },300),
      removeFile(ev){//删除文件
        if(this.activeName === 'video'){
          this.videoList.splice(ev,1)
        }else if(this.activeName === 'webPage'){
          this.webList.splice(ev,1)
        }else if(this.activeName === 'localFile'){
          this.localList.splice(ev,1)
        }
      },
      addFiles(fileName){
        let len =fileName.length
        let Expression =/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
        let objExp=new RegExp(Expression)
        let obj={}
        if(fileName === this.webList){
          obj.webLine = ''
          obj.name =''
          obj.type = '网页'
          obj.matriaLabel = ''
        }else if(fileName === this.localList){
          obj.name =''
          obj.matriaLabel = ''
          obj.type = '本地'
        }
        if(fileName === this.webList || fileName === this.localList){
          if(fileName.length === 0){
            fileName.push(obj)
          }else if(fileName.length > 0){
            if(fileName[len-1].name === ''){
              this.$message({
                message: '网页名称不能为空',
                type: 'warning'
              })
            }else{
              if(fileName === this.webList){
                if(!objExp.test(fileName[len-1].webLine)){
                  this.$message({
                    message: '不支持该格式网页',
                    type: 'warning'
                  })
                }else{
                  fileName.push(obj)
                }
              }else if(fileName === this.localList){
                let localLens = fileName[len-1].name.split('.').length-1
                let fileNames = []
                let localName=fileName[len-1].name.split('.')[localLens]
                let localNameFirst=''
                  for(var p=0;p<localLens;p++){
                    fileNames.push(fileName[len-1].name.split('.')[p])
                  }
                  localNameFirst =fileNames.join('.')
                  // if(localNameFirst.length>15){
                    fileName[len-1].name.split('.').name = localNameFirst +'.'+localName
                  // }
                // let localName = fileName[len-1].name.split('.')[1]
                if(localName === undefined){
                  this.$message({
                    message: '文件名没输入后缀，请输入本地文件全名',
                    type: 'warning'
                  })
                }else{
                  if(this.allFormat.indexOf(localName.toLowerCase()) == -1){
                    this.$message({
                      message: '不支持该格式文件',
                      type: 'warning'
                    })
                  }else{
                    fileName.push(obj)
                  }
                }
              }
            }
          }
        }else{
          let noConditions = 0 //判断是否满足上传条件
          let webLen = this.webList.length
          let localLen = this.localList.length
          if(this.videoList.length > 0){
            for(let i = 0; i < this.videoList.length;i++){
              let objFile = {}
              objFile.name = this.videoList[i].name === '' ? this.videoList[i].fileName : this.videoList[i].name
              objFile.matriaLabel = this.videoList[i].matriaLabel
              objFile.type = this.videoList[i].type
              objFile.url = this.videoList[i].url
              this.allMaterial.push(objFile)
            }
          }
          if(webLen > 0){
            for(let i = 0; i < webLen;i++){
              let objFile = {}
              objFile.name = this.webList[i].name
              objFile.matriaLabel = this.webList[i].matriaLabel
              objFile.type = this.webList[i].type
              objFile.url = this.webList[i].webLine
              this.allMaterial.push(objFile)
            }
          }
          if(localLen > 0){
            for(let i = 0; i < localLen;i++){
              let objFile = {}
              objFile.name = this.localList[i].name
              objFile.matriaLabel = this.localList[i].matriaLabel
              objFile.type = this.localList[i].type
              objFile.url = ''
              this.allMaterial.push(objFile)
            }
          }
          if(this.allMaterial.length >0){
            for(let k in this.allMaterial){
              if(this.allMaterial[k].type === '网页'){
                if(this.allMaterial[k].name === ''){
                  this.$message({
                    message: '网页名称不能为空',
                    type: 'warning'
                  })
                  noConditions = 1;
                  this.allMaterial= []
                  break;
                }else if(this.allMaterial[k].type === '网页'){
                  if(!objExp.test(this.allMaterial[k].url)){
                    this.$message({
                    message: '网页格式不正确',
                    type: 'warning'
                  })
                  noConditions = 1;
                  this.allMaterial =[]
                  break;
                  }
                }
              }else if(this.allMaterial[k].type === '本地'){
                let localLens = this.allMaterial[k].name.split('.').length-1
                let fileNames = []
                let localName=this.allMaterial[k].name.split('.')[localLens]
                let localNameFirst=''
                  for(var p=0;p<localLens;p++){
                    fileNames.push(this.allMaterial[k].name.split('.')[p])
                  }
                   localNameFirst =fileNames.join('.')
                  // if(localNameFirst.length>15){
                    this.allMaterial[k].name = localNameFirst +'.'+localName
                  // }
                  if(localName === undefined){
                    this.$message({
                      message: '文件名没输入后缀，请输入本地文件全名',
                      type: 'warning'
                    })
                    this.allMaterial =[]
                    noConditions = 1;
                    break;
                  }else if(this.allFormat.indexOf(localName.toLowerCase()) == -1){
                    this.$message({
                      message: '本地文件名称格式不正确',
                      type: 'warning'
                    })
                    this.allMaterial =[]
                    noConditions = 1;
                    break;
                  }
              }
            }
          }else{
            noConditions = 1
            this.$message({
              message: '没有需要上传的东西',
              type: 'warning'
            })
          }
          if(noConditions === 0){
            this.findTags()
          }
        }
      },
      //上传接口获取token
      getTokens(){
        let self = this
        Api.uploadToken().then((res) =>{
          let data =res.data
          if(data.status === 0){
            self.load_data = false
            self.token = data.object
          }else{
            self.load_data = false
            Swal({
              text:data.errorMsg,
              allowOutsideClick:false
            })
          }
        }).catch((error) =>{
          self.load_data = false
          Swal({
            text:'请求服务器失败',
            allowOutsideClick:false
          })
        })
      },
      //上传文件
      saveMaterial(obj){
        let self = this
        Api.saveMaterial(obj).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.$emit('closeDia',false)
            self.allMaterial = []
            self.videoList = []
            self.webList = []
            self.localList = []
          }else{
            self.load_data = false
            self.$emit('closeDia',false)
            self.allMaterial = []
            self.videoList = []
            self.webList = []
            self.localList = []
            Swal({
              text:data.errorMsg,
              allowOutsideClick:false
            })
          }
        }).catch((error) =>{
          self.load_data = false
          Swal({
            text:'请求服务器失败',
            allowOutsideClick:false
          })
        })
      },
      //查询所有素材标签
      findTags(){
        let self =this
        Api.findTags().then((res) =>{
          let data =res.data
          if(data.status === 0){
            self.load_data = false
            for(var i in self.allMaterial){
              if(self.allMaterial[i].matriaLabel === ''){
                let obj ={}
                    obj.tagId = self.allMaterial[i].matriaLabel
                    obj.name = self.allMaterial[i].name
                    obj.url = self.allMaterial[i].url
                    if(self.allMaterial[i].type === '图片'){
                      obj.type =0
                    }else if(self.allMaterial[i].type === '音频'){
                      obj.type = 1
                    }else if(self.allMaterial[i].type === '视频'){
                      obj.type = 2
                    }else if(self.allMaterial[i].type === '网页'){
                      obj.type = 3
                    }else if(self.allMaterial[i].type === '本地'){
                      obj.type = 4
                    }else{
                      obj.type = 5
                    }
                this.saveMaterial(obj)
              }else if(typeof(self.allMaterial[i].matriaLabel) == 'number'){
                let obj ={}
                for(var j in data.object){
                  if(self.allMaterial[i].matriaLabel == data.object[j].name || self.allMaterial[i].matriaLabel  == data.object[j].tagId){
                    
                    self.allMaterial[i].matriaLabel=data.object[j].tagId
                    obj.tagId = self.allMaterial[i].matriaLabel
                    obj.name = self.allMaterial[i].name
                    obj.url = self.allMaterial[i].url
                    if(self.allMaterial[i].type === '图片'){
                      obj.type =0
                    }else if(self.allMaterial[i].type === '音频'){
                      obj.type = 1
                    }else if(self.allMaterial[i].type === '视频'){
                      obj.type = 2
                    }else if(self.allMaterial[i].type === '网页'){
                      obj.type = 3
                    }else if(self.allMaterial[i].type === '本地'){
                      obj.type = 4
                    }else{
                      obj.type = 5
                    }
                    this.saveMaterial(obj)
                    break;
                  }
                }
              }else{
                self.saveTag(self.allMaterial[i],i)
              }
            }
          }else{
            self.load_data = false
            Swal({
              text:data.errorMsg,
              allowOutsideClick:false
            })
          }
        }).catch((error) =>{
          self.load_data = false
          Swal({
            text:'请求服务器失败',
            allowOutsideClick:false
          })
        })
      },
      //保存标签
      saveTag(name,k){
        let self =this
        Api.saveTag({name:name.matriaLabel}).then((res) =>{
          let data = res.data
          if(data.status === 0){
            Api.findTags().then((res) =>{
              let data = res.data
              if(data.status === 0){
                if(data.object){
                  let objs ={}
                  for(let m in data.object){
                    if(name.matriaLabel == data.object[m].name){
                      name.matriaLabel=data.object[m].tagId
                      objs.tagId = name.matriaLabel
                      objs.name = name.name
                      objs.url = name.url
                      if(name.type === '图片'){
                        objs.type =0
                      }else if(name.type === '音频'){
                        objs.type = 1
                      }else if(name.type === '视频'){
                        objs.type = 2
                      }else if(name.type === '网页'){
                        objs.type = 3
                      }else if(name.type === '本地'){
                        objs.type = 4
                      }else{
                        objs.type = 5
                      } 
                      this.saveMaterial(objs)
                      break;
                    }
                  }
                }
              }else{
                self.load_data = false
                Swal({
                  text:data.errorMsg,
                  allowOutsideClick:false
                })
              }
            }).catch((error) =>{
              self.load_data = false
              Swal({
                text:'请求服务器失败',
                allowOutsideClick:false
              })
            })
          }else{
            self.load_data = false
            Swal({
              text:data.errorMessage,
              allowOutsideClick:false
            })
          }
        }).catch((error) =>{
          self.load_data = false
          Swal({
            text:'请求服务器失败',
            allowOutsideClick:false
          })
        })
      }
    }
  }
</script>
<style type="text/scss" lang="scss">
.uploadMaterial{
  .el-dialog{
    width: 400px;
    .ulList{
      max-height: 400px;
      overflow-y: scroll;
      li{
        background-color: #F5F7FA;
        padding: 10px;
        margin-bottom: 10px;
        .fileList{
          background-color: #F5F7FA;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .removeFileSpan:hover{
            cursor: pointer;
            color:#409EFF;
          }
        }
        .el-form-item{
          margin-bottom: 10px;
          .warm{
            width: 75%;
            display: inline-block;
            line-height: 20px;
            font-size: 12px;
            float:right;
          }
        }
      }
    }
    .el-upload{
      width: 100%;
    }
    .addBtn{
      width: 100%;
      margin-top: 10px;
    }
  }
  ::-webkit-scrollbar {
      width: 0px;
  }
}
</style>