<template>
  <div class="cloudPlan">
    <section class="con">
      <figure>
        <div class="crumbs">
          <span>播放计划</span>
        </div>
      </figure>
      <div class="box" @mouseover="allConst" v-loading='load_data' element-loading-text="拼命加载中">
        <el-tabs v-model="activeName" @tab-click="dataPlan" class="elTabs-container" v-if="viewSwitche">
          <!-- <el-tab-pane label="日计划" name="dayPlan"></el-tab-pane> -->
          <el-tab-pane label="周计划" name="WeekPlan"></el-tab-pane>
        </el-tabs>
         <el-form :inline="true">
          <el-form-item style="margin-bottom:0;">
            <el-button type="primary" @click="createPlan">新建计划</el-button>
          </el-form-item>
          <el-form-item style="float:right;right:0;margin-bottom:0;">
            <el-button-group>
            <el-button @click="chartView" :class="viewSwitche ? 'listViewSelect':''">图表视图</el-button>
            <el-button @click="listView" :class="viewSwitche ? '':'listViewSelect'">列表视图</el-button>
            </el-button-group>
          </el-form-item><br>
          <template v-if="viewSwitche">
            <div style="padding-top:20px;">
              <el-form-item label="门店:" class="selectTab" style="display:none;">
                <el-select v-model="stores" placeholder="全部门店">
                  <el-option-group v-for="group in storeList" :key="group.label" :label="group.label">
                    <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
              <el-form-item label="屏幕:" class="selectTab" v-if="activeName === 'WeekPlan'">
                <el-select v-model="screenSelct" placeholder="请选择屏幕" @change="screenSelectTime">
                  <el-option v-for="item in screens" :key="item.screenId" :label="item.screenName" :value="item.screenId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="selectTab selectRight">
                  <el-button  @click="prev"><i class="el-icon-arrow-left"></i></el-button>
                  <!-- <el-button @click="today" style="width:100px;position:relative" v-if="activeName === 'dayPlan'">今天</el-button> -->
                  <el-date-picker v-model="daySelect" type="date" placeholder="今天" v-if="activeName === 'dayPlan'" clear-icon='el-icon-circle-close' style="width:40%;"@change="today"></el-date-picker>
                  <el-button @click="week" style="width:140px;" v-if="activeName === 'WeekPlan'">{{weekContext}}</el-button>
                  <el-button @click="next"><i class="el-icon-arrow-right"></i></el-button><br>
                  <!-- <span style="color:#000;">同时段最多添加两个事件</span> -->
              </el-form-item>
            </div>
          </template>
         </el-form>
         <template v-if="viewSwitche">
          <ul class="list" :class="activeName === 'dayPlan' ? '':'listWeek'">
            <li v-for="item in list"><span class="fullSpan" :style="{background:item.colorStyle}"></span><span>{{item.text}}</span></li>
          </ul>
          <div class="scrollList" v-show="activeName === 'dayPlan'">
            <button class="prev" @click="screenPrev()" v-show="screenList.length>6"><i class="el-icon-arrow-left"></i></button>
            <ul class="ulList">
              <li v-for="(item,index) in screenList" @mouseover.stop="screenItem($event,index)">
                <p>{{item.value}}<i class="el-icon-arrow-down" v-show="screenPosition ===index"></i></p>
                <div class="screenPlan" v-show="screenPosition ===index" :style="{top:topScreen,left:leftScreen}">
                  <span @click.stop="lookScreen()">查看屏计划</span>
                  <span @click.stop="copyScreen(item)">复制屏计划</span>
                </div>
              </li>
            </ul>
            <button class="next" @click="screenNext()" v-show="screenList.length>6"><i class="el-icon-arrow-right"></i></button>
          </div>
         </template>
      </div>  
      <div id="calendar" style="height:900px;margin-top:-25px;" v-show="viewSwitche"></div>
      <!-- 列表视图 -->
      <template v-if="!viewSwitche">
        <div class="listView">
          <el-form :inline="true" label-position='top'>
            <el-form-item label="素材标题">
              <el-input placeholder="输入素材标题进行搜索" v-model="listViewDia.materalName">
                <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
              </el-input>
            </el-form-item>
            <el-form-item label="计划状态">
              <el-select v-model="listViewDia.planStatu" placeholder="请选择">
                <el-option v-for="item in planStatuList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计划时间">
              <el-date-picker v-model="listViewDia.palnTime" type="date" placeholder="选择时间" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="播放类型">
              <el-select v-model="listViewDia.playStatu" placeholder="请选择">
                <el-option v-for="item in playStatuList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="屏">
              <el-select v-model="listViewDia.allScreen" placeholder="请选择">
                <el-option v-for="item in screens" :key="item.screenId" :label="item.screenName" :value="item.screenId"></el-option>
              </el-select>
            </el-form-item>
             <el-form-item style="margin-top:50px;">
              <el-button type="primary" icon="el-icon-search" @click="searchScreen">搜索</el-button>
            </el-form-item>
            </el-form-item>
             <el-form-item style="margin-top:50px;">
              <el-button type="primary" icon="el-icon-search" @click="clearScreen">取消</el-button>
            </el-form-item>
            <el-table :data="materialData" style="width: 100%">
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
              <el-table-column align="center" prop="typeCN" label="播放类型"></el-table-column>
              <el-table-column prop="screenName" label="投屏"></el-table-column>
              <!-- <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="text">修改记录</el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <div class="pageAtion">
              <el-pagination :pageSize="page.pageRow" layout="total, prev, pager, next"
              :total="page.total" prev-text="上页" next-text="下页" @current-change="pageChange" :current-page.sync="page.pageNo"></el-pagination>
          </div>
          </el-form>
        </div>
      </template>
      <!-- 预览   -->
      <preview  :previewMateria="previewMateria" :previewInfo='previewInfo' @closePreview='closePreview'></preview>
       <!-- 素材列表 -->
      <materia-list :diaLogMateria="diaLogMateria" :materiaObject='materiaObject' @chooseMaterial="chooseMaterial"></materia-list>
      <!-- 屏列表 -->
      <screen-list :screenDialog="screenDialog" :addScreenList="addScreenList" @closeScreen='closeScreen' :openScreen='openScreen' :tabList='tabList'></screen-list>
      <!-- 新建计划 -->
      <el-dialog title='创建计划' :visible.sync="dialogVisible" :close-on-click-modal="false" :show-close="false">
        <el-form label-width='80px' label-position='right'>
          <el-form-item label="创建方式:">
            <el-radio-group v-model="material">
              <el-radio label="上传素材"></el-radio>
              <el-radio label="选择素材"></el-radio>
            </el-radio-group>
          </el-form-item>
            <!-- 上传的文件 -->
            <div v-if="uploadFileList.length > 0 && material==='上传素材'" v-for="(item,index) in uploadFileList" @click="getTokens">
              <p><span>{{item.materialName}} <span class='spanBtn'>{{item.matrialType}}</span></span></p>
              <el-upload action="https://up.qiniup.com/" style="margin:10px 0;" :before-upload='beforeUpload'
                :data="{token:token}" list-type="picture" :show-file-list="false" :on-success="success" :on-error="error" :disabled="uploadStatus">
                <el-button style="width:100%;" :loading="uploadStatus" @click="againUpload(item,index)">重新上传</el-button>
              </el-upload>
            </div>
            <!-- 选择的文件 -->
            <div class="slectFile" v-if="selectFileList.length>0 && material==='选择素材'" v-for="(item,index) in selectFileList">
              <p>{{item.typeCN}}</p>
              <ul class="selectFileList">
                <li style="overflow-x: hidden;">素材名称：{{item.name}}</li>
                <li>素材标签：{{item.tagName}}</li>
                <li v-show="item.type === 3">网页链接：{{item.url}}</li>
              </ul>
              <el-button size='medium' style="width:100%;" @click="againSelectMaterial(item,index)">重新选择素材</el-button>
            </div>
            <div @click="getTokens" v-if="uploadFileList.length<1">
              <el-upload v-show="material === '上传素材'" icon="el-icon-plus" action="https://up.qiniup.com/" style="margin-left:0;" :on-progress = 'onProgress' :before-upload='beforeUpload'
                :data="{token:token}" list-type="picture" :show-file-list="false" :on-success="success" :on-error="error" :disabled="uploadStatus">
                <el-button style="width:100%;" :loading="uploadStatus">上传素材</el-button>
              </el-upload>
            </div>
            <el-button v-show="material === '选择素材' && selectFileList.length<1" size='medium' style="width:100%;" @click="selectMaterial">选择素材</el-button>
          <el-form-item label="计划类型" style="border-top:1px solid #E4E7E9;margin-top:10px;">
            <el-radio-group v-model="playType">
              <el-radio :label=0>编播计划</el-radio>
              <el-radio :label=1>插播计划</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="计划时间" style="border-bottom:1px solid #E4E7E9;margin-bottom:10px;">
            <div class="rightTime">
              <el-date-picker style="width:100%;margin-bottom:10px;"
                v-model="beginTime"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <el-time-picker style="width:100%;"
                is-range
                v-model="endTime"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
              </el-time-picker>
            </div>
          </el-form-item>
          <el-form-item label="应用屏幕">
            <el-button @click="addScreen">添加屏幕</el-button><br>
            <el-tag v-for="item in addScreenList">{{item.screenName}}</el-tag>
          </el-form-item> 
        </el-form>
        <span slot="footer">
          <el-button type="primary" @click="btnSure">确 定</el-button>
          <el-button @click="btnFasle">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 修改单个计划或者多个计划 -->
      <el-dialog title='修改计划' :visible.sync="modifyPlanDia" :close-on-click-modal="false">
        <!-- 多个选择 -->
        <el-form v-show="modifyForm.modifyPlanStyle !=='single'" label-position="right" label-width="80px">
          <el-form-item label="已选计划:">
            <ul class="rightTime">
              <li v-for="item in modifyForm.planList">{{item.materaName}}</li>
            </ul>
          </el-form-item>
          <el-form-item label="推迟时间:">
            <el-input type="number" v-model="modifyForm.startTime" oninput="if(value.length>2)value=value.slice(0,2)" style="width:20%;"></el-input>小时
            <el-input type="number" v-model="modifyForm.endTime" oninput="if(value.length>2)value=value.slice(0,2)" style="width:20%;"></el-input>分钟
          </el-form-item>
        </el-form>
        <!-- 单个选择 -->
        <el-form v-show="modifyForm.modifyPlanStyle ==='single'">
          <el-form-item>
            <h5>
              <span>{{modifyForm.materaName}} <span class='spanBtn'>{{modifyForm.typeCN}}</span></span>
              <!-- <el-button size="mini">{{modifyForm.typeCN}}</el-button> -->
            </h5>
          </el-form-item>
          <el-form-item label="计划时间:" label-width="80px">
            <el-time-picker style="width:80%;"
              is-range
              v-model="modifyForm.timeSelect"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="计划内容:" label-width="80px">
            <div class="rightTime">
              <p>{{modifyForm.planContent}}</p>
              <el-button type="primary" @click="previews(modifyForm.materialId)">预览</el-button>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editSave">保存</el-button>
          <el-button @click="deletePlan(modifyForm.planId)">删除计划</el-button>
          <el-button @click='copyPlan(modifyForm)' v-show="modifyForm.modifyPlanStyle ==='single'">复制计划</el-button>
        </span>
      </el-dialog>
    </section>
  </div>
</template>
<script>
  import * as Api from "@/api/api1"
  const Swal=require("sweetalert2")
  const lodash = require('lodash')
  import Preview from "@/components/preview"
  import MaterialList from "@/components/materialList"
  import ScreenList from '@/components/screenList'
  let Calendar = require('tui-calendar')
  let moment = require('moment')
  export default{
    name:'CloudSeedPlan',
    components:{
      'materiaList':MaterialList,
      'preview':Preview,
      'screenList':ScreenList 
    },
    data(){
      return{
        load_data:false,
        dialogVisible: false,
        modifyPlanDia:false,//修改计划的弹框
        viewSwitche:true, //图表视图和列表视图切换
        activeName:'WeekPlan', //今天和本周的切换
        diaLogMateria:false, //添加素材
        screenDialog:false,//屏列表
        previewMateria:false, // 预览素材
        allFormat:['jpg','jpeg','gif','png','bmp','avi','rm','rmvb','wmv','mp4','flv','mov','dwv','dat','amv','mp3','wav','wma','wav','ogg','ape','acc'],
        previewInfo:{},//素材信息
        chooseDay:'今天',
        weekContext:'本周',
        daySelect:'',//默认选择今天
        weekList:[],//获取一个完全周
        topScreen:0, //查看屏和复制屏的定位
        leftScreen:0, //查看屏和复制屏的定位
        screenPosition:'',//查看屏和复制屏当前定位
        copyWeekPlan:'',
        openScreen:{
          saveScreenStyle:false,//判断是否保存过选中的屏
          screenStyle:'',//判断通过哪个打开屏列表 newOpen新建  copyDay通过日计划复制 copyWeek通过周计划复制
          screeName:'',//判断打开屏列表的name
          screeId:'',// 复制屏的ID
          operationShopId:''
        },
        page:{
          pageRow:0,
          pageNo:1,
          totalPageNo:0,
          total:0
        },
        shopId:'',
        screenId:'',
        tabList:[],
        //储存素材相关
        materiaObject:{},
        //文件上传
        uploadStatus:false,//文件上传的状态
        token:'',
        againUploadIndex:'',
        againUploadId:'',
        defaultView: 'week', // 视图显示
        beginTime:[new Date(),new Date()], // 事件添加或者修改的开始时间
        endTime:[new Date(),new Date()],// 事件添加或者修改的结束时间
        editorId: '', // 修改的事件
        material:'上传素材',
        listViewDia:{
           materalName:'',
           planStatu:'',
           palnTime:'',
           playStatu:'',
           allScreen:''
        },
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
        playType:0,
        stores: [],
        screenSelct: '',
        schedules: [],
        storeList:[
          {
            label: '全部门店',
            options:[
              {
                value: '全部门店',
                label: '全部门店'
              }
            ]
          },
          {
            label: '有屏门店',
            options:[
              {
                value: '西溪印象城',
                label: '西溪印象城'
              },
              {
                value: '古墩印象城',
                label: '古墩印象城'
              }
            ]
          },
          {
            label: '无屏门店',
            options:[
              {
                value: '龙首印象城',
                label: '龙首印象城'
              }
            ]
          }
        ],
        screens: [],
        screenList:[],
        list:[
          {
            colorStyle:'#409EFF',
            text:'编播计划'
          },
          {
            colorStyle:'#FFAE1C',
            text:'插播计划'
          },
          {
            colorStyle: '#FF5A5A ',
            text:'编播计划时间重复'
          }
        ],
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
        materialData:[],
        uploadFileList:[], //上传素材列表
        selectFileList:[], //选择素材列表
        addScreenList:[],//添加屏列表
        screenIds:[],//添加屏id
        modifyForm:{//修改计划
          modifyPlanStyle:'single',
          planList:[],
          startDate:'',
          type:'',
          startTime:'',
          endTime:'',
          materaName:'',
          typeCN:'',
          materialId:'',
          timeSelect:[],
          screenId:'',
          planId:'',
          planContent:''
        }
      }
    },
    mounted () {
      this.initFullCalendar()
      this.screenList = []
      let shopId = this.$route.query.shopId
      let screenId = this.$route.query.screenId
      this.shopId = shopId
      this.screenId = screenId
      this.listViewDia.allScreen = screenId 
      this.screenFindPage(1) 
      //获取当前周
      this.calendar.clear()
      this.setDate(new Date())
    },
    methods:{
      initFullCalendar () {
        this.calendar = new Calendar('#calendar', {
          defaultView: this.defaultView,
          taskView: false,
          scheduleView: 'time',
          theme:{
            'week.timegridOneHour.height': '120px',
            'week.timegrid.paddingRight': '10px',
          },
          template: {
            time: function (schedule) {
              let start = moment(schedule.start.toUTCString())
              let end = moment(schedule.end.toUTCString())
              if(schedule.dueDateClass !== ''){
                return "<p style='color:#878787'>"+schedule.title+"<br><span style='color:#272727'>"+start.format('HH:mm') + ' --' + end.format('HH:mm') + '&nbsp;&nbsp;&nbsp;' + '<span style="display:inline-block;padding:3px;border:1px solid #f00;">'+schedule.dueDateClass+'</span>'+ '</span></p>'
              }else{
                return "<p style='color:#878787'>"+schedule.title+"<br><span style='color:#272727'>"+start.format('HH:mm') + ' --' + end.format('HH:mm') + '</span></p>'
              }
            }
          },
          week: {
            daynames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            startDayOfWeek: 1,
            narrowWeekend: false
          }
        })
        let that = this
        this.calendar.createSchedules(this.schedules) // 渲染事件
        this.calendar.on('beforeCreateSchedule', function (event) { // 未安排事件的日历时间
          that.dialogVisible = true
          that.addScreenList = []
          that.screenFindPage(1,'新建计划')
          that.beginTime = [event.start,event.end]
          that.endTime = [event.start,event.end]
        })
        this.calendar.on('beforeUpdateSchedule', function (event) { // 拖拽修改时间
          let schedule = event.schedule
          let startTimes = event.start
          let endTimes = event.end
          let planId =schedule.attendees.planId
          let materialId = schedule.attendees.materialId
          let type = schedule.attendees.type
          let shopId = that.shopId
          let date = moment(startTimes.toUTCString()).format('YYYY-MM-DD')
          let startTime = moment(startTimes.toUTCString()).format('HH:mm:ss')
          let endTime = moment(endTimes.toUTCString()).format('HH:mm:ss')
          let screenId =schedule.attendees.screenId
          that.updatePlan(planId,shopId,materialId,type,date,startTime,endTime,screenId,'拖拽',schedule,startTimes,endTimes)
        })
        this.calendar.on('clickDayname', function (event) { // 点击日历的某一天
          if (that.calendar.getViewName() === 'week') {
            that.defaultView = 'day'
            that.calendar.setDate(new Date(event.date));
            that.calendar.changeView(that.defaultView, true)
          }
        })
        this.calendar.on('clickSchedule',function (event) {
          // 设置事件的点击事件
          let schedule = event.schedule
          // console.log(schedule) 
          //判断修改单个计划还是多个计划
          that.modifyPlanDia = true
          that.modifyForm.modifyPlanStyle = 'single'
          that.modifyForm.planId =schedule.attendees.planId
          that.modifyForm.materaName = schedule.title
          that.modifyForm.materialId = schedule.attendees .materialId
          that.modifyForm.startDate = moment(schedule.start.toUTCString()).format('YYYY-MM-DD')
          that.modifyForm.type = schedule.attendees.type
          that.modifyForm.screenId =schedule.attendees.screenId
          that.modifyForm.timeSelect =[schedule.start,schedule.end]
          that.modifyForm.typeCN = schedule.attendees.typeCN
        })
      
      },
      //新建计划
      createPlan(){
        this.dialogVisible = true
        this.uploadStatus = false
        this.addScreenList = []
        this.screenFindPage(1,'新建计划')
      },
      //列表视图
      listView(){
        this.viewSwitche = false
        this.load_data = true
        this.planFindList(1)
      },
      //分页
      pageChange(val){
        this.page.pageNo = val
        this.load_data = true
        this.planFindList(val)
      },
      //搜索
      searchScreen(){
        this.load_data = true
        this.page.pageNo = 1
        this.page.total = 0
        this.planFindList(1)
      },
      clearScreen(){
        this.load_data = true
        for(let i in this.listViewDia){
          this.listViewDia[i] = ''
        }
        this.page.pageNo = 1
        this.page.total = 0
        this.planFindList(1)
      },
      closePreview(value){
         this.previewMateria= value
      },
      chartView(){
        this.viewSwitche = true
      },
      screenPrev(){ //查看屏的前后按钮
        if(this.screenList.length>6){
          
        }else{

        }
      },
      screenNext(){ //查看屏的前后按钮
        if(this.screenList.length>6){
         
        }
      },
      allConst(){ // 阻止事件冒泡
        this.screenPosition = ''
      },
      screenItem(e,index){
        this.topScreen = e.currentTarget.offsetTop + 20 + 'px'
        this.leftScreen = e.currentTarget.offsetLeft + e.currentTarget.offsetWidth/4 + 'px'
        this.screenPosition = index
      },
      screenSelectTime(){
        this.listViewDia.allScreen = this.screenSelct
        this.schedules = []
        this.calendar.clear()
          if(this.screenSelct !==''){
            for(let i in this.weekList){
                this.findScreenList(this.screenSelct,this.weekList[i])
              }
          }else{
            if(this.screenId && this.shopId ){
              for(let i in this.weekList){
                this.findScreenList(this.screenId,this.weekList[i])
              }
            }
          }
      },
      prev(){//日历的前进按钮
        this.calendar.prev()
        let toWeeks = moment(new Date().toUTCString()).format('YYYY-M-D')
        if(this.activeName === 'WeekPlan'){
          this.schedules = []
          this.calendar.clear()
          this.setDate(this.addDate(this.currentFirstDate,-7))
          if(this.weekList.indexOf(toWeeks) != -1){
            this.weekContext = '本周'
          }else{
            let startWeek = this.weekList[0].split('-')[0]+'.'+this.weekList[0].split('-')[1]+'.'+this.weekList[0].split('-')[2]
            let endWeek = this.weekList[6].split('-')[1]+'.'+this.weekList[6].split('-')[2]
            this.weekContext = startWeek +'~'+endWeek
          }
          
          if(this.screenSelct !==''){
            for(let i in this.weekList){
                this.findScreenList(this.screenSelct,this.weekList[i])
              }
          }else{
            if(this.screenId && this.shopId ){
              for(let i in this.weekList){
                this.findScreenList(this.screenId,this.weekList[i])
              }
            }
          }
        }
      },
      next(){//日历的后退按钮
        this.calendar.next()
        let toWeeks = moment(new Date().toUTCString()).format('YYYY-M-D')
        if(this.activeName === 'WeekPlan'){
          this.schedules = []
          this.calendar.clear()
          this.setDate(this.addDate(this.currentFirstDate,7))
          if(this.weekList.indexOf(toWeeks) != -1){
            this.weekContext = '本周'
          }else{
            let startWeek = this.weekList[0].split('-')[0]+'.'+this.weekList[0].split('-')[1]+'.'+this.weekList[0].split('-')[2]
            let endWeek = this.weekList[6].split('-')[1]+'.'+this.weekList[6].split('-')[2]
            this.weekContext = startWeek +'~'+endWeek
          }
          
          if(this.screenSelct !==''){
            for(let i in this.weekList){
                this.findScreenList(this.screenSelct,this.weekList[i])
              }
          }else{
            if(this.screenId && this.shopId ){
              for(let i in this.weekList){
                this.findScreenList(this.screenId,this.weekList[i])
              }
            }
          }
        }
      },
      week(){ //周视图切换
        this.calendar.today()
        this.defaultView = 'week'
        this.calendar.changeView(this.defaultView, true)
        if(this.activeName === 'WeekPlan'){
          this.weekContext = '本周'
          this.schedules = []
          this.calendar.clear()
          this.setDate(new Date())
          if(this.screenSelct !==''){
            for(let i in this.weekList){
                this.findScreenList(this.screenSelct,this.weekList[i])
              }
          }else{
            if(this.screenId && this.shopId ){
              for(let i in this.weekList){
                this.findScreenList(this.screenId,this.weekList[i])
              }
            }
          }
        }
      },
      today(){ // 日视图切换
        // this.calendar.today()
        let daySelect =moment(this.daySelect.toUTCString()).format('YYYY-MM-DD')
        this.daySelect = daySelect
        this.defaultView = 'day'
        this.calendar.setDate(new Date(this.daySelect));
        this.calendar.changeView(this.defaultView, true)
      },
      dataPlan(tab, event){
        this.viewSwitche = true
        if(tab.name === 'WeekPlan'){
          this.defaultView = 'week'
          this.schedules = []
          this.calendar.clear()
          if(this.screenSelct !==''){
            for(let i in this.weekList){
                this.findScreenList(this.screenSelct,this.weekList[i])
              }
          }else{
            if(this.screenId && this.shopId ){
              for(let i in this.weekList){
                this.findScreenList(this.screenId,this.weekList[i])
              }
            }
          }
        }else{
          this.defaultView = 'day'
        }
        this.calendar.changeView(this.defaultView, true)
      },
      //选择素材出现弹框
      selectMaterial: lodash.debounce(function(index){
        this.diaLogMateria = true
        this.findMaterials(1)
      },300),
      //重新选择素材
      againSelectMaterial: lodash.debounce(function(item,index){
        this.againUploadIndex = index
        this.diaLogMateria = true
        this.findMaterials(1)
      },300),
      //添加屏幕
      addScreen: lodash.debounce(function(){
        this.screenDialog = true
        this.openScreen.saveScreenStyle = false
        this.openScreen.screenStyle = 'newOpen'
        this.openScreen.screeName = '屏列表'
        this.openScreen.screeId = '-1'
        this.openScreen.operationShopId = this.shopId
        this.screenFindPage(1,'添加屏幕')
      },300),
      lookScreen(){ //查看屏
      },
      copyScreen(item){ //复制屏
        this.screenDialog = true
        if(this.activeName === 'dayPlan'){
          this.openScreen.screenStyle = 'copyDay'
        }else if(this.activeName === 'WeekPlan'){
          this.openScreen.screenStyle = 'copyWeek'
        }
        this.openScreen.screeId =item.id
        this.openScreen.screeName = item.value
      },
      //选择屏
      closeScreen: lodash.debounce(function(list,value){
        this.screenDialog= value
        this.screenIds = []
        for(let i in list){
          this.screenIds.push(list[i].screenId)
        }
        this.addScreenList = list
      },300),
      //选择素材
      chooseMaterial: lodash.debounce(function(value,tas){
        if(tas){
          let obj = {}
          obj.materialId = tas.materialId
          obj.name = tas.name
          obj.type = tas.type
          obj.tagName = tas.tagName
          obj.tagId = tas.tagId
          obj.tagCN = tas.tagCN
          obj.url = tas.url
          this.selectFileList=[obj]
          // if(this.againUploadIndex !== ''){
          //   this.selectFileList.splice(this.againUploadIndex,1,obj)
          // }else{
          //   this.selectFileList=[obj]
          // }
        }
        this.againUploadIndex= ''
        this.diaLogMateria = value
      },300),
      //文件上传
      againUpload: lodash.debounce(function(item,index){
        this.againUploadId = ''
        this.againUploadIndex = index
      },300),
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
      //文件上传失败
      error(response, file, fileList){//上传文件
        this.$message({
          message: '上传失败',
          type: 'error'
        })
         this.uploadStatus = false
      },
      //文件上传成功
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
            obj.matrialType = '图片'
            obj.type = 0
          }else if(fileFormat === 'avi' || fileFormat === 'rm' || fileFormat === 'rmvb' || fileFormat === 'wmv' || fileFormat === 'mp4' || fileFormat === 'flv' || fileFormat === 'mov' || fileFormat === 'mtv' || fileFormat === 'dwv' || fileFormat === 'dat' || fileFormat === 'amv'){
            obj.type = 2
            obj.matrialType = '视频'
          }else if(fileFormat === 'mp3' || fileFormat === 'wav' || fileFormat === 'wma' || fileFormat === 'wav' || fileFormat === 'ogg' || fileFormat === 'ape' || fileFormat === 'acc'){
            obj.type = 1
            obj.matrialType = '音频'
          }else{
            obj.type = ''
            obj.matrialType = '未知'
          }
          if(obj.matrialType == '未知'){
            this.$message({
              message: '不支持该格式文件',
              type: 'warning'
            })
            this.uploadStatus = false
          }else{
            let fileNames = []
            for(var i=0;i<lens;i++){
              fileNames.push(file.name.split('.')[i])
            }
            obj.materialName= fileNames.join('.')
            obj.name = fileNames.join('.')
            if(obj.name.length>15){
              obj.materialName = obj.materialName.slice(0,15)
              obj.name = obj.name+'.'+fileFormat
            }
            obj.url = 'http://fussen-qiniu.dface.cn/'+ file.response.key
            //判断是上传还是重新上传
            // if(this.againUploadIndex !== ''){
            //   obj.materialId =''
            //   this.saveMaterial(obj)
            // }else{
            //   obj.materialId = ''
            //   this.saveMaterial(obj)
            // }
            this.$message({
              message: '上传成功',
              type: 'success'
            })
            this.uploadFileList=[obj]
            this.uploadStatus = false
          }
        }
      },
      //删除计划
      deletePlan(planId){
        this.$confirm('删除计划后将无法恢复, 确认删除吗?','删除确认',{
          cancelButtonText: '取消',
          confirmButtonText: '删除',
          type: 'warning'
        }).then(() =>{
          this.delPlan(planId)
        }).catch(() =>{
          this.modifyPlanDia = false
          for(let i in self.modifyForm){
            if(i === 'modifyPlanStyle'){
              self.modifyForm[i] = 'single'
            }else if(i === 'planList' || i === 'timeSelect'){
              self.modifyForm[i] = []
            }
          }
        })
      },
      //复制计划
      copyPlan: lodash.debounce(function(copyPlan){
        this.copyWeekPlan = '复制计划'
        this.material = '选择素材'
        this.beginTime = copyPlan.timeSelect
        this.endTime = copyPlan.timeSelect
        this.playType = copyPlan.type
        this.addScreenList = []
        this.loadMaterial(copyPlan.materialId,'复制计划')
      },300),
      btnFasle () {
        this.dialogVisible = false
        this.openScreen.saveScreenStyle = true
        this.uploadStatus = false
        // if(this.material == '上传素材'){
        //   this.$router.go(0)
        // }
        this.material ='上传素材'
        this.playType = 0
        this.addScreenList =[]
        this.screenIds = []
        this.selectFileList = []
        this.uploadFileList = []
        this.editorId = ''
        this.beginTime = [new Date(),new Date()]
        this.endTime = [new Date(),new Date()]
        // this.calendar.hideMoreView()
      },
      btnSure: lodash.debounce(function(){
        this.openScreen.saveScreenStyle = true
        let startDate = moment(this.beginTime[0].toUTCString()).format('YYYY-MM-DD')
        let endDate = moment(this.beginTime[1].toUTCString()).format('YYYY-MM-DD')
        let startTime = moment(this.endTime[0].toUTCString()).format('HH:mm')
        let endTime = moment(this.endTime[1].toUTCString()).format('HH:mm')
        let timeSub = DateMinus(startDate,endDate)
        function DateMinus(date1,date2){
        　　var sdate = new Date(date1); 
        　　var now = new Date(date2); 
        　　var days = now.getTime() - sdate.getTime(); 
        　　var day = parseInt(days / (1000 * 60 * 60 * 24)); 
        　　return day; 
        }
        if (startDate === '' || endDate === '') {
          this.$message({
            message: '请选择开始时间',
            type: 'warning'
          })
        } else if (startTime === '' || endTime ==='') {
          this.$message({
            message: '请选择结束时间',
            type: 'warning'
          })
        } else if(startDate === endDate && startTime === endTime) {
          this.$message({
            message: '开始时间不要和结束时间一样',
            type: 'warning'
          })
        }else if(this.material =='上传素材' && this.uploadFileList.length === 0){
            this.$message({
              message: '请先选择素材',
              type: 'warning'
            })
        }else if(this.material == '选择素材' && this.selectFileList.length === 0){
            this.$message({
              message: '请先选择素材',
              type: 'warning'
            })
        }else if(this.addScreenList.length === 0){
          this.$message({
            message: '请先选择添加屏',
            type: 'warning'
          })
        }else if(timeSub >59){
          this.$message({
            message: '时间不能超过60天',
            type: 'warning'
          })
        }else{
          this.load_data = true
          let materialId =''
          if(this.material == '上传素材'){
            let type = this.playType
            let screenIds = this.screenIds
            let shopId = this.shopId
            // materialId  = this.uploadFileList[0].materialId
            this.saveMaterial(this.uploadFileList[0],shopId,type,startDate,endDate,startTime,endTime,screenIds)
          }else{
            materialId = this.selectFileList[0].materialId
            
            let type = this.playType
            let screenIds = this.screenIds
            let shopId = this.shopId
            this.SavePlan(shopId,materialId,type,startDate,endDate,startTime,endTime,screenIds)
          }
        }
      },300),
      //编辑一个计划
      editSave: lodash.debounce(function(){
        let startTime = moment(this.modifyForm.timeSelect[0].toUTCString()).format('HH:mm')
        let endTime = moment(this.modifyForm.timeSelect[1].toUTCString()).format('HH:mm')
        let startDate = this.modifyForm.startDate
        let endDate = this.modifyForm.endDate
        if (startTime === '' || endTime ==='') {
          this.$message({
            message: '请选择结束时间',
            type: 'warning'
          })
        }else if(startTime === endTime){
          this.$message({
            message: '开始时间不能等于结束时间',
            type: 'warning'
          })
        }else{
          let date = this.modifyForm.startDate
          let materialId = this.modifyForm.materialId
          let type = this.modifyForm.type
          let screenId = this.modifyForm.screenId
          let shopId = this.shopId
          let planId = this.modifyForm.planId
          this.updatePlan(planId,shopId,materialId,type,date,startTime,endTime,screenId,'编辑')
          }
      },300),
      //预览
      previews(materialId){
        this.loadMaterial(materialId)
      },
      //一个完全周的使用
      formatDate(date){
        let year = date.getFullYear()+'-';
        let month = (date.getMonth()+1)+'-';
        let day = date.getDate();
        return year+month+day;
      },
      addDate(date,n){
        date.setDate(date.getDate()+n);
        return date;
      },
      setDate(date){
        if(date.getDay() === 0){
            var week = date.getDay()+6;
        }else{
          var week = date.getDay()-1;
        }
        date = this.addDate(date,week*-1);
        this.currentFirstDate = new Date(date);
        let arr = []
        for(var i = 0;i<7;i++){  
        arr.push(this.formatDate(i==0 ? date : this.addDate(date,1)))      
        }
        this.weekList= arr
      },
      //查询素材列表
      findMaterials(pageNo){
        let self =this
        let obj ={
          pageNo:pageNo
        }
        Api.findMaterials(obj).then((res) =>{
          let data =res.data
          if(data.status === 0){
            self.load_data = false
            if(data.object.pageNo === 1){
              self.materiaObject = data.object
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
      saveMaterial(obj,shopId,type,startDate,endDate,startTime,endTime,screenIds){
        let self = this
        Api.saveMaterial(obj).then((res) =>{
          let data = res.data
          if(data.status === 0){
            let materialId =data.object
            self.SavePlan(shopId,materialId,type,startDate,endDate,startTime,endTime,screenIds)
            // if(self.againUploadIndex === ''){
            //   self.uploadFileList.push(obj)
            // }else{
            //   self.uploadFileList.splice(self.againUploadIndex,1,obj)
            // }
            self.againUploadIndex = ''
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
      screenFindPage(pageNo,addName){
        let self = this
        Api.screenFindPage(
          {
            pageNo:pageNo,
            operationShopId:self.shopId,
            screenId:self.screenId
          }
        ).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            if(data.object){
              self.screens = data.object.objects
              if(self.screens.length>0 && addName == undefined){
                self.screenSelct = self.screens[0].screenId
                self.listViewDia.allScreen = self.screens[0].screenId
              }
              if(addName == '新建计划'){
                if(data.object.objects.length>0){
                  for(let i in data.object.objects){
                    if(data.object.objects[i].screenId == self.screenSelct){
                      self.screenIds=[data.object.objects[i].screenId]
                      self.addScreenList.push(data.object.objects[i])
                      break;
                    }
                  }
                }
              }
              if(addName == '添加屏幕'){
                self.tabList = data.object
              }
              if(addName == undefined){
                if(self.activeName ==='WeekPlan'){
                self.schedules = []
                self.calendar.clear()
                if(self.screenId && self.shopId ){
                  for(let i in self.weekList){
                    self.findScreenList(self.screenId,self.weekList[i])
                  }
                }else{
                  for(let i in self.weekList){
                    self.findScreenList(self.screenSelct,self.weekList[i])
                  }
                }
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
      },
      //保存新建计划
      SavePlan(shopId,materialId,type,startDate,endDate,startTime,endTime,screenIds){
        let self = this
        Api.SavePlan(
           {
             shopId:shopId,
            materialId:materialId,
            materialId:materialId,
            type:type,
            startDate:startDate,
            endDate:endDate,
            startTime:startTime,
            endTime:endTime,
            screenIds:screenIds
          }
        ).then((res) =>{
          let data = res.data
          if(data.status === 0){
            if(data.object){
              const h = self.$createElement;
              self.$msgbox({
                title:'创建成功，部分计划时间有冲突',
                message:<p>部分计划时间安排有冲突，无法播放。可在列表模式查看冲突计划。</p>,
                showConfirmButton:false,
                showCancelButton:false,
                closeOnClickModal:false,
                type: 'warning'
              })
              .then(() => {
              }).catch(() => {
                
              });
            }else{
              self.$message({
                message: '创建计划成功',
                type: 'success'
              })
            }
            self.load_data = false
            self.dialogVisible = false
            if(self.activeName === 'WeekPlan'){
              self.schedules = []
              this.calendar.clear()
              self.setDate(new Date())
              if(self.screenSelct !==''){
                for(let i in self.weekList){
                    self.findScreenList(self.screenSelct,self.weekList[i])
                  }
              }else{
                if(self.screenId && self.shopId ){
                  for(let i in self.weekList){
                    self.findScreenList(self.screenSelct,self.weekList[i])
                  }
                }
              }
            }
            self.material ='上传素材'
            self.playType = 0
            self.screenIds = []
            self.selectFileList = []
            self.uploadFileList = []
            self.editorId = ''
            self.beginTime = [new Date(),new Date()]
            self.endTime = [new Date(),new Date()]
            if(self.copyWeekPlan !=''){
              self.modifyPlanDia  =false
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
      updatePlan(planId,shopId,materialId,type,date,startTime,endTime,screenId,names,schedule,startTimes,endTimes){
        let self = this
        Api.updatePlan(
          {
            planId:planId,
            shopId:shopId,
            materialId:materialId,
            type:type,
            date:date,
            startTime:startTime,
            endTime:endTime,
            screenId:screenId
          }
        ).then((res) =>{
          let schedules =''
          if(schedule != undefined){
            schedules = schedule
          }
          let data = res.data
          if(data.status == 0){
            if(names == '拖拽'){
              for (let i = 0; i < self.schedules.length; i++) {
                if (self.schedules[i].id == schedules.id) {
                  self.schedules[i].start = moment(startTimes.toUTCString()).format('YYYY-MM-DDTHH:mm:ss')
                  self.schedules[i].end = moment(endTimes.toUTCString()).format('YYYY-MM-DDTHH:mm:ss')
                }
              }
              self.calendar.updateSchedule(schedules.id, '1', { // 更新一个事件
                start: startTimes,
                end: endTimes
              })
            }
            if(names =='编辑'){
               self.modifyPlanDia  =false
               for (let i = 0; i < self.schedules.length; i++) {
                if (self.schedules[i].id == planId) {
                  self.schedules[i].start = date +' '+ startTime
                  self.schedules[i].end = date +' '+ endTime
                }
              }
              self.calendar.updateSchedule(planId, '1', { // 更新一个事件
                start: date +' '+ startTime,
                end: date +' '+ endTime
              })
            }
            self.$message({
              message: '修改计划成功',
              type: 'success'
            })
            if(self.activeName === 'WeekPlan'){
              self.schedules = []
              this.calendar.clear()
              self.setDate(new Date())
              if(self.screenSelct !==''){
                for(let i in self.weekList){
                    self.findScreenList(self.screenSelct,self.weekList[i])
                  }
              }else{
                if(self.screenId && self.shopId ){
                  for(let i in self.weekList){
                    self.findScreenList(self.screenSelct,self.weekList[i])
                  }
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
      },
      //查询计划列表分页
      planFindList(pageNo){
        let self = this
        let datas = ''
        if(self.listViewDia.palnTime !==''){
          datas = self.listViewDia.palnTime
        }
        Api.planFindList(
          {
            pageNo:pageNo,
            materialName:self.listViewDia.materalName,
            status:self.listViewDia.planStatu,
            type:self.listViewDia.playStatu,
            date:datas,
            operationShopId:self.shopId,
            screenId:self.listViewDia.allScreen
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
          // for(let i in self.listViewDia){
          //   self.listViewDia[i] = ''
          // }
        }).catch((error) =>{
          self.load_data = false
          Swal({
            text:'请求服务器失败',
            allowOutsideClick:false
          })
        })
      },
      //查询商家日计划分页
      findShopList(data){
        let self = this
        Api.findShopList(
          {
            pageNo:1,
            shopId:self.shopId,
            date:data
          }
        ).then((res) =>{
          let data = res.data
          if(data.status === 0){
            let object = data.object
            if(object){
              let objects = object.objects
              for(let i in objects){
                let obj ={}
                obj.id = objects[i].planId
                obj.calendarId = '1'
                obj.title = objects[i].materialName
                obj.category = 'time'
                obj.dueDateClass = ''
                obj.attendees ={
                  planId:objects[i].planId,
                  status:objects[i].status,
                  statusCN:objects[i].statusCN,
                  typeCN :objects[i].typeCN,
                  type:objects[i].type,
                  screenName:objects[i].screenName
                }
                obj.start = objects[i].createTime
                let endTime = objects[i].createTime.split(' ')[0] +' '+ objects[i].endTime
                obj.end = endTime
                if(objects[i].type == 0){
                  if(objects[i].status != 2){
                    obj.bgColor = '#F2F6FF'
                    obj.borderColor = '#3180EC'
                  }else{
                    if(objects[i].status == 2){
                      obj.bgColor = '#F8DEDB'
                      obj.borderColor = '#ff4040'
                    }
                  }
                }
                if(objects[i].type == 1){
                  if(objects[i].status != 2){
                    obj.bgColor = '#FCF2D9'
                    obj.borderColor = '#FDA018'
                  }else{
                    if(objects[i].status == 2){
                      obj.bgColor = '#FC8553'
                      obj.borderColor = '#FEDA1E'
                    }
                  }
                }
                self.calendar.createSchedules([obj])
                self.schedules.push(obj)
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
      //屏幕日计划
      findScreenList(screenId,date){
        let self = this
        Api.findScreenList({screenId:screenId,date:date}).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            let object = data.object
            if(object){
              let objects = object
              for(let i in objects){
                let obj ={}
                obj.id = objects[i].planId
                obj.calendarId = '1'
                obj.title = objects[i].materialName
                obj.category = 'time'
                obj.dueDateClass = ''
                obj.attendees ={
                  planId:objects[i].planId,
                  status:objects[i].status,
                  materialId:objects[i].materialId,
                  statusCN:objects[i].statusCN,
                  typeCN :objects[i].typeCN,
                  type:objects[i].type,
                  screenId:objects[i].screenId,
                  screenName:objects[i].screenName
                }
                obj.start = objects[i].planDate +' '+ objects[i].startTime
                let endTime = objects[i].planDate +' '+ objects[i].endTime
                obj.end = endTime
                if(objects[i].type == 0){
                  if(objects[i].status != 2){
                    obj.bgColor = '#F2F6FF'
                    obj.borderColor = '#3180EC'
                  }else{
                    if(objects[i].status == 2){
                      obj.bgColor = '#F8DEDB'
                      obj.borderColor = '#ff4040'
                    }
                  }
                }
                if(objects[i].type == 1){
                  if(objects[i].status != 2){
                     obj.bgColor = '#FCF2D9'
                    obj.borderColor = '#FDA018'
                  }else{
                    if(objects[i].status == 2){
                      obj.bgColor = '#F8DEDB'
                      obj.borderColor = '#ff4040'
                    }
                  }
                }
                self.calendar.createSchedules([obj])
                self.schedules.push(obj)
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
      loadMaterial(materialId,copyName){
        let self = this
        Api.loadMaterial(
          {materialId:materialId}
        ).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.load_data = false
            if(copyName){
              if(data.object){
                let obj ={
                  materialId:data.object.materialId,
                  name:data.object.name,
                  typeCN:data.object.typeCN,
                  type:data.object.type,
                  url:data.object.url,
                  tagCN:data.object.tagName,
                  tagId:data.object.tagId
                }
                self.selectFileList = [obj]
                self.dialogVisible = true
                self.screenFindPage(1,'新建计划')
              }
            }else{
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
      lookConflictPlan(){
        alert(111)
      },
      //删除计划
      delPlan(planId){
        let self = this
        Api.delPlan({planId:planId}).then((res) =>{
          let data = res.data
          if(data.status === 0){
            self.modifyPlanDia = false
            self.calendar.deleteSchedule(planId, '1')
              for (let i = 0; i < self.schedules.length; i++) {
                if (self.schedules[i].id == planId) {
                  self.schedules.splice(i, 1)
                }
              }
          }else{
            self.load_data = false
            Swal({
              text:data.errorMsg,
              allowOutsideClick:false
            })
          }
          for(let i in self.modifyForm){
            if(i === 'modifyPlanStyle'){
              self.modifyForm[i] = 'single'
            }else if(i === 'planList' || i === 'timeSelect'){
              self.modifyForm[i] = []
            }
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
  .cloudPlan{
    .list{
      display: flex;
      justify-content: flex-start;
      li{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 10px 10px 0;
        font-size:12px;
        .fullSpan{
          width: 14px;
          height: 14px;
          display: inline-block;
          line-height: 1;
          border-radius: 2px;
          margin: 0 4px;
        }
      }
    }
    .selectRight{
      float: right;
      button{
        margin-left:0;
      }
    }
    .scrollList{
      display: flex;
      flex-direction: row;
      .prev,.next{
        flex: 1;
        outline: none;
        margin-top: -12px;
        border: 0px;
        background-color: #fff;
      }
      .ulList{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        overflow-x: scroll;
        white-space: nowrap;
        li{
          flex: 1;
          text-align: center;
        }
      }
    }
    .el-upload{
      width: 100%;
    }
    .screenPlan{
      position: absolute;
      // margin-left: 20px;
      background-color: #fff;
      border-radius: 7px;
      border: 1px solid #ccc;
      z-index: 200;
      text-align: center;
      span{
        display: block;
        padding: 5px;
      }
    }
    .listView{
      background-color: #fff;
      padding: 20px;
      .el-table{
        .has-gutter th{
          background-color: #F5F5F6;
        }
      }
    }
    .el-dialog{
      .slectFile{
        .selectFileList{
          background:#F5F7FA;
          padding:5px;
        }
      }
      .el-form-item {
        margin-bottom: 5px;
      }
      .rightTime{
        margin-bottom: 10px;
      }
      .el-dialog__footer {
        .el-button{
          width: 29%;
          text-align: center;
          padding-left:0px;
          padding-right: 0; 
        }
      }
    }
    .tui-full-calendar-timegrid-gridline{
      height:100px;
    }
    .pageAtion{
      // height: 20px;
      padding: 20px 0 70px;
      background-color: #fff;
    }
    .conflictPlan{
      width: 40px;
      padding: 0 5px;
      border-radius: 5px;
      border:1px solid #F2424E;
      color:#EE0525;
      background-color: #FBDEDA;
    }
    .spanBtn{
      padding: 2px 4px;
      border-radius: 4px;
      border:1px solid #D7D7DF;
    }
    .tui-view-7{
      display: none;
    }
    ::-webkit-scrollbar {
      width: 0px;
    }
    .listViewSelect{
      color: #409EFF;
    }
  }
</style>
