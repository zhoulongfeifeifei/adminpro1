<template>
  <div class="playPlan">
    <section class="con">
      <figure>
        <div class="crumbs">
          <span>播放计划</span>
        </div>
      </figure>
      <div class="box" v-loading="load_data" element-loading-text="拼命加载中">
        <el-form :inline="true"label-position="top">
          <el-form-item label="素材标题">
            <el-input placeholder="输入素材标题进行搜索" v-model="formData.materalName">
              <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
            </el-input>
          </el-form-item>
          <el-form-item label="计划状态">
            <el-select v-model="formData.planStatu" placeholder="请选择">
              <el-option v-for="item in planStatuList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划时间">
            <el-date-picker v-model="formData.palnTime" type="date" placeholder="选择时间" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="计划类型">
            <el-select v-model="formData.playStatu" placeholder="请选择">
              <el-option v-for="item in playStatuList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域选择" style="display:none;">
            <el-cascader :options="areaChoose" change-on-select v-model="formData.workarea" @change="handleChange" ></el-cascader>
          </el-form-item>
          <el-form-item label="时间冲突" style='display:none;'>
              <el-checkbox v-model="formData.timeConflict" size="medium" label="1" border>时间冲突计划</el-checkbox>
          </el-form-item>
          <el-form-item label="投放商户">
            <el-input placeholder="输入投放商户" v-model="formData.useShopName">
              <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
            </el-input>
          </el-form-item>
          <el-form-item label="投放商户ID">
            <el-input type="number" placeholder="输入投放商户ID" v-model="formData.useShopId" oninput="if(value.length>8)value=value.slice(0,8)">
              <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
            </el-input>
          </el-form-item>
          <el-form-item label="屏">
            <el-select v-model="formData.allScreen" placeholder="请选择">
              <el-option v-for="item in allScreenList" :key="item.screenId" :label="item.screenName" :value="item.screenId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style='margin-top:50px;'>
              <el-button type="primary" icon="el-icon-search"  @click="seachScreen">搜索</el-button>
            </el-form-item>
            <el-form-item style='margin-top:50px;'>
              <el-button type="primary" icon="el-icon-search"  @click="clearScreen">清空</el-button>
            </el-form-item>
          <el-table :data='materialData' style="width: 100%">
              <el-table-column align="center" label="">
                <template slot-scope="scope">
                  <p v-if="scope.row.statusCN == '冲突计划'" class='conflictPlan'>{{scope.row.statusCN}}</p>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="materialName" label="标题"></el-table-column>
              <!-- <el-table-column align="center" label="创建人">
                <template slot-scope="scope"><p>{{scope.row.founder}}<span v-if="scope.row.founderPhone">({{scope.row.founderPhone}})</span></p></template>
              </el-table-column> -->
              <el-table-column align="center" prop="createTime" sortable label="创建时间"></el-table-column>
              <el-table-column align="center" prop="planDate" sortable label="计划时间">
                <template slot-scope="scope"><p>{{scope.row.planDate}} {{scope.row.startTime}}-{{scope.row.endTime}}</p></template>
              </el-table-column>
              <el-table-column align="center" prop="statusCN" label="计划状态"></el-table-column>
              <el-table-column align="center" prop="typeCN" label="计划类型"></el-table-column>
              <el-table-column align="center" prop="useShopLocation" label="投放区域"></el-table-column>
              <el-table-column align="center" label="投放商标/ID">
                <template slot-scope="scope"><p>{{scope.row.useShopName}}<span v-if="scope.row.useShopId">({{scope.row.useShopId}})</span></p></template>
              </el-table-column>
              <el-table-column prop="screenName" label="投屏"></el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                  <!-- <router-link :to="{ name: 'PlayPlanModify', query: {sid: scope.$index} }">
                      <el-button type="text">修改记录</el-button>
                  </router-link> -->
                </template>
              </el-table-column>
            </el-table>
            <el-pagination :pageSize="page.pageRow" layout="total, prev, pager, next"
            :total="page.total" prev-text="上页" next-text="下页" @current-change="pageChange" :current-page.sync="page.pageNo"></el-pagination>
             <!-- 预览   -->
             <preview  :previewMateria="previewMateria" :previewInfo='previewInfo' @closePreview='closePreview'></preview>
             <!-- 编辑 -->
            <el-dialog title='修改计划' :visible.sync="modifyPlanDia" :close-on-click-modal="false" class="diaLog">
              <el-form :inline="true" label-position="right">
                <el-form-item>
                  <h5>
                    <span>{{modifyForm.materialName}} <span class='spanBtn'>{{modifyForm.typeCN}}</span></span>
                    <!-- <el-button size="mini">{{modifyForm.typeCN}}</el-button> -->
                  </h5>
                </el-form-item>
                <el-form-item label="计划时间:" label-width="80px" class='notLatBtn'>
                  <el-time-picker style="width:80%;"
                    is-range
                    v-model="modifyForm.timeSelect"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围">
                  </el-time-picker>
                </el-form-item>
                <el-form-item label="计划内容:" label-width="80px" id="lastBtn">
                    <el-button type="primary" @click="previews(modifyForm.materialId)">预览</el-button>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editSave">保存</el-button>
                <el-button @click="deletePlan(modifyForm.planId)">取消</el-button>
              </span>
            </el-dialog>
        </el-form>
      </div>
    </section>
  </div>
</template>
<script>
import * as Api from "@/api/api1"
const Swal=require("sweetalert2")
const lodash = require('lodash')
import { regionData } from 'element-china-area-data'
import Preview from "@/components/preview"
  export default{
    name:'PlayPlanList',
    components:{
      'preview':Preview
    },
    data(){
      return{
        load_data:false,
        modifyPlanDia:false,
        previewInfo:{},//素材信息
        previewMateria:false, // 预览素材
        page:{
            pageRow:0,
            pageNo:1,
            totalPageNo:0,
            total:0
          },
        formData:{
          materalName:'',
          planStatu:'',
          palnTime:'',
          playStatu:'',
          allScreen:'',
          timeConflict:'',
          useShopName:'',
          useShopId:''
        }, 
        modifyForm:{//修改计划
          planId:'',
          screenId:'',
          materialId:'',
          materialName:'',
          type:'',
          typeCN:'',
          shopId:'',
          date:'',
          startTime:'',
          endTime:'',
          timeSelect:[],
          planContent:''
        },
        areaChoose:regionData,
        workarea:[],
        allScreenList:[],
        playStatuList:[
          {
            value: 0,
            label: '编播计划'
          },
          {
            value: 1,
            label: '插播计划'
          }
        ],
        planStatuList:[
            {
              value: 1,
              label: '正常计划'
            },
            {
              value: 2,
              label: '冲突计划'
            },
            {
              value: 3,
              label: '已播计划'
            }
          ],
        materialData:[]
      }
    },
    mounted() {
      this.load_data = true
      this.planFindList(1)
      this.screenFindPage(1)
    },
    methods:{
      handleChange(){

      },
      seachScreen(){
        this.load_data = true
        this.page.pageNo = 1
        this.page.total = 0
        this.planFindList(1)
      },
      clearScreen(){
        for(let i in this.formData){
          this.formData[i] = ''
        }
        this.$nextTick(() =>{
          this.load_data = true
          this.page.pageNo = 1
          this.page.total = 0
          this.planFindList(1)
        })
      },
      pageChange(val){
        this.load_data = true
        this.page.pageNo = val
        this.planFindList(val)
      },
      edit(scope){
        this.modifyForm.timeSelect = []
        this.modifyPlanDia = true
        this.modifyForm.planId =scope.planId
        this.modifyForm.screenId =scope.screenId
        this.modifyForm.materialId = scope.materialId
        this.modifyForm.materialName = scope.materialName
        this.modifyForm.type = scope.type
        this.modifyForm.typeCN = scope.typeCN
        this.modifyForm.shopId = scope.operationShopId
        this.modifyForm.date = scope.planDate
        this.modifyForm.startTime = scope.startTime
        this.modifyForm.endTime = scope.endTime
        this.modifyForm.timeSelect[0] =scope.planDate+' '+scope.startTime
        this.modifyForm.timeSelect[1] =scope.planDate+' '+scope.endTime
      },
      editSave:lodash.debounce(function(){
        let startTime = this.modifyForm.startTime
        let endTime = this.modifyForm.endTime
        if (startTime == '' || endTime =='') {
          this.$message({
            message: '请选择结束时间',
            type: 'warning'
          })
        }else if(startTime == endTime){
          this.$message({
            message: '开始时间不能等于结束时间',
            type: 'warning'
          })
        }else{
          this.updatePlan()
        }
      },300),
      deletePlan(){
        this.modifyPlanDia = false
        for(let i in this.modifyForm){
          if(i === 'timeSelect'){
            this.modifyForm[i] = []
          }else{
            this.modifyForm[i] = ''
          }
        }
      },
      //预览
      previews(materialId){
        if(materialId == ''){
          this.$message({
            message: '素材id不能为空',
            type: 'warning'
          })
        }else{
          this.loadMaterial(materialId)
        }
      },
      closePreview(value){
         this.previewMateria= value
      },
      planFindList(pageNo){
        let self = this
        let datas = ''
        if(self.formData.palnTime !==''){
          datas = self.formData.palnTime
        }
        Api.planFindList(
          {
            pageNo:pageNo,
            materialName:self.formData.materalName,
            status:self.formData.planStatu,
            type:self.formData.playStatu,
            date:datas,
            screenId:self.formData.allScreen,
            useShopId:self.formData.useShopId,
            useShopName:self.formData.useShopName
          }
        ).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            if(data.object){
              self.page.pageRow = data.object.pageRow
              self.page.pageNo = data.object.pageNo
              self.page.total = data.object.total
              self.page.lastPage = data.object.lastPage
              self.materialData = data.object.objects
            }else{
              self.materialData = []
              self.page.total = 0
              self.load_data = false
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
      //查看屏列表
      screenFindPage(pageNo){
        let self = this
        Api.screenFindPage(
          {
            pageNo:pageNo,
            operationShopId:40261649
          }
        ).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            if(data.object){
              self.allScreenList = data.object.objects
            }else{
              self.allScreenList = []
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
      //修改计划
      updatePlan(){
        let self = this
        Api.updatePlan(
          {
            planId:self.modifyForm.planId,
            shopId:self.modifyForm.shopId,
            materialId:self.modifyForm.materialId,
            type:self.modifyForm.type,
            date:self.modifyForm.date,
            startTime:self.modifyForm.startTime,
            endTime:self.modifyForm.endTime,
            screenId:self.modifyForm.screenId
          }
        ).then((res) =>{
          let data = res.data
          if(data.status == 0){
            self.modifyPlanDia = false
            self.load_data = false
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
          }else{
            self.modifyPlanDia = false
            self.load_data = false
            Swal({
              text:data.errorMsg,
              allowOutsideClick:false
            })
          }
          for(let i in self.modifyForm){
            if(i === 'timeSelect'){
              self.modifyForm[i] = []
            }else{
              self.modifyForm[i] = ''
            }
          }
        }).catch((error) =>{
          self.modifyPlanDia =false
          self.load_data = false
          Swal({
            text:'请求服务器失败',
            allowOutsideClick:false
          })
        })
      },
      //查询素材详情
      loadMaterial(materialId){
        let self = this
        Api.loadMaterial(
          {materialId:materialId}
        ).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            if(data.object){
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
              Swal({
                text:'素材组为空',
                allowOutsideClick:false
              })
            }
          }else{
            self.load_data = false
              Swal({
              text:data.errorMsg,
              allowOutsideClick:false
            })
          }
        }).catch((error)=>{
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
  .playPlan{
    // .diaLog{
    //   .el-form--inline.el-form--label-top .el-form-item__content{
    //     display: inline-block;
    //     margin-left:0;
    //     width:75%;
    //   }
    // }
    .notLatBtn .el-form-item__content {
      width: 75%;
      display: inline-block;
    }
    #lastBtn .el-form-item__content{
      width: 40%;
      display: inline-block;
    }
    .spanBtn{
      padding: 2px 4px;
      border-radius: 4px;
      border:1px solid #D7D7DF;
    }
    .conflictPlan{
      width: 40px;
      padding: 0 5px;
      border-radius: 5px;
      border:1px solid #F2424E;
      color:#EE0525;
      background-color: #FBDEDA;
    }
  }
</style>
