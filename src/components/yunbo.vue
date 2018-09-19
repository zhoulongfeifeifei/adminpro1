<template>
  <div class="cloudPlan">
    <section class="con">
      <figure>
        <div class="crumbs">
          <span>播放计划</span>
        </div>
      </figure>
      <div class="box" @mouseover="allConst">
        <el-tabs v-model="activeName" @tab-click="dataPlan" class="elTabs-container">
          <el-tab-pane label="日计划" name="dayPlan"></el-tab-pane>
          <el-tab-pane label="周计划" name="WeekPlan"></el-tab-pane>
        </el-tabs>
         <el-form :inline="true">
          <el-form-item style="margin-bottom:0;">
            <el-button type="primary" @click="createPlan">新建计划</el-button>
          </el-form-item>
          <el-form-item style="float:right;right:0;margin-bottom:0;">
            <el-button-group>
            <el-button @click="chartView">图表视图</el-button>
            <el-button @click="listView">列表视图</el-button>
            </el-button-group>
          </el-form-item><br>
          <template v-if="viewSwitche">
            <div style="padding-top:20px;">
              <el-form-item label="门店:" class="selectTab">
                <el-select v-model="stores" placeholder="全部门店">
                  <el-option-group v-for="group in storeList" :key="group.label" :label="group.label">
                    <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
              <el-form-item label="屏幕:" class="selectTab" v-if="activeName === 'WeekPlan'">
                <el-select v-model="screen" placeholder="请选择屏幕">
                  <el-option v-for="item in screens" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="selectTab selectRight">
                  <el-button  @click="prev"><i class="el-icon-arrow-left"></i></el-button>
                  <!-- <el-button @click="today" style="width:100px;position:relative" v-if="activeName === 'dayPlan'">今天</el-button> -->
                  <el-date-picker v-model="daySelect" type="date" placeholder="今天" v-if="activeName === 'dayPlan'" clear-icon='el-icon-circle-close' style="width:40%;"@change="today"></el-date-picker>
                  <el-button @click="week" style="width:100px;" v-if="activeName === 'WeekPlan'">本周</el-button>
                  <el-button @click="next"><i class="el-icon-arrow-right"></i></el-button>
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
              <el-input placeholder="输入素材标题进行搜索" v-model="materalName">
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="计划状态">
              <el-select v-model="planStatu" placeholder="请选择">
                <el-option v-for="item in planStatuList" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计划时间">
              <el-date-picker v-model="palnTime" type="datetime" placeholder="选择时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
            <el-form-item label="播放类型">
              <el-select v-model="playStatu" placeholder="请选择">
                <el-option v-for="item in playStatuList" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="屏">
              <el-select v-model="allScreen" placeholder="请选择">
                <el-option v-for="item in allScreenList" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-table :data="materialData" v-loading="load_data" element-loading-text="拼命加载中" style="width: 100%">
              <el-table-column align="center" prop="matrialName" label="标题"></el-table-column>
              <el-table-column align="center" label="创建人">
                <template slot-scope="scope"><p>{{scope.row.founder}}({{scope.row.founderPhone}})</p></template>
              </el-table-column>
              <el-table-column align="center" prop="foundTime" sortable label="创建时间"></el-table-column>
              <el-table-column align="center" prop="planTime" sortable label="计划时间"></el-table-column>
              <el-table-column align="center" prop="planStyle" label="计划状态"></el-table-column>
              <el-table-column align="center" prop="playStyle" label="播放类型"></el-table-column>
              <el-table-column prop="lookScreen" label="投屏"></el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="text">修改记录</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
      </template>
       <!-- 素材列表 -->
      <materia-list :diaLogMateria="diaLogMateria" @chooseMaterial="chooseMaterial"></materia-list>
      <!-- 屏列表 -->
      <screen-list :screenDialog="screenDialog" :addScreenList="addScreenList" @closeScreen='closeScreen' :openScreen='openScreen'></screen-list>
      <!-- 新建计划 -->
      <el-dialog title='创建计划' :visible.sync="dialogVisible" width="25%" :close-on-click-modal="false">
        <el-form label-width='80px' label-position='right'>
          <el-form-item>
            <el-input v-model="scheduleTitles" width="100%" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="创建方式:">
            <el-radio-group v-model="material">
              <el-radio label="上传素材"></el-radio>
              <el-radio label="选择素材"></el-radio>
            </el-radio-group>
          </el-form-item>
            <!-- 上传的文件 -->
            <div v-if="uploadFileList.length > 0 && material==='上传素材'" v-for="(item,index) in uploadFileList">
              <p><span>{{item.materialName}}<el-button size="mini">{{item.matrialType}}</el-button></span></p>
              <el-upload action="/api/permission/memberShop/export" style="margin:10px 0;"
                :data="{token:pData.token}" list-type="picture" :show-file-list="false" :on-success="success" :on-error="error" :disabled="uploadStatus" :on-preview="handlePreview" >
                <el-button style="width:100%;" :loading="uploadStatus" @click="againUpload(index)">重新上传</el-button>
              </el-upload>
            </div>
            <!-- 选择的文件 -->
            <div class="slectFile" v-if="selectFileList.length>0 && material==='选择素材'" v-for="(item,index) in selectFileList">
              <p>{{item.matrialType}}</p>
              <ul class="selectFileList">
                <li>素材名称：{{item.materialName}}</li>
                <li>素材标签：{{item.matriaLabel}}</li>
                <li v-show="item.matrialType === '网页'">网页链接：{{item.meteriaUrl}}</li>
              </ul>
              <el-button size='medium' style="width:100%;" @click="againSelectMaterial(index)">重新选择素材</el-button>
            </div>
            <el-upload v-show="material === '上传素材'" icon="el-icon-plus" action="/api/permission/memberShop/export" style="margin-left:0;"
              :data="{token:pData.token}" list-type="picture" :show-file-list="false" :on-success="success" :on-error="error" :disabled="uploadStatus" :on-preview="handlePreview" >
              <el-button style="width:100%;" :loading="uploadStatus">上传素材</el-button>
            </el-upload>
            <el-button v-show="material === '选择素材'" size='medium' style="width:100%;" @click="selectMaterial()">选择素材</el-button>
          <el-form-item label="计划类型" style="border-top:1px solid #E4E7E9;margin-top:10px;">
            <el-radio-group v-model="playType">
              <el-radio label="编播计划"></el-radio>
              <el-radio label="插播计划"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="计划时间" style="border-bottom:1px solid #E4E7E9;margin-bottom:10px;">
            <div class="rightTime">
              <el-date-picker style="width:100%;margin-bottom:10px;"
                v-model="beginTime"
                type="datetime"
                placeholder="选择开始日期"
                value-format="yyyy-MM-ddTHH:mm:ss">
              </el-date-picker>
              <el-date-picker style="width:100%;"
                v-model="endTime"
                type="datetime"
                placeholder="选择结束日期"
                value-format="yyyy-MM-ddTHH:mm:ss">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="应用屏幕">
            <el-button @click="addScreen">添加屏幕</el-button><br>
            <el-tag v-for="item in addScreenList">{{item.screenName}}({{item.screenAddress}})</el-tag>
          </el-form-item> 
        </el-form>
        <span slot="footer">
          <el-button type="primary" @click="btnSure">确 定</el-button>
          <el-button @click="btnFasle">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 修改单个计划或者多个计划 -->
      <el-dialog title='修改计划' :visible.sync="modifyPlanDia" width="25%" :close-on-click-modal="false">
        <!-- 多个选择 -->
        <el-form v-show="modifyPlanStyle !=='single'" label-position="right" label-width="80px">
          <el-form-item label="已选计划:">
            <ul class="rightTime">
              <li v-for="item in modifyForm.planList">{{item.materaName}}</li>
            </ul>
          </el-form-item>
          <el-form-item label="推迟时间:">
            <el-input type="number" v-model="modifyForm.startHouse" oninput="if(value.length>2)value=value.slice(0,2)" style="width:20%;"></el-input>小时
            <el-input type="number" v-model="modifyForm.startMin" oninput="if(value.length>2)value=value.slice(0,2)" style="width:20%;"></el-input>分钟
          </el-form-item>
        </el-form>
        <!-- 单个选择 -->
        <el-form v-show="modifyPlanStyle ==='single'">
          <el-form-item>
            <h5>
              <span>{{modifyForm.materaName}}</span>
              <el-button size="mini">{{modifyForm.materaType}}</el-button>
            </h5>
          </el-form-item>
          <el-form-item label="计划时间:" label-width="80px">
            <el-date-picker style="width:100%;"
            v-model="modifyForm.timeSelect"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          </el-form-item>
          <el-form-item label="计划内容:" label-width="80px">
            <div class="rightTime">
              <p>{{modifyForm.planContent}}</p>
              <el-button type="primary">预览</el-button>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary">保存</el-button>
          <el-button @click="deletePlan">删除计划</el-button>
          <el-button v-show="modifyPlanStyle ==='single'">复制计划</el-button>
        </span>
      </el-dialog>
    </section>
  </div>
</template>
<script>
  import MaterialList from "@/components/materialList"
  import ScreenList from '@/components/screenList'
  let Calendar = require('tui-calendar')
  let moment = require('moment')
  export default{
    name:'CloudSeedPlan',
    components:{
      'materiaList':MaterialList,
      'screenList':ScreenList
    },
    data(){
      return{
        load_data:false,
        dialogVisible: false,
        modifyPlanDia:false,//修改计划的弹框
        modifyPlanStyle:'single',
        viewSwitche:true, //图表视图和列表视图切换
        activeName:'dayPlan', //今天和本周的切换
        diaLogMateria:false, //添加素材
        screenDialog:false,//屏列表
        chooseDay:'今天',
        daySelect:'',//默认选择今天
        topScreen:0, //查看屏和复制屏的定位
        leftScreen:0, //查看屏和复制屏的定位
        screenPosition:'',//查看屏和复制屏当前定位
        openScreen:{
          saveScreenStyle:false,//判断是否保存过选中的屏
          screenStyle:'',//判断通过哪个打开屏列表 newOpen新建  copyDay通过日计划复制 copyWeek通过周计划复制
          screeName:'',//判断打开屏列表的name
          screeId:''// 复制屏的ID
        },
        //文件上传
        uploadStatus:false,//文件上传的状态
        pData:{doc:{size:1024000}},
        againUploadIndex:'',
        defaultView: 'day', // 视图显示
        beginTime: '', // 事件添加或者修改的开始时间
        endTime: '',// 事件添加或者修改的结束时间
        scheduleTitles: '', // 事件主题
        editorId: '', // 修改的事件
        material:'上传素材',
        materalName:'',
        planStatu:'全部',
        playType:'编播计划',
        palnTime:'',
        playStatu:'编播计划',
        allScreen:'全部',
        stores: [],
        screen: [],
        schedules: [
          {
            id: '1',
            calendarId: '1',
            title: '玩游戏',
            category: 'time',
            dueDateClass: '',
            start: '2018-08-02T13:00:00',
            end: '2018-08-02T14:30:00',
            color: '#fff',
            bgColor: '#409eff',
            borderColor:'#409eff'
          },
          {
            id: '2',
            calendarId: '1',
            title: 'test1',
            category: 'time',
            dueDateClass: '总部',
            start: '2018-08-01T11:30:00',
            end: '2018-08-01T12:30:00',
            color: '#fff',
            bgColor: '#409eff',
            borderColor:'#409eff'
          }
        ],
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
        screens: [
          {
            value: '1中庭做的LED大屏',
            label: '1'
          },
          {
            value: '小庭做的LED大屏',
            label: '2'
          }
        ],
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
        planStatuList:[
          {
            value: '全部',
            label: '1'
          },
          {
            value: '不是全部',
            label: '2'
          }
        ],
        playStatuList:[
          {
            value: '编播计划',
            label: '1'
          },
          {
            value: '插播计划',
            label: '2'
          },
          {
            value: '时间重复',
            label: '2'
          }
        ],
        allScreenList:[
          {
            value: '全部',
            label: '0'
          },
          {
            value: '1中庭做的LED大屏',
            label: '1'
          },
          {
            value: '小庭做的LED大屏',
            label: '2'
          }
        ],
        materialData:[
          {
            matrialName:'IDO品牌宣传广告',
            founder:'张三',
            founderPhone:'135 2156 1353',
            foundTime:'2018.7.17 19:42',
            planTime:'2018.8.1 13:00 - 14:00',
            planStyle:'已播放',
            playStyle:'编播内容 ',
            lookScreen:'大厅右侧LED大屏'
          },
          {
            matrialName:'拉菲团购促销广告',
            founder:'李四',
            founderPhone:'135 2156 1353',
            foundTime:'2018.7.16 19:42',
            planTime:'2018.8.1 13:00 - 14:00',
            planStyle:'待播放',
            playStyle:'插播内容 ',
            lookScreen:'中庭屏幕'
          }
        ],
        uploadFileList:[], //上传素材列表
        selectFileList:[], //选择素材列表
        addScreenList:[],//添加屏列表
        modifyForm:{//修改计划
          planList:[
            {
              id:'1',
              materaName:'IDO品牌宣传广告'
            },
            {
              id:'2',
              materaName:'拉菲团购促销广告'
            }
          ],
          startHouse:'',
          startMin:'',
          materaName:'IDO品牌宣传广告',
          materaType:'应该',
          timeSelect:[],
          // planSrart:'',
          // planEnd:'',
          planContent:'大富翁'
        }
      }
    },
    mounted () {
      this.initFullCalendar()
      this.screenList = [
        {
          id:'1',
          value:'大厅左侧LED大屏'
        },
        {
          id:'2',
          value:'2号门大屏'
        },
        {
          id:'3',
          value:'中间走廊屏'
        },
        {
          id:'4',
          value:'1号门左侧屏'
        },
        {
          id:'5',
          value:'中间走廊东侧屏'
        },
        {
          id:'6',
          value:'1号门中间屏'
        },
        {
          id:'7',
          value:'底边走廊东侧屏'
        }
      ]
    },
    methods:{
      initFullCalendar () {
        this.calendar = new Calendar('#calendar', {
          defaultView: this.defaultView,
          taskView: false,
          scheduleView: 'time',
          startDayOfWeek: 1,
          template: {
            allday: function (schedule) {
              return schedule.title + ' <i class="fa fa-refresh"></i>'
            },
            alldayTitle: function () {
              return '<div style="line-height:32px;text-align:right;">全天</div>'
            },
            time: function (schedule) {
              let start = moment(schedule.start.toUTCString())
              let end = moment(schedule.end.toUTCString())
              if(schedule.dueDateClass !== ''){
                return start.format('HH:mm') + ' --' + end.format('HH:mm') + '&nbsp;&nbsp;&nbsp;' + '<span style="display:inline-block;padding:3px;border:1px solid #f00;">'+schedule.dueDateClass+'</span>' + '<br>' + schedule.title
              }else{
                return start.format('HH:mm') + ' --' + end.format('HH:mm') + '&nbsp;&nbsp;&nbsp;<br>' + schedule.title
              }
            }
          },
          week: {
            daynames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            startDayOfWeek: 1,
            narrowWeekend: true
          }
        })
        let that = this
        this.calendar.createSchedules(this.schedules) // 渲染事件
        this.calendar.on('beforeCreateSchedule', function (event) { // 未安排事件的日历时间
          // console.log(moment(event.start.toUTCString()).format('YYYY-MM-DDTHH:mm:ss'))
          that.dialogVisible = true
          that.beginTime = moment(event.start.toUTCString()).format('YYYY-MM-DDTHH:mm:ss')
          if (event.end) {
            that.endTime = moment(event.end.toUTCString()).format('YYYY-MM-DDTHH:mm:ss')
          }
        })
        this.calendar.on('beforeUpdateSchedule', function (event) { // 拖拽修改时间
          let schedule = event.schedule
          let startTime = event.start
          let endTime = event.end
          for (let i = 0; i < that.schedules.length; i++) {
            if (that.schedules[i].id === schedule.id) {
              that.schedules[i].start = moment(startTime.toUTCString()).format('YYYY-MM-DDTHH:mm:ss')
              that.schedules[i].end = moment(endTime.toUTCString()).format('YYYY-MM-DDTHH:mm:ss')
            }
          }
          that.calendar.updateSchedule(schedule.id, schedule.calendarId, { // 更新一个事件
            start: startTime,
            end: endTime
          })
        })
        this.calendar.on('clickDayname', function (event) { // 点击日历的某一天
        console.log(event)
          if (that.calendar.getViewName() === 'week') {
            that.defaultView = 'day'
            that.calendar.setDate(new Date(event.date));
            that.calendar.changeView(that.defaultView, true)
          }
        })
        this.calendar.on('clickSchedule',function (event) { // 设置事件的点击事件
          let schedule = event.schedule
          //判断修改单个计划还是多个计划
          that.modifyPlanDia = true
          that.modifyPlanStyle = 'single'
          // 删除或者编辑
          // that.$confirm('提示',{
          //   confirmButtonText: '编辑',
          //   cancelButtonText: '删除',
          //   type: 'warning'
          // }).then(() => {
          //   that.editorId = schedule.id
          //   that.scheduleTitles = schedule.title
          //   that.beginTime = moment(schedule.start.toUTCString()).format('YYYY.MM.DD HH:mm:ss')
          //   that.endTime = moment(schedule.end.toUTCString()).format('YYYY.MM.DD HH:mm:ss')
          //   that.dialogVisible = true
          // }).catch(() =>{
          //   that.$confirm('此操作将删除改事件，是否继续？', '提示', {
          //     confirmButtonText: '确定',
          //     cancelButtonText: '取消',
          //     type: 'warning'
          //   }).then(() => {
          //   that.calendar.deleteSchedule(event.schedule.id, event.schedule.calendarId)
          //     for (let i = 0; i < that.schedules.length; i++) {
          //       if (that.schedules[i].id === event.schedule.id) {
          //         this.schedules.splice(i, 1)
          //       }
          //     }
          //   }).catch(() => {
          //     that.$message({
          //       type: 'info',
          //       message: '已取消删除'
          //     })
          //   })
          // })
        })
      
      },
      //新建计划
      createPlan(){
        this.currentTime()
        this.dialogVisible = true
      },
      listView(){
        this.viewSwitche = false
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
      prev(){//日历的前进按钮
        this.calendar.prev()
      },
      next(){//日历的后退按钮
        this.calendar.next()
      },
      week(){ //周视图切换
        this.calendar.today()
        this.defaultView = 'week'
        this.calendar.changeView(this.defaultView, true)
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
        }else{
          this.defaultView = 'day'
        }
        this.calendar.changeView(this.defaultView, true)
      },
      //选择素材出现弹框
      selectMaterial(index){
        this.diaLogMateria = true
      },
      //重新选择素材
      againSelectMaterial(index){
        this.againUploadIndex = index
        this.diaLogMateria = true
      },
      //添加屏幕
      addScreen(){
        this.screenDialog = true
        this.openScreen.screenStyle = 'newOpen'
        this.openScreen.screeName = '屏列表'
        this.openScreen.screeId = '-1'
      },
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
      closeScreen(list,value){
        this.screenDialog= value
        this.addScreenList = list
      },
      //选择素材
      chooseMaterial(value,tas){
        if(tas){
          let obj = {}
          obj.materialName = tas.materialTitle
          obj.matriaLabel = tas.matriaLabel
          obj.matrialType = tas.matrialType
          // obj.viewed = 0
          // obj.noPlay = 0
          // obj.planTimeHours = 0
          // obj.planTimeMinutes = 0
          // obj.viewedHours = 0
          // obj.viewedMinutes = 0
          obj.meteriaUrl = tas.meteriaUrl
          console.log(this.againUploadIndex)
          if(this.againUploadIndex !== ''){
            this.selectFileList.splice(this.againUploadIndex,1,obj)
          }else{
            this.selectFileList.push(obj)
          }
        }
        this.againUploadIndex= ''
        this.diaLogMateria = value
      },
      //文件上传
      againUpload(index){
        this.againUploadIndex = index
      },
      handlePreview(event, file, fileList){
        if(file.status === 'uploading'){
          this.uploadStatus = true
        }else{
          this.uploadStatus = false
        }
      },
      //文件上传失败
      error(response, file, fileList){//上传文件
        this.$message({
          message: '上传失败',
          type: 'error'
        })
      },
      //文件上传成功
      success(response, file, fileList){
        console.log(file)
        let fileFormat = file.name.split('.')[1]
        let obj = {}
        if(fileFormat === 'jpg' || fileFormat === 'jpeg' || fileFormat === 'gif' || fileFormat === 'png' || fileFormat === 'bmp'){
          obj.matrialType = '图片'
        }else if(fileFormat === 'avi' || fileFormat === 'rm' || fileFormat === 'rmvb' || fileFormat === 'wmv' || fileFormat === 'mp4' || fileFormat === 'flv'){
          obj.matrialType = '视频'
        }else if(fileFormat === 'mp3'){
          obj.matrialType = '音频'
        }else{
          obj.matrialType = '应用'
        }
        obj.materialName= file.name.split('.')[0]
        obj.meteriaUrl = file.url
        //判断是上传还是重新上传
        if(this.againUploadIndex !== ''){
          this.uploadFileList.splice(this.againUploadIndex,1,obj)
        }else{
          this.uploadFileList.push(obj)
        }
        this.againUploadIndex = ''
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      },
      //删除计划
      deletePlan(){
        this.$confirm('此操作将永久删除该文件, 是否继续?','确认删除',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() =>{
          this.modifyPlanDia = false
        }).catch(() =>{
          this.modifyPlanDia = false
        })
      },
      btnFasle () {
        this.dialogVisible = false
        this.openScreen.saveScreenStyle = true
        this.material ='上传素材'
        this.addScreenList =[]
        this.editorId = ''
        this.scheduleTitles = ''
        this.beginTime = ''
        this.endTime = ''
      },
      btnSure(){
        this.openScreen.saveScreenStyle = true
        if (this.scheduleTitles === '') {
          this.$message({
            message: '请输入主题',
            type: 'warning'
          })
        } else if (this.beginTime === '') {
          this.$message({
            message: '请选择开始时间',
            type: 'warning'
          })
        } else if (this.endTime === '') {
          this.$message({
            message: '请选择结束时间',
            type: 'warning'
          })
        } else if (this.beginTime === this.endTime) {
          this.$message({
            message: '开始时间不要呵结束时间一样',
            type: 'warning'
          })
        }else{
          this.dialogVisible = false
          let id = this.editorId ? this.editorId : this.schedules.length // 判断新建事件或者编辑事件
          let bgColor = this.editorId ? '#FFAE1C' : '#409eff'
          let borderColor = this.editorId ? '#FFAE1C' : '#409eff'
          let schedule = {
            id: id,
            calendarId: '1',
            title: this.scheduleTitles,
            category: 'time',
            dueDateClass: '',
            start: this.beginTime,
            end: this.endTime,
            color: '#fff',
            bgColor: bgColor,
            borderColor: borderColor
          }
          if (this.editorId === '') {
            this.calendar.createSchedules([schedule]) // 新建一个事件
          } else {
            this.calendar.deleteSchedule(this.editorId, '1')
            for (let i = 0; i < this.schedules.length; i++) {
              if (this.schedules[i].id === this.editorId) {
                this.schedules.splice(i, 1)
              }
            }
            this.calendar.createSchedules([schedule]) // 编辑一个事件
          }
          this.schedules.push(schedule)
          this.material ='上传素材'
          this.addScreenList =[]
          this.editorId = ''
          this.scheduleTitles = ''
          this.beginTime = ''
          this.endTime = ''
        }
      },
      currentTime(){
        let nowTime =moment(new Date().toUTCString()).format('YYYY.MM.DD HH:mm:ss')
        this.beginTime =  nowTime
        this.endTime = nowTime
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
    ::-webkit-scrollbar {
      width: 0px;
    }
  }
</style>
