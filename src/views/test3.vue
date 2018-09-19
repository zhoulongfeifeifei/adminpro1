<template>
  <div class="test">
    <section class="con">
      <div class="box" :data="screenList">
        <!-- 数据显示 -->
         <!-- <ul>
          <li  v-for="(item,index) in subscreenList" :key="index" >
            <p v-for="(subitem,subindex) in item" :key="subindex" :data="JSON.stringify(item)" v-show="item.length>0?true:false" @click="delete1(subitem,index,subindex)">
              {{subitem.name}}
            </p>
          </li>
        </ul>  -->
        <p v-for="(item,index) in subscreenList" :key="index">
          <el-tag v-for="(subitem,subindex) in item" :key="subindex">
            {{subitem.name}}
          </el-tag>
        </p>
        <!-- 不用ul标签也行 直接p标签 -->
        <!-- <p>{{selectName}}</p> --> 
        <el-button v-if="subscreenList.length !== 0" @click="toggleSelection()">清空</el-button>
        <el-table ref="multipleTable" :data="tableData3" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="日期" width="120">
            <template slot-scope="scope">{{ scope.row.date}}</template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="address" label="地址" show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <el-pagination :page-size="2" layout="total, prev, pager, next" :total="5" prev-text="上页" next-text="下页" @current-change="pageChange"></el-pagination>
        <div @click="aaa">
          <el-upload
              :data="dataObj"
              action="https://up.qiniup.com/"
              :before-upload="handlePreview"
              :on-success="handleImageScucess">
              <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <el-select v-model="value55" multiple placeholder="请选择">
          <el-option
            v-for="item in optionss"
            :key="item.value"
            :label="item.label"
            :value="item">
          </el-option>
        </el-select>
        <div>
          <span @click="prev">prev</span><span @click='nows'>本周</span><span @click="next">next</span>
        </div>
        {{weekList}}
      </div>
    </section>
  </div>
</template>
<script>
import * as Api from "@/api/api1"
const Swal=require("sweetalert2")
let moment = require('moment')
export default {
  name: 'Test',
  data() {
    return {
      currentFirstDate:'',
      arrs:[],
      value55:[],
      tagsList:[],
      tags:[],
      weekList:[],
      optionss: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
      dataObj: {token: ''},
      tableData3: [],
      screenList: [],
      subscreenList:[], 
      currentBack:[],
      tab4: [{
        id: '0',
        date: '2016-05-03',
        name: '王小',
        address: '上海市普陀区金沙江路 118 弄'
      }, {
        id: '1',
        date: '2016-05-06',
        name: '王虎',
        address: '上海市普陀区金沙江路 151 弄'
      }
      ],
      tab7:[
        {
          id: '2',
          date: '2016-05-03',
          name: '王小二',
          address: '上海市普陀区金沙江路 151 弄'
        }
      ],
      tableData5: [
        {
            id: '3',
            date: '2016-05-05',
            name: '王小r二',
            address: '上海市普陀区金沙'
          },
          {
            id: '4',
            date: '2016-05-056',
            name: '王3二',
            address: '上海市普陀区金沙'
          }
      ],
      tableData6:[
        [
          {
          id: '0',
          date: '2016-05-03',
          name: '王小',
          address: '上海市普陀区金沙江路 118 弄'
          }, {
            id: '1',
            date: '2016-05-06',
            name: '王虎',
            address: '上海市普陀区金沙江路 151 弄'
          }
        ],
        [
          {
            id: '3',
            date: '2016-05-05',
            name: '王小r二',
            address: '上海市普陀区金沙'
          },
          {
            id: '4',
            date: '2016-05-056',
            name: '王3二',
            address: '上海市普陀区金沙'
          }
        ],
        [
          {
            id: '2',
            date: '2016-05-03',
            name: '王小二',
            address: '上海市普陀区金沙江路 151 弄'
          }
        ]
      ]
    }
  },
  mounted() {
    this.tableData3 = this.tab4
    this.subscreenList = this.tableData6
    // let index = this.currentPage - 1;
    this.subscreenList.forEach((rows, index) =>{
      this.currentBack[index] = [];
      this.screenList[index] = [];
      rows.map(item =>{
        const _index = this.getIndexById(item.id,this.tableData3);
        this.currentBack[index].push(_index);
        this.screenList[index] = rows;
      })
      this.subscreenList = JSON.parse(JSON.stringify(this.screenList));
      this.currentBack[index]&&this.currentBack[index].map(item=>{
        this.$nextTick(()=>{
          if(this.tableData3[item] !=undefined){
            this.$refs.multipleTable.toggleRowSelection(this.tableData3[item])
          }
        })
      })
    })
    this.ass()
    this.todays()
    this.setDate(new Date())
  },
  methods: {
    todays(){
      var weekOfday = moment().format('E')
      var last_monday = moment().subtract(weekOfday+7-1, 'days').format('YYYY/MM/DD')
      var last_sunday = moment().subtract(weekOfday, 'days').format('YYYY/MM/DD')
    },
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
      var week = date.getDay()-1;
      date = this.addDate(date,week*-1);
      this.currentFirstDate = new Date(date);
      let arr = []
      for(var i = 0;i<7;i++){  
       arr.push(this.formatDate(i==0 ? date : this.addDate(date,1)))      
      }
      this.weekList= arr
    },
    nows(){
      this.setDate(new Date())
    },
    prev(){
      this.setDate(this.addDate(this.currentFirstDate,-7))
    },
    next(){
      this.setDate(this.addDate(this.currentFirstDate,7))
    },
    ass(){
      this.tagsList  =[
        [
          {tagOption:0,tagId:1,tagRequired:0,groupId:1}
        ],
        [
          {tagOption:0,tagId:2,tagRequired:1,groupId:2}
        ],
        [
          {tagOption:1,tagId:12,tagRequired:0,groupId:3}
        ],
        [
          {tagOption:1,tagId:12,tagRequired:1,groupId:4},
          {tagOption:1,tagId:23,tagRequired:1,groupId:4},
          {tagOption:1,tagId:243,tagRequired:1,groupId:4},
          {tagOption:1,tagId:123,tagRequired:1,groupId:4},
        ]
      ]
      this.tags =[
        {tagOption:0,tagId:1,tagRequired:0,groupId:1},
        {tagOption:0,tagId:2,tagRequired:1,groupId:2},
        [{tagOption:1,tagId:12,tagRequired:0,groupId:3}],
        [{tagOption:1,tagId:123,tagRequired:1,groupId:4}]
      ]
      let noDcon = 0
      let tagsArr = []
        for(let i in this.tags){
          //首先判断是单选还是多选
          if(Array.isArray(this.tags[i])){//多选
            //判断是必选还是非必须选
            if(this.tags[i].length === 0){//如果是0 判断是单选还是必选
              if(this.tagsList[i][0].tagRequired === 1){
                noDcon =1
                Swal({
                  text:'必选想不能为空',
                  allowOutsideClick:false
                })
              }
            }else{
              for(let k in this.tags[i]){
                let obj ={
                  groupId:this.tags[i][k].groupId,
                  tagId:this.tags[i][k].tagId
                }
                tagsArr.push(obj)
              }
            }
          }else{//单选
            if(Object.keys(this.tags[i]).length === 0){//判断是单选还是必选
              if(this.tagsList[i][0].tagRequired === 1){
                noDcon =1
                Swal({
                  text:'必选想不能为空',
                  allowOutsideClick:false
                })
              }
            }else{
              let obj ={}
              for(let k in this.tags[i]){  
                  obj.groupId =this.tags[i].groupId
                  obj.tagId =this.tags[i].tagId
              }
              tagsArr.push(obj)
            }
          }
        }
    },
    //获取索引
    getIndexById(id,arr){
      let k=-1;
      for(let i=0;i<arr.length;i++){
        if(arr[i].id == id){
          k = i;
          break;
        }
      }
      return k
    },
    handleSelectionChange(rows) {//当选择项发生变化时会触发该事
      let index = this.currentPage - 1;
      this.currentBack[index] = [];
      this.screenList[index] = [];
      rows.map(item=>{
        const _index = this.getIndexById(item.id,this.tableData3);
        this.currentBack[index].push(_index);
        this.screenList[index] = rows;
      })
      this.subscreenList = JSON.parse(JSON.stringify(this.screenList));
      // console.log(this.subscreenList)
    },
    toggleSelection(rows) {//回填
      this.$nextTick(()=>{
        this.$refs.multipleTable.clearSelection()
        this.subscreenList = []
        this.subscreenList = []
        this.currentBack = []
      })
    },
    pageChange(val) {//分页
      this.currentPage = val;
      if (val === 2) {
        this.tableData3 = this.tableData5
      } else if(val===3){
        this.tableData3 = this.tab7
      }
      else {
        this.tableData3 = this.tab4
      };
      this.currentBack[this.currentPage - 1]&&this.currentBack[this.currentPage-1].map(item=>{
        this.$nextTick(()=>{
          if(this.tableData3[item] !=undefined){
            this.$refs.multipleTable.toggleRowSelection(this.tableData3[item])
          }
        })
      })
    },
    //首次进来判断
    firstInto(){
       let index = this.currentPage - 1;
       this.currentBack[index] = [];
    },
    handleClose(tag,index,subindex){  
    },
    handleImageScucess(file) {
      console.log(file)
    },
    aaa() {
      const _self = this
      Api.uploadToken().then((res) => {

         _self.dataObj.token= res.data.object
         console.log( _self.dataObj.token)
      }).catch(err => {
          console.log(err)
          reject(false)
      })
    },
    handlePreview(){},
    getToken(){
        let self = this
        Api.uploadToken().then((res) =>{
          let data =res.data
          if(data.status === 0){
            self.diaLogChange= true
            self.load_data = false
            self.uploadToken = data.object
          }else{
            self.load_data = false
            Swal({
              text:data.errorMsg,
              allowOutsideClick:false
            })
          }
        }).catch((error) =>{
          console.log(error)
          self.load_data = false
          Swal({
            text:'请求服务器失败',
            allowOutsideClick:false
          })
        })
      },
  }
}
</script>