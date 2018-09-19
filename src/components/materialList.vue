<template>
  <div class="materiaList" v-loading="load_data" element-loading-text="拼命加载中">
    <el-dialog title="素材列表" :visible.sync="diaLogMateria" width="700px" :inline="true" :close-on-click-modal="false" @close="closeList">
      <el-form :inline="true">
        <el-form-item label="素材标题">
          <el-input placeholder="输入素材标题" v-model="materialTitle" style="width:150px;">
            <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
          </el-input>
        </el-form-item>
        <el-form-item label="素材类型">
          <el-select v-model="type" placeholder="全部" style="width:100px;">
            <el-option v-for="item in materalTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchMate">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="clearMate">清空</el-button>
        </el-form-item>
        <el-table :data="materalTable" style="margin-top:20px;">
          <el-table-column align="center" prop="name" label="素材标题"></el-table-column>
          <el-table-column align="center" prop="tagCN" label="素材标签"></el-table-column>
          <el-table-column align="center" prop="typeCN" label="素材类型"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="preview(scope.row)">预览</el-button>
              <el-button type="text" @click="chooseMaterial(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :pageSize="page.pageRow" layout="total, prev, pager, next"
            :total="page.total" prev-text="上页" next-text="下页" @current-change="pageChange" :current-page.sync="page.pageNo"></el-pagination>
      </el-form>
    </el-dialog>
    <!-- 预览   -->
    <preview  :previewMateria="previewMateria" :previewInfo='previewInfo' @closePreview='closePreview'></preview>
  </div>
</template>
<script>
import * as Api from "@/api/api1"
const Swal=require("sweetalert2")
const lodash = require('lodash')
import Preview from "@/components/preview"
  export default{
    name:'MaterialList',
    props:['diaLogMateria','materiaObject'],
    components:{'preview':Preview},
    data(){
      return{
        load_data:false,
        previewMateria:false, // 预览图片
        materialTitle:'',
        flag:true,
        page:{
          pageRow:0,
          pageNo:1,
          totalPageNo:0,
          total:0
        },
        type:'',
        previewInfo:{
          url:'',
          type:'',
        },
        materalTypeList:[
          {
            label: '图片',
            value: 0
          },
          {
            label: '视频',
            value: 2
          },
          {
            label: '网页',
            value: 3
          },
          {
            label: '音频',
            value: 1
          },
          {
            label: '本地文件',
            value: 4
          },
          {
            label: '素材组',
            value: 5
          }
        ],
        materalTable:[],
        chooseObj:{}
      }
    },
    watch: {
      materiaObject:{
        handler(obj){
          this.materalTable = obj.objects
          this.page.pageRow = obj.pageRow
          this.page.pageNo = obj.pageNo
          this.page.total = obj.total
          this.page.lastPage = obj.lastPage
        },
        deep: true
      }
    },
    methods:{
      searchMate: lodash.debounce(function(){
        this.load_data = true
        this.findMaterials(1)
        this.page.pageNo =1
      },300),
      clearMate: lodash.debounce(function(){
        this.load_data = true
        this.type = ''
        this.materialTitle = ''
        this.findMaterials(1)
        this.page.pageNo =1
      },300),
      pageChange(val){
        this.load_data = true
        this.page.pageNo = val
        this.findMaterials(val)
      },
      preview: lodash.debounce(function(scope){
        this.loadMaterial(scope.materialId,'预览')
      },300),
      closePreview: lodash.debounce(function(value){
         this.previewMateria= value
      },300),
      chooseMaterial: lodash.debounce(function(scope){
        if(this.flag){
          this.flag = false
           this.loadMaterial(scope.materialId,'选择')
        }
      },200),
      closeList(){
        this.load_data = false
        this.type = ''
        this.materialTitle = ''
        this.findMaterials(1)
        this.page.pageNo =1
        this.$emit('chooseMaterial',false)
      },
      //查询素材列表
      findMaterials(pageNo){
        let self =this
        let obj ={
          name:self.materialTitle,
          type:self.type,
          pageNo:pageNo
        }
        Api.findMaterials(obj).then((res) =>{
          let data =res.data
          if(data.status === 0){
            self.load_data = false
            if(data.object){
              self.page.pageRow = data.object.pageRow
              self.page.pageNo = data.object.pageNo
              self.page.total = data.object.total
              self.page.lastPage = data.object.lastPage
              self.materalTable = data.object.objects
            }else{
              self.page.pageNo = 1
              self.page.total = 0
              self.materalTable = []
            }
          }
        }).catch((error) =>{
          self.load_data = false
          Swal({
            text:'请求服务器失败',
            allowOutsideClick:false
          })
        })
      },
      //查询素材详情
      loadMaterial(materialId,chooseType){
        let self = this
        Api.loadMaterial(
          {materialId:materialId}
        ).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            if(chooseType === '预览'){
              if(data.object.type === 3){
                window.open(data.object.url)
              }else if(data.object.type === 4){
                self.$message({
                  message: '本地文件无法预览',
                  type: 'warning'
                })
              }else if(data.object.type === 0 || data.object.type === 1 || data.object.type === 2){
                self.previewMateria = true
                self.previewInfo= data.object
              }else{
                if(data.object.options.length === 0){
                  Swal({
                    text:'素材组为空',
                    allowOutsideClick:false
                  })
                }else{
                  self.previewMateria = true
                  self.previewInfo=data.object
                }
              }
            }else{
              if(self.materiaObject.addMaterial){
                if(data.object.type === 5){
                  Swal({
                    text:'不能选择循环素材组',
                    allowOutsideClick:false
                  })
                }else{
                  self.chooseObj =data.object
                  self.$emit('chooseMaterial',false,self.chooseObj)
                }
              }else{
                self.chooseObj =data.object
                self.$emit('chooseMaterial',false,self.chooseObj)
              }
            }
            setTimeout(() => {
              self.flag = true
            }, 800);
          }else{
            self.flag = true
            self.load_data = false
              Swal({
              text:data.errorMsg,
              allowOutsideClick:false
            })
          }
        }).catch((error)=>{
          self.flag = true
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