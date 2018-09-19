<template>
  <div class="ScreenManage">
    <section class="con">
      <figure>
        <div class="crumbs">
          <span>屏列表</span>
        </div>
      </figure>
      <div class="box" v-loading="load_data" element-loading-text="拼命加载中">
        <el-form :inline="true" label-position='top'>
          <el-form-item label="运营商户名称">
            <el-input placeholder="输入计划标题" v-model="screen.operationShopName">
              <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
            </el-input>
          </el-form-item>
          <el-form-item label="运营商户ID">
            <el-input placeholder="运营商ID" v-model="screen.operationShopId">
              <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
            </el-input>
          </el-form-item>
          <el-form-item label="使用商户名称">
            <el-input placeholder="使用商户名称" v-model="screen.useShopName">
              <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
            </el-input>
          </el-form-item>
          <el-form-item label="使用商户ID">
            <el-input placeholder="使用商户ID" v-model="screen.useShopId">
              <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
            </el-input>
          </el-form-item>
          <el-form-item label="屏名称">
            <el-input placeholder="输入屏名称" v-model="screen.screenName">
              <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
            </el-input>
          </el-form-item>
          <el-form-item label="负责人" style="display:none">
            <el-select v-model="screen.fzr" placeholder="全部">
              <el-option v-for="item in screen.fzrList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运营权">
            <el-select v-model="screen.operation" placeholder="全部" @change='operationChange'>
              <el-option v-for="item in screen.operatorList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="屏标签" style="display:none">
            <el-select v-model="screen.groupId" placeholder="全部">
              <el-option v-for="item in screen.screenLabelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地区选择" style="display:none">
            <el-cascader :options="screen.areaChoose" change-on-select v-model="screen.workarea" @change="handleChange" ></el-cascader>
          </el-form-item>
          <el-form-item style='margin-top:50px;'>
            <el-button type="primary" icon="el-icon-search"  @click="seachScreen">搜索</el-button>
          </el-form-item>
          <el-form-item style='margin-top:50px;'>
            <el-button type="primary"  @click="clearScreen">清空</el-button>
          </el-form-item>
          <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
            <el-tab-pane label="使用中" name="nowUser"></el-tab-pane>
            <el-tab-pane label="未使用" name="noUser"></el-tab-pane>
          </el-tabs>
          <el-table :data="tableData" v-show="activeName === 'nowUser'">
            <el-table-column align="center" prop="screenName" label="屏名称"></el-table-column>
            <el-table-column align="center" prop="screenSelfId" label="物理屏ID"></el-table-column>
            <el-table-column align="center" prop="ratio" label="分辨率"></el-table-column>
            <el-table-column align="center" prop='visitTime' label="上次访问时间">
              <!-- <template slot-scope="scope">
                <span v-if="scope.row.useShopId !==''">开机中</span>
                <span v-else>未开机</span>
              </template> -->
            </el-table-column>
            <el-table-column align="center" label="屏标签" prop='tags'>
            </el-table-column>
            <el-table-column align="center" label="运营权">
              <template slot-scope="scope">
                <p v-if="scope.row.operation == 0">脸脸运营</p>
                <p v-if="scope.row.operation == 1">商户运营</p>
              </template>
            </el-table-column>
            <el-table-column align="center" label="运营商户\ID">
              <template slot-scope="scope"><p>{{scope.row.operationShopName}}<span v-if="scope.row.operationShopId">({{scope.row.operationShopId}})</span></p></template>
            </el-table-column>
            <el-table-column align="center" label="使用商户\ID">
              <template slot-scope="scope"><p>{{scope.row.useShopName}}<span v-if="scope.row.useShopId">({{scope.row.useShopId}})</span></p></template>
            </el-table-column>
            <el-table-column align="center" label="负责人">
              <template slot-scope="scope"><p>{{scope.row.wallahName}}<span v-if="scope.row.wallahPhone !=''">({{scope.row.wallahPhone}})</span></p></template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="edit(scope)">编辑</el-button>
                <!-- <el-button type="text">预览</el-button> -->
                <router-link :to="{ name: 'CloudSeedPlan',query: {shopId: scope.row.operationShopId,screenId:scope.row.screenId}}">
                  <el-button type="text">播放计划</el-button>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
          <el-table :data="tableData1" v-show="activeName === 'noUser'">
            <el-table-column align="center" prop="screenName" label="屏名称"></el-table-column>
            <el-table-column align="center" prop="screenSelfId" label="物理屏ID"></el-table-column>
            <el-table-column align="center" prop="ratio" label="分辨率"></el-table-column>
            <el-table-column align="center" label="上次访问时间">
              <!-- <template slot-scope="scope">
                <span v-if="scope.row.useShopId !==''">开机中</span>
                <span v-else>未开机</span>
              </template> -->
            </el-table-column>
            <el-table-column align="center" label="屏标签" prop='tags'>
            </el-table-column>
            <el-table-column align="center" label="运营权">
              <template slot-scope="scope">
                <p v-if="scope.row.operation == 0">脸脸运营</p>
                <p v-if="scope.row.operation == 1">商户运营</p>
              </template>
            </el-table-column>
            <el-table-column align="center" label="运营商户\ID">
              <template slot-scope="scope"><p>{{scope.row.operationShopName}}<span v-if="scope.row.operationShopId">({{scope.row.operationShopId}})</span></p></template>
            </el-table-column>
            <el-table-column align="center" label="使用商户\ID">
              <template slot-scope="scope"><p>{{scope.row.useShopName}}<span v-if="scope.row.useShopId">({{scope.row.useShopId}})</span></p></template>
            </el-table-column>
            <el-table-column align="center" label="负责人">
              <template slot-scope="scope"><p>{{scope.row.wallahName}}<span v-if="scope.row.wallahPhone !=''">{{scope.row.wallahPhone}})</span></p></template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="edit(scope)">编辑</el-button>
                <!-- <el-button type="text">预览</el-button> -->
                <router-link :to="{ name: 'CloudSeedPlan',query: {shopId: scope.row.operationShopId,screenId:scope.row.screenId}}">
                  <el-button type="text">播放计划</el-button>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination :pageSize="page.pageRow" layout="total, prev, pager, next"
            :total="page.total" prev-text="上页" next-text="下页" @current-change="pageChange" :current-page.sync="page.pageNo"></el-pagination>
        </el-form>
        <!-- 模态框 -->
        <el-dialog title="编辑屏幕" :visible.sync="centerDialogVisible" :close-on-click-modal="false">
          <el-form label-position='right' label-width='80px'>
            <el-form-item label="屏幕名称" :required='true'>
              <!-- <el-input placeholder="请输入内容" style="width:70%;" v-model="dialogInfo.screenName" :disabled=dialogInfo.disabled></el-input> -->
              <el-input placeholder="请输入内容" style="width:70%;" v-model="dialogInfo.screenName" :disabled='true'></el-input>
            </el-form-item>
            <el-form-item label="运营权" :required='true'>
               <el-radio-group v-model="dialogInfo.radio" @change="radioChange">
                <el-radio :label=0>脸脸运营</el-radio>
                <el-radio :label=1>商户运营</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="运营商户ID" :required='true' label-width='100px' v-if="dialogInfo.radio == 1">
              <el-input type="number" placeholder="输入所属商户ID" v-model="dialogInfo.operationShopId" style="width:60%;" v-on:blur="operationOwer">
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="运营商户" label-width='100px' v-if="dialogInfo.radio == 1"><span>{{dialogInfo.operationShopName}}</span></el-form-item>
            <div class="diaScreen" v-loading="load_data" element-loading-text="拼命加载中">
              <span class="screenLabel">屏标签</span>
              <div class='diaScreenss'>
                <div v-for="(item,index) in tagsList">
                  <el-form-item :label='item[0].groupName' :key="index" :required='item[0].tagRequired ==1 ? true : false' label-width='80px' v-if="item[0].tagOption == 0">
                    <el-select v-model="dialogInfo.tags[index]" placeholder="全部" value-key="tagId" :clearable='true'>
                      <el-option v-for="items in item" :key="items.tagId" :label="items.tagName" :value="items"></el-option>
                    </el-select>
                </el-form-item>
                </div>
                <div v-for="(item,index) in tagsList1">
                  <el-form-item :label='item[0].groupName' :key="index" :required='item[0].tagRequired ==1 ? true : false' label-width='80px' v-if="item[0].tagOption == 1">
                      <el-select v-model="dialogInfo.tags1[index]" placeholder="全部" multiple value-key="tagId">
                        <el-option v-for="items in item" :key="items.tagId" :label="items.tagName" :value="items"></el-option>
                      </el-select>
                  </el-form-item>
                </div>
              </div>
            </div>
            <el-form-item label="当前使用商户ID" label-width='100px'>
              <el-input type="number" placeholder="输入所属商户ID" v-model="dialogInfo.useShopId" style="width:60%;" v-on:blur="useOwer">
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="当前使用商户" label-width='100px'><span>{{dialogInfo.useShopName}}</span></el-form-item>
          </el-form>
          <span slot="footer">
              <el-button type="primary" @click="save">保存</el-button>
              <el-button @click="cancel">取消</el-button>
            </span>
        </el-dialog>
      </div>
    </section>
    
  </div> 
</template>
<script>
import * as Api from "@/api/api1"
const Swal=require("sweetalert2")
const lodash = require('lodash')
//引入地区js
  import { regionData } from 'element-china-area-data'
  export default{
    name:'ScreenManage',
    data(){
      return{
        centerDialogVisible:false,
        load_data:true,
        activeName:'nowUser',
        tabIndex:'',
        tagsList:[],//标签组对应的标签
        tagsList1:[],
        nowUserIndex:0,
        noUserIndex:0,
        changesOption:{},
        page:{
          pageRow:0,
          pageNo:1,
          totalPageNo:0,
          total:0
        },
        screen:{
          operationShopName:'',
          operationShopId:'',
          useShopName:'',
          useShopId:'',
          screenName:'',
          fzr:0,
          operation:'',
          groupId:'',
          tagId:'',
          workarea:["330000","330100","330106"],
          areaChoose:regionData,
          fzrList:[
            {
              label: '全部',
              value: '0'
            },
            {
              label: '脸脸',
              value: '1'
            },
            {
              label: '商家',
              value: '2'
            }
          ],
          operatorList:[
            {
              label: '全部',
              value: ''
            },
            {
              label: '脸脸运营',
              value: 0
            },
            {
              label: '商户运营',
              value: 1
            }
          ],
          screenLabelList:[
            {
              label: '全部',
              value: '0'
            },
            {
              label: '脸脸',
              value: '1'
            },
            {
              label: '商家',
              value: '2'
            }
          ]
        },
        tableData:[],
        tableData1:[],
        dialogInfo:{
          tags:[],//选择的标签
          tags1:[],
          disabled:false,
          screenName:'',
          screenId:'',
          centerId:'',
          radio:0,
          operationShopId:'',
          operationShopName:'',
          useShopId:'',
          useShopName:''
        }
      }
    },
    mounted() {
      this.load_data = true
      let shopId = this.$route.query.shopId
      this.screen.operationShopId =shopId
      this.screenFindPage(1)
      // this.findGroupList(1)
    },
    methods:{
      //tab切换
      tabClick(){//tab切换避免连续调接口
        for(let i in this.page){
          if(i === 'pageNo'){
            this.page[i] = 1
          }else{
            this.page[i] = 0
          }
        }
        this.load_data = true
        if(this.activeName === 'nowUser'){
          this.nowUserIndex += 1
          if(this.nowUserIndex === 1){
            this.noUserIndex = 0
            this.page.pageNo = 1
            this.screenFindPage(1)
          }else{
            this.load_data = false
          }
        }
        if(this.activeName === 'noUser'){
          this.noUserIndex += 1
          if(this.noUserIndex === 1){
            this.nowUserIndex = 0
            this.page.pageNo = 1
            this.findPageUnuse(1)
          }else{
            this.load_data = false
          }
        }
      },
      //搜索
      seachScreen(){
        this.load_data = true
        this.page.pageNo = 1
        if(this.activeName ==='nowUser'){
          this.screenFindPage(1,'选择运营')
        }else{
          this.findPageUnuse(1)
        }
      },
      clearScreen(){
        this.load_data = true
        this.page.pageNo = 1
        if(this.activeName == 'nowUser'){
          this.screen.operationShopName = ''
          this.screen.operationShopId = ''
          this.screen.useShopName = ''
          this.screen.useShopId =''
          this.screen.screenName =''
          this.screen.operation =''
          this.screen.groupId =''
          this.tagId =''
          this.screenFindPage(1,'选择运营')
        }else{
          this.findPageUnuse(1)
        }
      },
      //运营权
      operationChange(){
        this.page.pageNo = 1
        this.load_data = true
        if(this.activeName == 'nowUser'){
          this.screenFindPage(1,'选择运营')
        }
      },
      //分页
      pageChange(val){
        this.page.pageNo = val
        this.load_data = true
        if(this.activeName === 'nowUser'){
          this.screenFindPage(val)
        }else if(this.activeName === 'noUser'){
          this.findPageUnuse(val)
        }
      },
      //运营ID查询
      operationOwer(){
        this.shopLoadName(this.dialogInfo.operationShopId,'运营id')
      },
      //使用id查询
      useOwer(){
        this.shopLoadName(this.dialogInfo.useShopId,'使用id')
      },
      save:lodash.debounce(function(){
        if(this.dialogInfo.radio == 0){
          this.dialogInfo.operationShopId = 40261649
          this.dialogInfo.operationShopName = '脸脸集团'
        }
        if(this.dialogInfo.screenName === ''){
          this.$message({
            message: '请输入屏屏名称',
            type: 'warning'
          })
        }else if(this.dialogInfo.operationShopName == ''){
          this.$message({
            message: '请输入运营商户ID',
            type: 'warning'
          })
        }
        // else if(this.dialogInfo.useShopName == ''){
        //   this.$message({
        //     message: '请输入使用商户ID',
        //     type: 'warning'
        //   })
        // }
        else{
          let conditions = 0
          let bx = 0
          let tagsArr = []
          let signArr = []
          let tags = this.dialogInfo.tags
          //单选的判断是必选还是非必选
          for(let i in this.tagsList){
            for(let k in this.tagsList[i]){
              if(this.tagsList[i][k].tagRequired ==1){
                signArr.push(this.tagsList[i][k])
                break;
              }
            }
          }
          if(signArr.length>0){
            for(let i in signArr){
              if(tags.length>0){
                for(let k in tags){
                  if(tags[k].groupId == signArr[i].groupId){
                    bx =1
                    tagsArr.push(tags[k])
                    break;
                  }
                }
                if(bx == 0){
                  conditions =1
                  this.$message({
                    message: '必选项不能为空',
                    type: 'warning'
                  })
                }
              }else{
                conditions =1
                  this.$message({
                    message: '必选项不能为空',
                    type: 'warning'
                  })
                  break;
              }
            }
          }
          if(tags.length>0){
            for(let i in tags){
              if(tags[i].tagRequired === 0){
                tagsArr.push(tags[i])
              }
            }
          }
          //多选的判断是必选还是非必选
          let tags1 = this.dialogInfo.tags1
          for(let i in this.tagsList1){
            if(tags1[i].length == 0){
              if(this.tagsList1[i][0].tagRequired ==1){
                conditions =1
                this.$message({
                  message: '必选项不能为空',
                  type: 'warning'
                })
                break;
              }
            }else{
              for(let j in tags1[i]){
                tagsArr.push(tags1[i][j])
              }
            }
          }
          if(conditions == 0){
            let arrTag= []
            for(let i in tagsArr){
              let obj = {
                tagId:tagsArr[i].tagId,
                groupId:tagsArr[i].groupId
              }
              arrTag.push(obj)
            }
            if(this.changesOption.radio == this.dialogInfo.radio){
              if(this.changesOption.radio == 0){
                this.screenSave(arrTag)
              }else{
                if(this.changesOption.operationShopId == this.dialogInfo.operationShopId){
                  this.screenSave(arrTag)
                }else{
                  this.$confirm('运营权发生修改，保存后屏对应的所有计划将被删除，是否保存？','提示',{
                    confirmButtonText: '立即保存',
                    cancelButtonText: '取消',
                    type: 'warning',
                    showClose:false,
                    closeOnClickModal:false
                  }).then(() => {
                    this.screenSave(arrTag)
                  }).catch(() => {
                    
                  });
                }
              }
            }else{
                this.$confirm('运营权发生修改，保存后屏对应的所有计划将被删除，是否保存？','提示',{
                    confirmButtonText: '立即保存',
                    cancelButtonText: '取消',
                    type: 'warning',
                    showClose:false,
                    closeOnClickModal:false
                  }).then(() => {
                    this.screenSave(arrTag)
                  }).catch(() => {
                    
                  });
            }
            // this.screenSave(arrTag)
          }
        }
      },300),
      cancel(){
        this.centerDialogVisible = false
        this.dialogInfo.screenName = ''
        this.dialogInfo.screenId =''
        this.dialogInfo.centerId =''
        this.dialogInfo.radio = 0
        this.dialogInfo.operationShopId = ''
        this.dialogInfo.operationShopName = ''
        this.dialogInfo.useShopId = ''
        this.dialogInfo.useShopName =''
      },
      handleChange(value){
      },
      edit(scope1){
        this.load_data = true
        this.tabIndex = scope1.$index
        let scope = scope1.row
        this.centerDialogVisible = true
        this.dialogInfo.radio = scope.operation ? scope.operation :0
        // if(this.activeName =='nowUser'){
        //   // if(scope.operation == 1){
        //   //   this.dialogInfo.disabled = true
        //   // }else{
        //   //   this.dialogInfo.disabled = false
        //   // }
        //   this.dialogInfo.operationShopId =scope.operationShopId
        //   this.dialogInfo.operationShopName = scope.operationShopName
        // }else{
        //   if(!scope.operationShopId){
        //     this.dialogInfo.radio = 0
        //     this.dialogInfo.operationShopId = 40261649
        //     this.dialogInfo.operationShopName = '脸脸集团'
        //     this.dialogInfo.disabled = false
        //   }else{
        //     this.dialogInfo.disabled = true
        //     this.dialogInfo.radio = 1
        //     this.dialogInfo.operationShopId =scope.operationShopId
        //     this.dialogInfo.operationShopName = scope.operationShopName
        //   }
        // }
        this.dialogInfo.operationShopId =scope.operationShopId
        this.dialogInfo.operationShopName = scope.operationShopName
        this.dialogInfo.screenName = scope.screenName
        this.dialogInfo.useShopId = scope.useShopId
        this.dialogInfo.useShopName = scope.useShopName
        this.dialogInfo.screenId = scope.screenId
        this.dialogInfo.centerId = scope.centerId
        this.findGroupList(1)
        this.changesOption.radio =this.dialogInfo.radio
        this.changesOption.operationShopId = this.dialogInfo.operationShopId 
      },
      radioChange(value){
        if(value === 0){
          this.dialogInfo.disabled = false
          // this.dialogInfo.operationShopId = 40261649
          // this.dialogInfo.operationShopName = '脸脸集团'
        }else{
            if(this.changesOption.radio == 0){
              this.dialogInfo.operationShopId = ''
              this.dialogInfo.operationShopName = ''
            }
          this.dialogInfo.disabled = true
        }
        this.dialogInfo.radio = value
      },
      //已使用屏列表
      screenFindPage(pageNo,yuning){
        let self = this
        Api.screenFindPage(
          {
            pageNo:pageNo,
            operationShopName:self.screen.operationShopName,
            operationShopId:self.screen.operationShopId,
            useShopName:self.screen.useShopName,
            useShopId:self.screen.useShopId,
            operation:self.screen.operation,
            screenName:self.screen.screenName,
            groupId:self.screen.groupId,
            tagId:self.screen.tagId
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
              self.tableData = data.object.objects
            }else{
              self.page.pageNo = 1
              self.page.total = 0
              self.tableData = []
            }
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
      },
      //未使用屏列表
      findPageUnuse(pageNo){
        let self = this
        Api.findPageUnuse(
          {
            pageNo:pageNo,
            ownerShopId:self.screen.operationShopId
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
              self.tableData1 = data.object.objects
            }else{
                self.page.pageNo = 1
                self.page.total = 0
                self.tableData1 = []
              }
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
      },
      //标签组
      findGroupList(pageNo){
        let self = this
        Api.findGroupList({pageNo:pageNo}).then((res) =>{
          let data  =res.data
          if(data.status === 0){
            self.tagsList = []
            self.tagsList1 =[]
            self.dialogInfo.tags =[]
            self.dialogInfo.tags1 =[]
            self.load_data = false
            if(data.object){
              let arr = data.object.objects
              for(let i in arr){
                self.loadTagGroup(arr[i].groupId)
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
      //标签列表
      loadTagGroup(groupId){
        let self = this
        Api.loadTagGroup({groupId:groupId}).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            let arr = data.object.tags
            if(arr.length >0){
               var tagList = []
               var tagList1 =[]
              for(let i in arr){
                let obj ={}
                obj.groupId = data.object.groupId
                obj.groupName = data.object.name
                obj.tagRequired = data.object.tagRequired
                obj.tagOption = data.object.tagOption
                obj.tagId = arr[i].tagId
                obj.tagName = arr[i].name
                if(data.object.tagOption == 0){
                  tagList.push(obj)
                }else{
                   tagList1.push(obj)
                }
              }
              if(tagList.length >0){
                self.tagsList.push(tagList)
              }
              if(tagList1.length >0){
                self.tagsList1.push(tagList1)
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
      //保存屏幕
      screenSave(tagsArr){
        let self = this
        Api.screenSaves(
          {
            screenId:self.dialogInfo.screenId,
            centerId:self.dialogInfo.centerId,
            operation:self.dialogInfo.radio,
            operationShopId:self.dialogInfo.operationShopId,
            useShopId:self.dialogInfo.useShopId,
            tags:tagsArr
          }
        ).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            self.centerDialogVisible = false
            self.dialogInfo.screenName = ''
            self.dialogInfo.screenId =''
            self.dialogInfo.centerId =''
            self.dialogInfo.radio = 0
            self.dialogInfo.operationShopId = ''
            self.dialogInfo.operationShopName = ''
            self.dialogInfo.useShopId = ''
            self.dialogInfo.useShopName =''
            if(self.activeName === 'nowUser'){
              self.page.pageNo = 1
              self.page.total = 0
              self.screenFindPage(1)
            }else{
              self.nowUserIndex = 1
              self.noUserIndex = 0
              self.findPageUnuse(1)
              self.page.pageNo = 1
              self.page.total = 0
              self.activeName = 'nowUser'
              self.screenFindPage(1)
            }
            self.$message({
              message: '编辑屏幕成功',
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
      //查询商户名称
      shopLoadName(shopId,opt){
        let self = this
        Api.shopLoadName({shopId:shopId}).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            if(data.object){
              if(opt === '运营id'){
                self.dialogInfo.operationShopName = data.object
                }else{
                  self.dialogInfo.useShopName = data.object
                }
            }else{
                if(opt === '运营id'){
                  self.dialogInfo.operationShopName = ''
                  self.dialogInfo.operationShopId = ''
                }else{
                  self.dialogInfo.useShopName =''
                  self.dialogInfo.useShopId = ''
                }
                Swal({
                text:'查无此ID',
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
  .ScreenManage{
    .el-table th{
      background-color: #F5F5F6;
    }
    .el-dialog{
      .el-dialog__body{
        .diaScreen{
          .diaScreenss{
            overflow-y: scroll;
            height: 200px;
            ::-webkit-scrollbar {
              width: 1px;
            }
          }
          
          padding: 10px;
          background-color: #F5F5F6;
          margin-bottom: 20px;
          .screenLabel{
            display: block;
            padding: 10px 0;
          }
        }
        .el-form-item__label{
          font-size: 12px;
        }
      }
      .el-dialog__footer{
        padding-top: 20px;
        background-color: #F5F5F6;
      }
    }
  }
</style>
