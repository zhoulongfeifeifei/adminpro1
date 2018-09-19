<template>
  <div class="materialList">
    <section class="con">
      <figure>
        <div class="crumbs">
          <span>素材管理</span>
        </div>
      </figure>
    <div class="box" v-loading='load_data' element-loading-text="拼命加载中">
      <div class="matrialBtn">
        <el-button type="primary" @click="upLoad">上传素材</el-button>
        <el-button @click="newMateral">创建循环素材</el-button>
      </div>
      <el-form :inline="true" label-position='top'>
        <el-form-item label="素材名称">
          <el-input placeholder="输入计划标题" v-model="formData.materalName">
            <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
          </el-input>
        </el-form-item>
        <el-form-item label="素材类型">
          <el-select v-model="formData.materalType" placeholder="全部" @change="materalTypeChange"><br>
            <el-option v-for="item in formData.materalList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="素材标签">
          <el-select v-model="formData.materalLabel" placeholder="全部" @change="materalLabeChange"><br>
            <el-option v-for="item in formData.materalLabelList" :key="item.tagId" :label="item.name" :value="item.tagId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style='margin-top:50px;'>
          <el-button type="primary" icon="el-icon-search" @click="searchHost">搜索</el-button>
        </el-form-item>
        <el-form-item style='margin-top:50px;'>
          <el-button type="primary" @click="clearHost">清空</el-button>
        </el-form-item>
        <el-table :data="tableData">
          <el-table-column align="center" prop="name" label="素材名称"></el-table-column>
          <el-table-column align="center" prop="typeCN" label="素材类型"></el-table-column>
          <el-table-column align="center" prop="tagCN" label="素材标签"></el-table-column>
          <el-table-column align="center" label="播放次数(已播/计划）">
            <template slot-scope="scope">
              <p v-if="scope.row.type !=5">{{scope.row.playCount}}/{{scope.row.planCount}}</p>
              <p v-if="scope.row.type ==5">-</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="播放时长(已播/计划）">
            <template slot-scope="scope">
              <p v-if="scope.row.type !=5">
                <span v-if="scope.row.playTime !=''">{{scope.row.playTime}}</span>
                <span v-if="scope.row.playTime ==''">0</span>
                <span v-if="scope.row.planTime !=''">/{{scope.row.planTime}}</span>
                <span v-if="scope.row.planTime ==''">/0</span>
              </p>
              <p v-if="scope.row.type ==5">-</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="edit(scope)">编辑</el-button>
              <el-button type="text" @click="preview(scope.row)">预览</el-button>
              <router-link :to="{ name: 'CloudSeedPlan',query: {shopId: scope.row.shopId}}">
                <el-button type="text">播放计划</el-button>
              </router-link>
              <!-- <router-link :to="{ name: 'MaterialModify',query: {sid: scope.$index}}">
                <el-button type="text">修改记录</el-button>
              </router-link> -->
              <el-button type='text' @click="deletePlan(scope)">删除全部计划</el-button>
              <el-button type="text" @click="createPlans(scope.row)">创建计划</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :pageSize="page.pageRow" layout="total, prev, pager, next"
            :total="page.total" prev-text="上页" next-text="下页" @current-change="pageChange" :current-page.sync="page.pageNo"></el-pagination>
      </el-form>
    </div>
    <!-- 上传素材 -->
    <upload-material :diaLogChange="diaLogChange" :materalLabelList='formData.materalLabelList' @closeDia="closeDia"></upload-material>
    <!-- 添加素材 -->
    <materia-list :diaLogMateria="diaLogMateria" :materiaObject='materiaObject' @chooseMaterial="chooseMaterial"></materia-list>
    <!-- 预览   -->
    <preview  :previewMateria="previewMateria" :previewInfo='previewInfo' @closePreview='closePreview'></preview>
    <!-- 屏列表 -->
     <screen-list :screenDialog="screenDialog" :addScreenList="creatPlanDia.addScreenList" @closeScreen='closeScreen' :tabList='tabList' :openScreen='openScreen'></screen-list>
    <!-- 编辑素材 -->
    <el-dialog title="编辑素材" :visible.sync="dialogEdit" :inline="true" :close-on-click-modal="false" :show-close="false">
      <el-form label-position="right" label-width="80px">
        <el-form-item label="素材名称" :required='true'>
          <el-input placeholder="输入素材标题" v-model="editMatrial.name" style="width:100%;margin-bottom:20px;">
          </el-input>
        </el-form-item>
        <el-form-item label="素材标签">
          <el-select v-model="editMatrial.tagId" filterable allow-create placeholder="全部" style="width:100%;">
            <el-option v-for="item in formData.materalLabelList" :key="item.tagId" :label="item.name" :value="item.tagId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="editSava">保存</el-button>
        <el-button @click="editCancel">取消</el-button>
      </span>
    </el-dialog>
    <!-- 循环素材组 -->
    <el-dialog :title="cycleMateralGroup.title" :visible.sync="centerDialogVisible" :inline="true" :close-on-click-modal="false" :show-close="false">
      <el-form label-width="80px" label-position="right">
        <el-form-item label="素材名称" :required="true">
          <el-input placeholder="请输入名称" style="width:100%;" v-model="cycleMateralGroup.name"></el-input>
        </el-form-item>
        <ul class="ulList">
          <li v-for="item,index) in cycleMateralGroup.options">
            <p class="fileList">
              <span>{{++index}}</span>
              <span>
                <span class='removeFileSpan' @click="remove(index)">移除</span>
                <span class='removeFileSpan' v-if="index !== 1" @click="moveUp(index)">上移</span>
                <span class='removeFileSpan' v-if="index !== cycleMateralGroup.options.length" @click="moveDown(index)">下移</span>
              </span>
            </p>
            <el-form label-width="80px" label-position="right">
              <el-form-item label="素材名称">
                <span>{{item.name}}</span>
              </el-form-item>
              <el-form-item  label="播放时长">
                <el-input type="number" v-model="item.hour" oninput="if(value.length>2)value=value.slice(0,2)" style="width:50px;"></el-input>小时
                <el-input type="number" v-model="item.minute" oninput="if(value.length>2)value=value.slice(0,2)" style="width:50px;"></el-input>分钟
              </el-form-item >
            </el-form>
          </li>
        </ul>
      </el-form>
      <el-button class="addBtn" icon="el-icon-plus" @click="addMaterial">添加素材</el-button>
      <span slot="footer">
        <el-button type="primary" @click="nowCreate">{{cycleMateralGroup.btnText}}</el-button>
        <el-button @click="cancelCreate">取消</el-button>
      </span>
    </el-dialog>
    <!-- 创建计划 -->
    <el-dialog title="创建计划" :visible.sync="createPlan" :inline="true" :close-on-click-modal="false" :show-close="false">
      <el-form label-position="right" label-width='80px'>
        <el-form-item style="border-bottom:1px solid #E4E7E9;">
          <span>{{creatPlanDia.diaMateraName}}</span>
          <el-button size="mini">{{creatPlanDia.diaMateraType}}</el-button>
        </el-form-item>
        <el-form-item label="计划类型:">
            <el-radio-group v-model="creatPlanDia.playType">
              <el-radio :label=0>边播计划</el-radio>
              <el-radio :label=1>插播计划</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="计划时间:" style="border-bottom:1px solid #E4E7E9;">
            <div class="rightTime">
              <el-date-picker style="width:100%;margin-bottom:10px;"
                v-model="creatPlanDia.beginTime"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <el-time-picker style="width:100%;"
                is-range
                v-model="creatPlanDia.endTime"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
              </el-time-picker>
            </div>
          </el-form-item>
          <el-form-item label="应用屏幕" style="margin-top:10px;">
            <el-button @click="addScreen">添加屏幕</el-button><br>
            <el-tag v-for="item in creatPlanDia.addScreenList">{{item.screenName}}</el-tag>
          </el-form-item> 
      </el-form>
      <span slot="footer">
          <el-button type="primary" @click="savaCreat">保存</el-button>
          <el-button @click="cancelCreat">取消</el-button>
        </span>
    </el-dialog>
    </section>
  </div>
</template>
<script>
import * as Api from "@/api/api1"
const Swal=require("sweetalert2")
const lodash = require('lodash')
import UploadMaterial from "@/components/uploadMaterial"
import MaterialList from "@/components/materialList"
import Preview from "@/components/preview"
import ScreenList from '@/components/screenList'
let moment = require('moment')
  export default{
    name:"MaterialManageList",
    components:{
      "uploadMaterial":UploadMaterial,
      'materiaList':MaterialList,
      'preview':Preview,
      'screenList':ScreenList
    },
    data(){
      return{
        load_data:true,
        diaLogChange:false, // 上传素材
        centerDialogVisible:false,//创建循环素材
        createPlan:false,//创建计划
        diaLogMateria:false, //添加循环素材
        shopId:'',
        materiaObjects:{},
        materiaObject:{},
        dialogEdit:false, //编辑的弹框
        previewMateria:false, // 预览素材
        screenDialog:false, //添加屏
        page:{
          pageRow:0,
          pageNo:1,
          totalPageNo:0,
          total:0
        },
        openScreen:{
          saveScreenStyle:false,//判断是否保存过选中的屏
          screenStyle:'',//判断通过哪个打开屏列表 newOpen新建  copyDay通过日计划复制 copyWeek通过周计划复制
          screeName:'',//判断打开屏列表的name
          screeId:'',// 复制屏的ID
          operationShopId:''
        },
        tabList:[],
        creatPlanDia:{
          shopId:'',
          materialId:'',
          diaMateraName:'',//创建计划的名字
          diaMateraType:'',//创建计划的类型
          type:'',
          playType:0,
          beginTime:[new Date(),new Date()],
          addScreenList:[],
          endTime:[new Date(),new Date()],
          screenIds:[]
        },
        
        previewInfo:{},
        tabIndex:'',
        formData:{
          materalName:'',
          materalType:'',
          materalLabel:'',
          materalList:[
            {
              value: '0',
              name: '图片'
            },
            {
              value: '2',
              name: '视频'
            },
            {
              value: '1',
              name: '音频'
            },
            {
              value: '3',
              name: '网页'
            },
            {
              value: '4',
              name: '本地文件'
            },
            {
              value: '5',
              name: '素材组'
            }
          ],
          materalLabelList:[]
        },
        editMatrial:{
          materialId:'',
          tagCN:'',
          name:'',
          url:'',
          type:'',
          tagId:''
        },
        tableData:[],
        cycleMateralGroup:{
          title:'',
          btnText:'',
          name:'',
          materialId:'',
          options:[]
        },
      }
    },
    mounted() {
      this.load_data= true
      this.findMaterials(1)
      this.findTags()
    },
    methods: {
      //编辑
      edit: lodash.debounce(function(scope){
        this.tabIndex = scope.$index
        if(scope.row.type == 5){//此时为循环素材组
          this.centerDialogVisible = true
          this.load_data = true
          this.loadMaterial(scope.row.materialId,'编辑')
        }else{
          this.dialogEdit = true
          this.editMatrial.materialId = scope.row.materialId
          this.editMatrial.name = scope.row.name
          this.editMatrial.tagCN = scope.row.tagCN
          this.editMatrial.tagId = scope.row.tagId
          this.editMatrial.type = scope.row.type
          this.loadMaterial(scope.row.materialId,'编辑1')
        }
      },300),
      //删除全部计划
      deletePlan(scope){
        this.tabIndex = scope.$index
        this.$confirm('删除该素材的全部计划后，该素材未播放的计划将全部删除，且无法恢复，确认删除吗？','提示',{
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() =>{
          this.load_data = true
          this.delPlanByMaterial(scope.row.materialId,true)
        })
      },
      //预览
      preview: lodash.debounce(function(scope){
        this.loadMaterial(scope.materialId)
      },300),
      //分页
      pageChange(val){
        this.page.pageNo = val
        this.findMaterials(val)
      },
      //搜索
      searchHost: lodash.debounce(function(){
        this.load_data = true
        this.page.pageNo = 1
        this.findMaterials(1)
      },300),
      clearHost: lodash.debounce(function(){
        this.page.pageNo = 1
        for(var i in this.formData){
          if(i == 'materalLabelList'){
            this.formData[i] = this.formData[i]
          }else   if(i == 'materalList'){
            this.formData[i] = this.formData[i]
          }else{
            this.formData[i] =''
          }
        }
        this.load_data = true
        this.findMaterials(1)
      },300),
      //素材标签搜索
      materalLabeChange: lodash.debounce(function(){
        this.load_data = true
        this.page.pageNo = 1
        this.findMaterials(1)
      },300),
      materalTypeChange(){
        this.load_data = true
        this.page.pageNo = 1
        this.findMaterials(1)
      },
      //创建计划
      createPlans(scope){
        this.createPlan = true
        this.creatPlanDia.shopId = scope.shopId
        this.creatPlanDia.materialId = scope.materialId
        this.creatPlanDia.diaMateraName = scope.name
        this.creatPlanDia.type = scope.type
        this.creatPlanDia.diaMateraType = scope.typeCN
      },
      savaCreat:lodash.debounce(function(){
        // this.openScreen.saveScreenStyle = true
        let startDate = moment(this.creatPlanDia.beginTime[0].toUTCString()).format('YYYY-MM-DD')
        let endDate = moment(this.creatPlanDia.beginTime[1].toUTCString()).format('YYYY-MM-DD')
        let startTime = moment(this.creatPlanDia.endTime[0].toUTCString()).format('HH:mm')
        let endTime =moment(this.creatPlanDia.endTime[1].toUTCString()).format('HH:mm')
        function DateMinus(date1,date2){
        　　var sdate = new Date(date1); 
        　　var now = new Date(date2); 
        　　var days = now.getTime() - sdate.getTime(); 
        　　var day = parseInt(days / (1000 * 60 * 60 * 24)); 
        　　return day; 
        }
        let timeSub = DateMinus(startDate,endDate)
        if(timeSub > 59){
          Swal({
            text:'时间不能超过60天',
            allowOutsideClick:false
          })
        }else if(endTime === startTime){
          Swal({
            text:'开始时间不能和结束时间相同',
            allowOutsideClick:false
          })
        }else if(this.creatPlanDia.screenIds.length ===0){
          Swal({
            text:'请先选择屏',
            allowOutsideClick:false
          })
        }else{
          this.load_data = true
          this.SavePlan(startDate,endDate,startTime,endTime)
        }
      },300),
      cancelCreat(){
        this.openScreen.saveScreenStyle = true
        this.createPlan = false
        for(let i in this.creatPlanDia){
          if(i ==='addScreenList' || i ==='screenIds'){
            this.creatPlanDia[i] =[]
          }
          else if(i === 'endTime' || i === 'beginTime'){
            this.creatPlanDia[i] =[new Date(),new Date()]
          }else{
            this.creatPlanDia[i] = ''
          }
          
        }
      },
      //添加屏幕
      addScreen: lodash.debounce(function(){
        this.$nextTick(() => {
          this.screenDialog = true
          this.openScreen.saveScreenStyle = false
          this.openScreen.screenStyle = 'newOpen'
          this.openScreen.screeName = '屏列表'
          this.openScreen.screeId = '-1'
          this.openScreen.operationShopId =''
          this.screenFindPage(1)
        })
      },300),
      editSava: lodash.debounce(function(){
        if(this.editMatrial.name === ''){
          this.$message({
            message: '名字不能为空',
            type: 'warning'
          })
        }else{
          this.load_data = true
          if(this.editMatrial.tagId){
            this.findTags(this.editMatrial.tagId)
          }else{
            let obj ={
              materialId:this.editMatrial.materialId,
              name:this.editMatrial.name,
              type:this.editMatrial.type,
              url:this.editMatrial.url
            }
            this.saveMaterial(obj)
          }
        }
      },300),
      editCancel(){
         this.dialogEdit = false
         for(let i in this.editMatrial){
           this.editMatrial[i] =''
         }
      },
      remove(index){
         let num = index -1
        this.cycleMateralGroup.options.splice(num,1)
      },
      //上移
      moveUp(index){
       let num = index -1
       let num2 = index - 2
       let obj = this.cycleMateralGroup.options[num]
       this.cycleMateralGroup.options.splice(num,1)
       this.cycleMateralGroup.options.splice(num2,0,obj)
      },
      //下移
      moveDown(index){
        let num = index -1
        let obj = this.cycleMateralGroup.options[num]
        this.cycleMateralGroup.options.splice(num,1)
        this.cycleMateralGroup.options.splice(index,0,obj)
      },
      newMateral(){ //新建循环素材
        this.centerDialogVisible = true
        this.cycleMateralGroup.title = '创建循环素材组'
        this.cycleMateralGroup.btnText = '立即创建'
      },
      nowCreate:lodash.debounce(function(){ //上传循环素材
        if(this.cycleMateralGroup.name === ''){
          this.$message({
            message: '循环素材组名称不能为空',
            type: 'warning'
          })
        }else if(this.cycleMateralGroup.options.length === 0){
          this.$message({
            message: '素材组至少添加一个素材，请添加素材',
            type: 'warning'
          })
        }else{
          let noConditions = 0
          for(let i=0;i<this.cycleMateralGroup.options.length;i++){
            if(this.cycleMateralGroup.options[i].hour === '' && this.cycleMateralGroup.options[i].minute === ''){
              this.$message({
                message: '请选择播放时长',
                type: 'warning'
              })
              noConditions = 1
              break
            }else if(this.cycleMateralGroup.options[i].hour === 0 && this.cycleMateralGroup.options[i].minute === 0){
              this.$message({
                message: '素材不允许小时和分钟同时为0，请修改素材播放时长',
                type: 'warning'
              })
              noConditions = 1
              break
            }else if(this.cycleMateralGroup.options[i].minute > 59){
              this.$message({
                message: '分钟不能大于59分钟',
                type: 'warning'
              })
              noConditions = 1
              break
            }else if(this.cycleMateralGroup.options[i].hour >23){
              this.$message({
                message: '不能超过24小时',
                type: 'warning'
              })
              noConditions = 1
              break
            }

          }
          if(noConditions === 0){
            this.load_data = true
            let obj ={}
              obj.name=this.cycleMateralGroup.name
              obj.options = this.cycleMateralGroup.options
              obj.materialId = this.cycleMateralGroup.materialId
              this.saveCircleMaterial(obj)
          }
        }
      },300),
      cancelCreate(){
        this.centerDialogVisible = false
         for(let i in this.cycleMateralGroup){
           if(i == 'options'){
             this.cycleMateralGroup[i] = []
           }else{
             this.cycleMateralGroup[i] = ''
           }
            
          }
      },
      addMaterial(){ //添加素材
      this.diaLogMateria = true
      this.materiaObject = this.materiaObjects
      this.materiaObject.addMaterial ='添加素材'
      },
      upLoad(){ // 上传素材
        this.diaLogChange= true
      },
      closeDia(value){
        this.diaLogChange= value
        this.findMaterials(1)
      },
      closePreview(value){
         this.previewMateria= value
      },
      closeScreen(list,value){
        this.screenDialog= value
        for(let i in list){
          this.creatPlanDia.screenIds.push(list[i].screenId)
        }
        this.creatPlanDia.addScreenList=list
      },
      //选择素材
      chooseMaterial: lodash.debounce(function(value,tas){
        if(tas){
          let obj = {}
          obj.materialId =tas.materialId
          obj.name = tas.name
          obj.hour = 0
          obj.minute = 0
          this.cycleMateralGroup.options.push(obj)
        }
        this.diaLogMateria = value
      },300),
      //编辑素材
      saveMaterial(obj){
        let self = this
        Api.saveMaterial(obj).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            self.dialogEdit = false
            if(self.tabIndex !==''){
              self.tableData[self.tabIndex].name = self.editMatrial.name
              self.tableData[self.tabIndex].tagCN = self.editMatrial.tagCN
               self.tableData[self.tabIndex].tagId = self.editMatrial.tagId
            }
            self.$message({
              message: '编辑素材成功',
              type: 'success'
             })
          }else{
            self.load_data = false
            Swal({
              text:data.errorMsg,
              allowOutsideClick:false
            })
          }
          for(let i in self.editMatrial){
              self.editMatrial[i] = ''
            }
        }).catch((error) =>{
         self.load_data = false
          Swal({
            text:'请求服务器失败',
            allowOutsideClick:false
          })
        })
      },
      //创建循环素材组
      saveCircleMaterial(obj){
        let self =this
        Api.saveCircleMaterial(obj).then((res) =>{
          let data =res.data
          if(data.status === 0){
            self.tableData.push(obj)//刷新页面
            self.load_data = false   
            self.centerDialogVisible = false
            self.cycleMateralGroup.name = ''
            self.cycleMateralGroup.options= []
            self.findMaterials(self.page.pageNo)
            if(self.cycleMateralGroup.title == '创建循环素材组'){
              self.$message({
                message: '创建循环素材组成功',
                type: 'success'
              })
            }else{
              self.$message({
                message: '编辑素材成功',
                type: 'success'
              })
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
      //查询素材列表
      findMaterials(pageNo){
        let self =this
        let obj ={
          name:self.formData.materalName,
          type:self.formData.materalType,
          tagId:self.formData.materalLabel,
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
              self.tableData = data.object.objects
              if(data.object.pageNo === 1){
                self.materiaObjects = data.object
              }
            }else{
              self.page.pageRow =20
              self.page.pageNo = 1
              self.page.total = 0
              self.tableData = []
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
      //查询所有素材标签
      findTags(name){
        let self =this
        Api.findTags().then((res) =>{
          let data =res.data
          if(data.status === 0){
            self.load_data = false
            self.formData.materalLabelList = data.object
            let noCon = 0
            if(name != undefined){
              for(let i in data.object){
                if(name === data.object[i].name){
                  self.editMatrial.tagId = data.object[i].tagId
                  self.editMatrial.tagCN = data.object[i].name
                  self.saveMaterial(self.editMatrial)
                  noCon = 1
                  break;
                }else if(name === data.object[i].tagId){
                  self.editMatrial.tagCN = data.object[i].name
                  self.saveMaterial(self.editMatrial)
                  noCon =1
                   break;
                }
              }
              if(noCon === 0){
                self.saveTag(name)
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
      //查询素材详情
      loadMaterial(materialId,name){
        let self = this
        Api.loadMaterial(
          {materialId:materialId}
        ).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            if(name == undefined){//预览
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
            }else{//编辑循环素材组
              if(name == '编辑'){
                self.cycleMateralGroup.name = data.object.name
                self.cycleMateralGroup.title = '编辑循环素材组'
                self.cycleMateralGroup.btnText = '保存'
                self.cycleMateralGroup.materialId = data.object.materialId
                if(data.object.options.length>0){
                  self.cycleMateralGroup.options = data.object.options
                }
              }else{
                self.editMatrial.url = data.object.url
              }
              
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
      },
      //保存计划
      SavePlan(startDate,endDate,startTime,endTime){
        let self = this
         Api.SavePlan(
           {
             shopId:self.creatPlanDia.shopId,
            // shopId:1,
             materialId:self.creatPlanDia.materialId,
             type:self.creatPlanDia.type,
             startDate:startDate,
             endDate:endDate,
             startTime:startTime,
             endTime:endTime,
             screenIds:self.creatPlanDia.screenIds
           }
         ).then((res) =>{
           let data = res.data
           if(data.status === 0){
             self.load_data = false
             self.createPlan = false
             self.$message({
              message: '创建计划成功',
              type: 'success'
             })
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
            pageNo:pageNo
          }
        ).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            if(data.object){
              self.tabList = data.object
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
      //删除计划
      delPlanByMaterial(materialId,groupFlag){
        let self = this
        Api.delPlanByMaterial(
          {
            materialId:materialId,
            groupFlag:groupFlag
          }
        ).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            self.findMaterials(self.page.pageNo)
            // self.tableData.splice(self.tabIndex,1)
          }else{
            self.load_data = false
            Swal({
              text:data.errorMsg,
              allowOutsideClick:false
            })
          }
          self.tabIndex = ''
        }).catch((error)=>{
          self.load_data = false
          Swal({
            text:'请求服务器失败',
            allowOutsideClick:false
          })
        })
      },
      //保存标签
      saveTag(name){
        let self =this
        Api.saveTag({name:name}).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.findTags(name)
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
      }
    }
  }
</script>
<style type="text/scss" lang="scss">
.materialList{
  .matrialBtn{
    margin-bottom: 20px;
  }
  .el-dialog{
    .el-form-item{
      margin-bottom: 0;
    }
    .ulList{
      max-height: 400px;
      overflow-y: scroll;
      ::-webkit-scrollbar {
        width: 1px;
      }
      li{
        .fileList{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          background-color: #fff;
          padding: 10px 0;
          .removeFileSpan:hover{
            cursor: pointer;
            color:#409EFF;
          }
        }
        .el-form{
          background-color: #F5F7FA;
          margin-bottom: 10px;
        }
      }
    }
    .addBtn{
      width: 100%;
      margin-top: 10px;
    }
    .rightTime{
      margin-bottom: 10px;
    }
  }
  .el-table th{
    background-color: #F5F5F6;
  }
}
</style>