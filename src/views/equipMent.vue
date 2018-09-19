<template>
  <div class="equipMent">
    <section class="con">
      <figure>
        <div class="crumbs">
          <span>设备管理</span>
        </div>
      </figure>
      <div class="box" v-loading='load_data' element-loading-text="拼命加载中">
        <el-tabs v-model="activeName" type="card" @tab-click="tabClick">
          <el-tab-pane label="主机" name="Hosts"></el-tab-pane>
          <el-tab-pane label="屏" name="screens"></el-tab-pane>
        </el-tabs>
        <div v-show="activeName ==='Hosts'">
          <el-button type="primary" class="tabButton" @click="newHost">新增主机</el-button>
          <el-form :inline="true" label-position="top">
            <el-form-item label="主机编号">
              <el-input placeholder="输入设备编号搜索" v-model="hostsList.deviceNumber">
                <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
              </el-input>
            </el-form-item>
            <el-form-item label="主机名称">
              <el-input placeholder="输入设备名称搜索" v-model="hostsList.deviceName">
                <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
              </el-input>
            </el-form-item>
            <el-form-item label="所有商户名称">
              <el-input placeholder="输入设备名称搜索" v-model="hostsList.shopName">
                <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
              </el-input>
            </el-form-item>
            <el-form-item label="所有商户ID">
              <el-input placeholder="输入设备名称搜索" v-model="hostsList.shopId">
                <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
              </el-input>
            </el-form-item>
            <el-form-item style='margin-top:40px;'>
              <el-checkbox v-model="hostsList.longTimeVisit" label="长时间未访问" border>长时间未访问</el-checkbox>
            </el-form-item>
            <el-form-item style='margin-top:40px;'>
              <el-button type="primary" icon="el-icon-search"  @click="searchHost">搜索</el-button>
            </el-form-item>
            <el-form-item style='margin-top:40px;'>
              <el-button type="primary"  @click="clearHost">清空</el-button>
            </el-form-item>
            <el-table :data="tableData1" element-loading-text="拼命加载中">
              <el-table-column align="center" prop="number" label="主机编号"></el-table-column>
              <el-table-column align="center" prop="name" label="主机名称"></el-table-column>
              <el-table-column align="center" prop="shopName" label="所有商户"></el-table-column>
              <el-table-column align="center" prop="shopId" label="所有商户ID"></el-table-column>
              <el-table-column align="center" prop="visitTime" label="上次访问时间"></el-table-column>
              <el-table-column align="center" label="连接屏数量">
                <template slot-scope="scope">
                  <p style="color:#409EFF; cursor: pointer;" @click="lookScreenNum(scope)">{{scope.row.screenCount}}</p>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="addScreen(scope)">新增屏幕</el-button>
                  <el-button type="text" @click="editHost(scope)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
        <div v-show="activeName ==='screens'">
          <el-button type="primary" class="tabButton" @click="newAddScreen">新增屏</el-button>
          <el-form :inline="true" label-position="top">
            <el-form-item label="主机设备编号">
              <el-input placeholder="输入设备编号搜索" v-model="screensList.deviceNumber">
                <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
              </el-input>
            </el-form-item>
            <el-form-item label="关联主机所属商户名称">
              <el-input placeholder="输入设备名称搜索" v-model="screensList.shopName">
                <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
              </el-input>
            </el-form-item>
            <el-form-item label="关联主机所属商户ID">
              <el-input placeholder="输入设备名称搜索" v-model="screensList.shopId">
                <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="屏名称">
              <el-input placeholder="输入屏名称搜索" v-model="screensList.screenName">
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-form-item> -->
            <el-form-item label="屏物理ID">
              <el-input placeholder="输入设备名称搜索" v-model="screensList.selfId">
                <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
              </el-input>
            </el-form-item>
            <el-form-item style='margin-top:40px;'>
              <el-checkbox v-model="screensList.longTimeVisit" label="长时间未访问" border>长时间未访问</el-checkbox>
            </el-form-item>
            <el-form-item style='margin-top:40px;'>
              <el-button type="primary" icon="el-icon-search" @click="searchHost">搜索</el-button>
            </el-form-item>
            <el-form-item style='margin-top:40px;'>
              <el-button type="primary"  @click="clearHost">清空</el-button>
            </el-form-item>
            <el-table :data="tableData2" v-loading="load_data" element-loading-text="拼命加载中" class='tables2'>
              <el-table-column prop="name" label="屏名称"></el-table-column>
              <el-table-column prop="selfId" label="屏物理ID"></el-table-column>
              <el-table-column prop="ratio" label="屏分辨率（像素）">
              </el-table-column>
              <el-table-column prop="shopName" label="关联主机所属商户名称"></el-table-column>
              <el-table-column prop="shopId" label="关联主机所属商户ID"></el-table-column>
              <el-table-column prop="deviceNumber" label="主机设备编号"></el-table-column>
              <el-table-column prop="visitTime" label="上次访问时间"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="editScreen(scope)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
        <el-pagination :pageSize="page.pageRow" layout="total, prev, pager, next"
            :total="page.total" prev-text="上页" next-text="下页" @current-change="pageChange" :current-page.sync="page.pageNo"></el-pagination>
      </div>
      <el-dialog :title="hostDia.title" :visible.sync="centerDialogVisible" :show-close="false" :close-on-click-modal="false">
        <el-form label-width="100px" label-position="right">
          <el-form-item label="主机编号" :required='true' v-show="hostEditType">
            {{hostDia.deviceNumber}}
          </el-form-item>
          <el-form-item label="主机名称" :required='true'>
            <el-input v-model="hostDia.deviceName" style="width:80%;"></el-input>
          </el-form-item>
          <el-form-item label="所有权" :required='true'>
            <el-radio-group v-model="hostDia.owner" @change="owenSwitch">
              <el-radio :label=0>脸脸所有</el-radio>
              <el-radio :label=1>商户所有</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="所有商户ID" :required='true' v-show="hostDia.owner == 1">
            <el-input type="number" v-model="hostDia.shopId" v-on:blur="searchOwer" style="width:80%;" oninput="if(value.length>8)value=value.slice(0,8)">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="所有商户" v-show="hostDia.owner == 1">
            {{hostDia.shopName}}
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="hostDia.title == '新增主机'" type="primary" @click="nowAdd">立即新增</el-button>
          <el-button v-if="hostDia.title == '编辑主机'" type="primary" @click="nowAdd">保存</el-button>
          <el-button @click="cancelAdd">取消</el-button>
        </span>
      </el-dialog>
      <!-- 新增屏幕 -->
      <el-dialog title="新增屏幕" :visible.sync="addDialogVisible" :close-on-click-modal="false" class='addScreenDia' @close="cancelScreenLists" width='750px'>
        <div class="hostInfor">
          <p>主机信息</p>
          <p class="pList"><span class="hostSpan">主机名称：</span><span>{{addScreens.deviceName}}</span></p>
          <p class="pList"><span class="hostSpan">主机编号：</span><span>{{addScreens.deviceNumber}}</span></p>
        </div>
        <div class='divConTent'>
          <div class='leftDiv'>
            <ul class="newScreenList" v-show="addScreens.addScreenList.length>0">
              <li v-for="(item,index) in addScreens.addScreenList">
                <div class="hostInfor">
                  <p class="hostP"><span>新增屏</span>
                  <!-- <span class='removeFileSpan' @click="deletHost(index)">删除</span> -->
                  </p>
                  <el-form label-width="100px" label-position="right">
                    <el-form-item label="屏名称：" :required='true'>
                      <el-input v-model="item.name" style="width:90%;" placeholder="输入所属屏幕名称"></el-input>
                    </el-form-item>
                    <el-form-item label="屏物理ID：">
                      <el-input type="number" v-model="item.selfId" style="width:90%;" placeholder="输入所属屏幕物理ID" oninput="if(value.length>10)value=value.slice(0,10)"></el-input>
                    </el-form-item>
                    <div class="screenFbl">
                      <p><span style="color:#272727">屏分辨率</span> <span style="color:#8D8987;font-size: 12px;">(单位：像素)</span></p>
                      <el-form-item label="宽" label-width="30px">
                        <el-input type="number" v-model="item.width" style="width:90%;" placeholder="输入屏幕高度像素" oninput="if(value.length>6)value=value.slice(0,6)"></el-input>
                      </el-form-item>
                      <el-form-item label="高" label-width="30px">
                        <el-input type="number" v-model="item.height" style="width:90%;" placeholder="输入屏幕宽度像素" oninput="if(value.length>6)value=value.slice(0,6)"></el-input>
                      </el-form-item>
                  </div>
                  </el-form>
                </div>
              </li>
            </ul>
            <span slot="footer" class="dialog-footer">
              <el-button @click="nowAddScreenList" style="width:95%">新增屏幕</el-button>
              <!-- <el-button type="primary" @click="nowAddScreenList">立即新增</el-button> -->
              <!-- <el-button @click="cancelScreenList">取消</el-button> -->
            </span>
          </div>
          <div class="hasInfor">
            <div class="hostInfor hasInforList" v-for="(item,index) in addScreens.hasScreenList" v-show="addScreens.hasScreenList.length>0">
              <p class='fileList'>
                <span><span v-if="index == 0">已有屏</span></span>
                <span>
                  <span class='removeFileSpan' v-if="index != 0" @click="moveUp(item,index)">上移</span>
                  <span class='removeFileSpan' v-if="index !== addScreens.hasScreenList.length-1" @click="moveDown(item,index)">下移</span>
                </span>
              </p>
              <p class="pList"><span class="hasScreenSpan">屏名称：</span><span>{{item.screenName}}</span></p>
              <p class="pList"><span class="hasScreenSpan">屏物理ID：</span><span v-if="item.selfId">{{item.selfId}}</span><span v-if="!item.selfId" class="hostSpan">未绑定物理ID</span></p>
            </div>
            <div v-show="addScreens.hasScreenList.length ==0">
              <p style="padding:10px;">已有屏</p>
              <p style="padding:10px;text-align:center">暂无已有屏</p>
            </div>
          </div>
        </div>
        <el-button class="addBtn" @click="addScrenInfo" style="display:none;">新增屏</el-button>
      </el-dialog>
      <!-- 新增屏幕 -->
      <el-dialog :title="addScreenForm.title" :visible.sync="addScreenDia" :show-close='false' :close-on-click-modal="false">
        <el-form label-width="100px" label-position="right">
          <el-form-item label="屏名称：" :required='true'>
            <el-input v-model="addScreenForm.screenName" style="width:90%;" placeholder="输入所属屏名称"></el-input>
          </el-form-item>
          <el-form-item label="屏物理ID：">
            <el-input type="number" v-model="addScreenForm.selfId" style="width:90%;" placeholder="输入所属物理屏ID" oninput="if(value.length>10)value=value.slice(0,10)"></el-input>
          </el-form-item>
          <div class="screenFbl" style="background:#F5F5F6;margin-bottom:10px;">
              <p><span style="color:#272727">屏分辨率</span> <span style="color:#8D8987;font-size: 12px;">(单位：像素)</span></p>
              <el-form-item label="宽" label-width="30px">
                <el-input type="number" v-model="addScreenForm.width" style="width:90%;" placeholder="输入屏幕高度像素" oninput="if(value.length>6)value=value.slice(0,6)"></el-input>
              </el-form-item>
              <el-form-item label="高" label-width="30px">
                <el-input type="number" v-model="addScreenForm.height" style="width:90%;" placeholder="输入屏幕宽度像素" oninput="if(value.length>6)value=value.slice(0,6)"></el-input>
              </el-form-item>
          </div>
          <p style="border-top:1px solid #DFF4F4;padding:10px 0;">绑定主机</p>
          <el-form-item label="主机编号：">
            <el-input v-model="addScreenForm.deviceNumber" style="width:90%;" placeholder="输入所属主机编号进行查询" @change="addScrDevic">
              <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
            </el-input>
          </el-form-item>
          <el-form-item label="主机名称：">
            {{addScreenForm.deviceName}}
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="addScreenForm.title =='新增屏'" type="primary" @click="immediatelyAdd">立即新增</el-button>
          <el-button v-if="addScreenForm.title =='编辑屏'" type="primary" @click="immediatelyAdd">保存</el-button>
          <el-button @click="immediatelyCancel">取消</el-button>
        </span>
      </el-dialog>
    </section>
  </div>
</template>
<script>
import * as Api from "@/api/api1"
const Swal=require("sweetalert2")
const lodash = require('lodash')
  export default{
    name:'EquipMent',
    data(){
      return{
        centerDialogVisible:false,//新建和编辑主机
        addDialogVisible:false,//新增屏幕
        addScreenDia:false,//新增屏
        activeName:'Hosts',
        load_data:true,
        flag:true,
        tabIndex:'',
        hostIndex:0,
        screenIndex:0,
        hostEditType:false,
        hostDia:{
          title:'',
          deviceId:'',
          deviceNumber:'',
          deviceName:'',
          owner:0,
          shopId:'',
          shopName:''
        },
        page:{
          pageRow:0,
          pageNo:1,
          totalPageNo:0,
          total:0
        },
        hostsList:{//主机列表
          deviceNumber:'',
          deviceName:'',
          shopName:'',
          shopId:'',
          longTimeVisit:'',
        },
        screensList:{//屏列表
          deviceId:'',
          deviceNumber:'',
          shopName:'',
          shopId:'',
          selfId:'',
          screenName:'',
          longTimeVisit:''
        },
        addScreens:{//添加屏
            deviceId:'',
            deviceName:'',
            deviceNumber:'',
          addScreenList:[],//新增屏幕列表
          hasScreenList:[
          ],//已有屏列表
        },
        addScreenForm:{
          title:'',
          screenName:'',
          screenId:'',
          selfId:'',
          width:'',
          height:'',
          deviceId:'',
          deviceNumber:'',
          deviceName:''
        },
        tableData1:[],
        tableData2:[]
      }
    },
    mounted() {
      this.load_data = true
      this.hostTab(1)
    },
    methods: {
      //切换
      tabClick(){
        for(let i in this.page){
          if(i === 'pageNo'){
            this.page[i] = 1
          }else{
            this.page[i] = 0
          }
        }
        this.load_data = true
        if(this.activeName === 'Hosts'){
          this.hostIndex += 1
          if(this.hostIndex === 1){
            this.screenIndex = 0
            this.page.pageNo = 1
            this.hostTab(1)
          }else{
            this.load_data = false
          }
        }
        if(this.activeName === 'screens'){
          this.screensList.deviceId = ''
          this.screenIndex += 1
          if(this.screenIndex === 1){
            this.hostIndex = 0
            this.page.pageNo = 1
            this.screenTab(1)
          }else{
            this.load_data = false
          }
          
        }
      },
      //搜索
      searchHost(){
        this.load_data = true
        if(this.activeName === 'Hosts'){
          this.hostTab(1)
        }else if(this.activeName === 'screens'){
          this.screenTab(1)
        }
      },
      clearHost(){
        this.load_data = true
        if(this.activeName === 'Hosts'){
          for(var i in this.hostsList) {
            this.hostsList[i] = ''
          }
          this.hostTab(1)
        }else if(this.activeName === 'screens'){
          for(var i in this.screensList) {
            this.screensList[i] = ''
          } 
          this.screenTab(1)
        }
      },
      //分页
      pageChange(val){
        this.page.pageNo = val
        if(this.activeName == 'Hosts'){
          this.hostTab(val)
        }else if(this.activeName === 'screens'){
          this.screenTab(val)
        }
      },
      //新增主机
      newHost(){
        this.hostDia.title = '新增主机'
        this.centerDialogVisible = true
        this.hostEditType = false
      },
      //编辑屏幕
      editHost(scope){
        this.tabIndex = scope.$index
        this.centerDialogVisible = true
        this.hostDia.title = '编辑主机'
        this.hostDia.deviceId = scope.row.deviceId
        this.hostDia.deviceNumber = scope.row.number
        this.hostDia.deviceName = scope.row.name
        if(scope.row.shopId == 0 || scope.row.shopId == 40261649){
          this.hostDia.owner = 0
        }else{
          this.hostDia.owner = 1
        }
        this.hostDia.shopName = scope.row.shopName
        this.hostDia.shopId = scope.row.shopId
      },
      //搜索商户ID
      searchOwer(){
        this.load_data = true
        if(this.hostDia.shopId == 40261649){
          this.hostDia.shopId = ''
          this.hostDia.shopName=''
          Swal({
            text: '该商家为脸脸专有，请选择其他商户',
            allowOutsideClick:false
          })
          this.load_data = false
        }else{
          this.shopLoadName(this.hostDia.shopId)
        }
      },
      addScrDevic(){
        this.loadInfoByNumber(this.addScreenForm.deviceNumber)
      },
      //新增屏幕
      addScreen(scope){
        this.addDialogVisible = true
        this.addScreens.deviceName = scope.row.name
        this.addScreens.deviceNumber = scope.row.number
        this.addScreens.deviceId	 = scope.row.deviceId
        let obj ={}
        obj.deviceId = this.addScreens.deviceId
        obj.name = ''
        obj.selfId = ''
        obj.width = ''
        obj.height = ''
        this.addScreens.addScreenList.push(obj)
        this.screenLoadInfo(scope.row.deviceId)
      },
      //新增屏幕
      addScrenInfo(){
        if(this.addScreens.addScreenList.length === 0){
          let obj ={}
          obj.deviceId = this.addScreens.deviceId
          obj.name = ''
          obj.selfId = ''
          obj.width = ''
          obj.height = ''
          this.addScreens.addScreenList.push(obj)
        }else{
          this.addScreenJudge()
        }
      },
      //上移
      moveUp(item,index){
        let num = index - 1
        let screenId = item.screenId
        let screenId2 = this.addScreens.hasScreenList[num].screenId
        this.exchange(screenId,screenId2)
      },
      //下移
      moveDown(item,index){
        let num = index + 1
        let screenId = item.screenId
        let screenId2 = this.addScreens.hasScreenList[num].screenId
        this.exchange(screenId,screenId2)
      },
      //查看主机列表
      lookScreenNum(scope){
        this.activeName = 'screens'
        this.page.pageNo = 1
        this.screensList.deviceId = scope.row.deviceId
        this.screenTab(1)
      },
      //删除主机
      deletHost(index){
        let ind =index -1
        this.addScreens.addScreenList.splice(ind,1)
      },
      //立即添加新建的屏
      nowAddScreenList:lodash.debounce(function(){
        if(this.addScreens.addScreenList.length >0){
          let len = this.addScreens.addScreenList.length
          let noConditions = 0
          for(let i=0;i<len;i++){
              if(this.addScreens.addScreenList[i].name == ''){
                this.$message({
                  message: '屏名称不能为空',
                  type: 'warning'
                })
                noConditions =1
                break;
              }else if(this.addScreens.addScreenList[i].name.length>16){
                this.$message({
                  message: '屏名称不能超过16个字',
                  type: 'warning'
                })
                noConditions =1
                break;
              }else{
                if(this.addScreens.addScreenList[i].width !='' || this.addScreens.addScreenList[i].height !=''){
                  if(this.addScreens.addScreenList[i].width<0 || this.addScreens.addScreenList[i].height<0){
                    this.$message({
                      message: '屏的宽不能小于0',
                      type: 'warning'
                    })
                    noConditions =1
                    break;
                  }
                  if(this.addScreens.addScreenList[i].width =='' || this.addScreens.addScreenList[i].height ==''){
                    this.$message({
                      message: '屏的宽高必选同时存在',
                      type: 'warning'
                    })
                    noConditions =1
                    break;
                  }
                }
              }
          }
          if(noConditions === 0){
            this.load_data = true
            let obj ={
              deviceId:this.addScreens.deviceId,
              name:this.addScreens.addScreenList[0].name,
              selfId:this.addScreens.addScreenList[0].selfId,
            }
            if(this.addScreens.addScreenList[0].width != ''){
              obj.width=this.addScreens.addScreenList[0].width
              obj.height=this.addScreens.addScreenList[0].height
            }
            this.screenSave(obj)
          }
        }else{
          if(this.addScreens.addScreenList.length === 0){
            this.$message({
              message: '请新增屏',
              type: 'warning'
            })
          }
        }
      },300),
      cancelScreenList(){ 

        for(let i in this.addScreens.addScreenList[0]){
          this.addScreens.addScreenList[0][i] = ''
        }
      },
      cancelScreenLists(){
        this.addDialogVisible = false
        this.hostTab(this.page.pageNo)
        this.addScreens.deviceName = ''
        this.addScreens.deviceNumber = ''
        this.addScreens.addScreenList= []
      },
      //所有权切换
      owenSwitch(){
        if(this.hostDia.shopId == 0 || this.hostDia.shopId == 40261649){
          this.hostDia.shopId = ''
          this.hostDia.shopName = ''
        }
      },
      //立即添加
      nowAdd:lodash.debounce(function(){
        if(this.hostDia.deviceName === ''){
          this.$message({
            message: '主机名称不能为空',
            type: 'warning'
          })
        }else{
          if(this.hostDia.owner != 0){
            if(this.hostDia.shopId == ''){
              this.$message({
                message: '所有商户ID不空',
                type: 'warning'
              })
            }
            else if(this.hostDia.shopName == ''){
              this.$message({
                message: '所有商户名称不空',
                type: 'warning'
              })
            }
            else{
              //调接口
              if(this.flag){
                this.load_data = true
                this.flag = false
                this.deviceSave()
              }
            }
          }else{
            //调接口
            this.load_data = true
            this.deviceSave()
          }
        }
      },300),
      //取消
      cancelAdd(){
        this.centerDialogVisible = false
        for(let i in this.hostDia){
          this.hostDia[i] = ''
          if(i === 'owner'){
            this.hostDia[i] = 0
          }
          if(i === 'shopId'){
            this.hostDia[i] = 0
          }
        }
      },
      //新增屏
      newAddScreen(){
        this.addScreenDia = true
        this.addScreenForm.title= '新增屏'
      },
      //编辑屏
      editScreen(scope){
        this.tabIndex = scope.$index
        this.addScreenDia = true
        this.addScreenForm.title = '编辑屏'
        this.addScreenForm.screenName = scope.row.name
        this.addScreenForm.selfId = scope.row.selfId
        this.addScreenForm.deviceId = scope.row.deviceId
        this.addScreenForm.deviceNumber = scope.row.deviceNumber
        this.loadInfoByNumber(this.addScreenForm.deviceNumber,'编辑')
        this.addScreenForm.screenId = scope.row.screenId
        this.editScreenInfo(scope.row.screenId)
      },
      immediatelyAdd:lodash.debounce(function(){ 
        if(this.addScreenForm.screenName === ''){
          this.$message({
            message: '屏名称不能为空',
            type: 'warning'
          })
        }else{
          if(this.addScreenForm.width !='' || this.addScreenForm.height !=''){
            if(this.addScreenForm.width<0 || this.addScreenForm.height<0){
              this.$message({
                message: '屏的宽不能小于0',
                type: 'warning'
              })
            }else if(this.addScreenForm.width =='' || this.addScreenForm.height ==''){
              this.$message({
                message: '屏的宽高必选同时存在',
                type: 'warning'
              })
            }else if(this.addScreenForm.deviceNumber !=='' && this.addScreenForm.deviceName === ''){
               this.$message({
                  message: '查无此ID',
                  type: 'warning'
                })
             }else{
                this.load_data  =true
                this.screenSave()
             }
          }else{
            this.load_data  =true
            this.screenSave()
          }
        }
      },300),
      immediatelyCancel(){
        this.addScreenDia = false
        for(let i in this.addScreenForm){
          this.addScreenForm[i] = ''
        }
      },
      hostTab(pageNo){
        let self=this
        let longTimeVisit = ''
        if(self.hostsList.longTimeVisit === ''){
          longTimeVisit = false
        }else{
          longTimeVisit = true
        }
        Api.findList(
          {
            number:self.hostsList.deviceNumber,//设备编号
            name:self.hostsList.deviceName,
            shopName:self.hostsList.shopName,
            shopId:self.hostsList.shopId,
            longTimeVisit:longTimeVisit,
            pageNo:pageNo
          }
        ).then(function(res) {
          let data = res.data
          if(data.status == 0){
            self.load_data = false
            self.page.pageRow = data.object.pageRow
            self.page.pageNo = data.object.pageNo
            self.page.total = data.object.total
            self.page.lastPage = data.object.lastPage
            self.tableData1 = data.object.objects
          }else{
            self.$message.error(res.errorMsg)
          }
        }).catch(function(error) {
          Swal({
            text:'请求服务器失败',
            allowOutsideClick:false
          })
          self.load_data = false
        })
      },
      screenTab(pageNo){
        let self=this
        let longTimeVisit = ''
        if(self.screensList.longTimeVisit === ''){
          longTimeVisit = false
        }else{
          longTimeVisit = true
        }
        Api.screenList(
          {
            deviceId:self.screensList.deviceId,
            screenName:self.screensList.screenName,
            deviceNumber:self.screensList.deviceNumber,//设备编号
            shopName:self.screensList.shopName,
            shopId:self.screensList.shopId,
            longTimeVisit:longTimeVisit,
            selfId:self.screensList.selfId,
            pageNo:pageNo
          }
        ).then(function(res) {
          let data =res.data
          if(data.status == 0){
            self.load_data = false
            if(data.object){
              self.page.pageRow = data.object.pageRow
              self.page.pageNo = data.object.pageNo
              self.page.total = data.object.total
              self.page.lastPage = data.object.lastPage
              self.tableData2 = data.object.objects
            }else{
              self.tableData2 = []
            }
          }else{
            self.$message.error(data.errorMsg)
          }
        }).catch(function(error) {
          self.load_data = false
          Swal({
            text:'请求屏列表服务器失败',
            allowOutsideClick:false
          })
        })
      },
      //新建和编辑接口
      deviceSave(){
        let self=this
        let obj ={
          name:self.hostDia.deviceName,
          owner:self.hostDia.owner,
        }
        if(self.hostDia.owner ==0){
          obj.shopId= 40261649
        }else{
          obj.shopId = self.hostDia.shopId
        }
        if(self.hostDia.title == '编辑主机'){
          obj.deviceId = self.hostDia.deviceId
        }
        Api.deviceSave(obj).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.flag = true
            self.load_data = false
            self.centerDialogVisible = false
            if(self.hostDia.title == '编辑主机'){
              self.tableData1[self.tabIndex].name =self.hostDia.deviceName
              self.tableData1[self.tabIndex].owner =self.hostDia.owner
              if(self.hostDia.owner==0){
                self.tableData1[self.tabIndex].shopId =40261649
                self.tableData1[self.tabIndex].shopName ='脸脸所有'
              }else{
                self.tableData1[self.tabIndex].shopId =self.hostDia.shopId
                self.tableData1[self.tabIndex].shopName =self.hostDia.shopName
              }
              self.$message({
                message: '编辑主机成功',
                type: 'success'
              })
            }else{
              self.$message({
                message: '新增主机成功',
                type: 'success'
              })
              self.hostTab(1)
            }
            for(let i in self.hostDia){
              if(i === 'owner'){
                self.hostDia[i] = 0
              }else{
                self.hostDia[i] = ''
              }
            }
            self.tabIndex = ''
          }else{
             self.load_data = false
            self.$message.error(data.errorMsg)
          }
        }).catch((error) =>{
          self.$message.error(error)
        })
      },
      //新建和编辑屏接口以及设备列表的新增屏幕接口
      screenSave(objs){
        let self = this
        let obj= ''
        if(self.activeName === 'Hosts'){
          obj = objs
        }else{
          obj ={
            deviceId:self.addScreenForm.deviceId,
            name:self.addScreenForm.screenName,
            selfId:self.addScreenForm.selfId,
          }
          if(self.addScreenForm.width === ''){
            // obj.width =0
          }else{
            obj.width =self.addScreenForm.width
          }
          if(self.addScreenForm.height === ''){
            // obj.height =0
          }else{
            obj.height =self.addScreenForm.height
          }
          if(self.addScreenForm.title === '编辑屏'){
            obj.screenId =self.addScreenForm.screenId
          }
        }
        Api.screenSave(obj).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            if(self.activeName === 'Hosts'){
              for(let i in self.addScreens.addScreenList[0]){
                self.addScreens.addScreenList[0][i] = ''
              }
              self.$message({
                message: '成功添加屏',
                type: 'success'
              })
              self.screenLoadInfo(obj.deviceId)
            }else{
              self.addScreenDia = false
              if(self.addScreenForm.title === '编辑屏'){
                self.$message({
                message: '编辑屏幕成功',
                type: 'success'
              })
                self.screenTab(self.page.pageNo)
              }else{
                self.$message({
                  message: '新增屏幕成功',
                  type: 'success'
                })
                self.page.pageNo = 1
                self.screenTab(1)
              }
              for(let i in self.addScreenForm){
                self.addScreenForm[i] = ''
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
      //查询设备详情
      deviceLoadInfo(deviceId){
        let self=this
        self.addScreenForm.deviceId = ''
        Api.deviceLoadInfo(
          {
            deviceId:deviceId
          }
        ).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            if(data.object){
              self.addScreenForm.deviceId =data.object.deviceId
              self.addScreenForm.deviceName = data.object.shopName
            }else{
              self.addScreenForm.deviceId = ''
              self.addScreenForm.deviceName = ''
              Swal({
                text:'查无此id',
                allowOutsideClick:false
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
      //查询主机xinxi
      loadInfoByNumber(number,name){
        let self=this
        Api.loadInfoByNumber(
          {
            number:number
          }
        ).then((res) =>{
          let data =res.data
          if(data.status === 0){
            self.load_data = false
            if(data.object){
              self.addScreenForm.deviceNumber =data.object.number
              self.addScreenForm.deviceName = data.object.name
              self.addScreenForm.deviceId = data.object.deviceId
            }
          }else{
            self.addScreenForm.deviceNumber = ''
            self.addScreenForm.deviceName = ''
            self.addScreenForm.deviceId =''
            if(name == undefined){
              Swal({
                text:data.errorMsg,
                allowOutsideClick:false
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
      //查询商户所有权
      shopLoadName(shopId){
        let self = this
        Api.shopLoadName({shopId:shopId}).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            if(data.object){
              self.hostDia.shopName = data.object
            }else{
              self.hostDia.shopId = ''
              self.hostDia.shopName=''
              Swal({
                text: '查无此id',
                allowOutsideClick:false
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
      //编辑屏列表
      editScreenInfo(screenId){
        let self=this
        Api.editScreenInfo(
          {
            screenId:screenId
          }
        ).then((res) =>{
          let data = res.data
          if(data.status === 0){
            if(data.object){
              this.addScreenForm.screenName = data.object.name
              this.addScreenForm.selfId = data.object.selfId
              this.addScreenForm.width = data.object.width
              this.addScreenForm.height = data.object.height
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
      //查询设备屏幕详情
      screenLoadInfo(deviceId){
        let self=this
        Api.screenLoadInfo({
          deviceId:deviceId
        }).then((res) =>{
          let data = res.data
          if(data.status === 0){
              self.addScreens.hasScreenList = data.object.screens
          }
          else{
            this.$message({
                message: '查无此id',
                type: 'warning'
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
      //添加屏时对屏的判断
      addScreenJudge(){
        let len = this.addScreens.addScreenList.length-1
          if(this.addScreens.addScreenList[len].name === ''){
            this.$message({
              message: '屏名称不能为空',
              type: 'warning'
            })
          }else if(this.addScreens.addScreenList[len].name.length>16){
            this.$message({
              message: '屏名称不能超过16个字',
              type: 'warning'
            })
          }else{
            if(this.addScreens.addScreenList[len].width !='' || this.addScreens.addScreenList[len].height !=''){
              if(this.addScreens.addScreenList[len].width<0 || this.addScreens.addScreenList[len].height<0){
                this.$message({
                  message: '屏的宽高不能小于0',
                  type: 'warning'
                })
              }else{
                let obj ={}
                obj.deviceId = this.addScreens.deviceId
                obj.name = ''
                obj.selfId = ''
                obj.width = ''
                obj.height = ''
                this.addScreens.addScreenList.push(obj)
              }
            }else{
              let obj ={}
              obj.deviceId = this.addScreens.deviceId
              obj.name = ''
              obj.selfId = ''
              obj.width = ''
              obj.height = ''
              this.addScreens.addScreenList.push(obj)
            }
          }
      },
      //交换屏的顺序
      exchange(screenId,screenId2){
        let self = this
        Api.exchange(
          {
            screenId:screenId,
            screenId2:screenId2
          }
        ).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.$message({
              message: '成功调整屏幕顺序',
              type: 'success'
            })
            self.screenLoadInfo(self.addScreens.deviceId)
          }
          else{
            this.$message({
              message: data.errorMsg,
              type: 'warning'
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
  .equipMent{
    .el-tabs__header{
      margin: 0;
    }
    .el-form--label-top .el-form-item__label{
      padding: 0;
      height: 40px;
    }
    .tabButton{
      margin: 20px 0;
    }
    .addScreenDia{
      .el-dialog__body{
        padding:10px 10px;
      }
    }
    // 新增屏
    .hostInfor{
      background-color: #F5F5F6;
      padding: 10px;
      color: #272727;
      .hostP{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .pList{
        padding-left:10px;
        margin-top: 10px; 
        .hostSpan{
          color: #8D8987;
        }
        .hasScreenSpan{
          display: inline-block;
          width:30%;
        }
      }
    }
    .screenFbl{
      p{
        margin-bottom: 10px;
      }
      background: #fff;
      padding:10px 20px;
    }
    .addBtn{
      width: 100%;
      margin-top: 10px;
    }
    .divConTent{
      display: flex;
      flex-direction: row;
      .leftDiv{
        flex: 1;
        .newScreenList{
          max-height: 340px;
          li{
            margin-top: 10px;
          }
        }
        .dialog-footer{
          display: block;
          width: 100%;
          text-align: center;
          background-color: #F5F5F6;
          padding-bottom: 10px;
        }
      }
      .hasInfor{
        background-color: #F5F5F6;
        margin-left: 10px;
        flex: 1;
        max-height: 340px;
        overflow-y: scroll;
        ::-webkit-scrollbar {
          width: 1px;
        }
        margin-top: 10px;
        .hasInforList{
          border-bottom: 1px solid #E4E7E9;
          .fileList{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 10px 0;
          }
        }
      } 
    }
    .removeFileSpan:hover{
        cursor: pointer;
        color:#409EFF;
      }
  }
</style>
