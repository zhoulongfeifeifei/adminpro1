<template>
  <div class="test">
    <section class="con">
      <figure>
      <div class="crumbs">
        <span>上传文件</span>
      </div>
    </figure>
    <div class="box">
      <el-upload class="upload-demo" action="/api/permission/memberShop/export" :data="{token:pData.token}" :on-preview="handlePreview" 
      :on-remove="handleRemove" list-type="picture" :show-file-list="false" :on-success="success" :disabled="uploadStatus">
        <el-button size="small" type="primary" :loading="uploadStatus">点击上传</el-button>
      </el-upload>
      <ul>
        <li v-for="item in upFile">
          {{item.name}}{{item.url}}
        </li>
      </ul>
      <ul>
        <li v-for="item in selectTable">
          {{item}}
        </li>
      </ul>
      <el-button v-if="selectTable.length !== 0" @click="toggleSelection()">清空</el-button>
      <el-button @click="toggleSelection([tableData3[1], tableData3[2]])">切换第二、第三行的选中状态</el-button>
        <el-table ref="multipleTable" :data="tableData3" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="日期"
            width="120">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
         <el-pagination :page-size="2" layout="total, prev, pager, next" :total="3" prev-text="上页" next-text="下页" @current-change="pageChange"></el-pagination>
         <el-select v-model="aaa[adv]" placeholder="全部"  value-key="tagId">
            <el-option v-for="items in itemss" :key="items.tagId" :label="items.tagName" :value="items"></el-option>
          </el-select>
          {{aaa}}
    </div>
    </section>
  </div>
</template>
<script>
import * as Api from "@/api/api1"
  export default{
    name:'Test',
    data(){
      return{
       upFile:[],
       adv:1,
       aaa:[],
       itemss:[ { "groupId": 12, "groupName": "12", "tagRequired": 0, "tagOption": 1, "tagId": 17, "tagName": "发送" },
        { "groupId": 12, "groupName": "12", "tagRequired": 0, "tagOption": 1, "tagId": 18, "tagName": "3123" } ],
       uploadStatus:false,
       pData:{doc:{size:1024000}},
       options5: [{
          value: 'HTML',
          label: 'HTML'
        }, {
          value: 'CSS',
          label: 'CSS'
        }, {
          value: 'JavaScript',
          label: 'JavaScript'
        }],
        tableData3: [{
          id:'0',
          date: '2016-05-03',
          name: '王小',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id:'1',
          date: '2016-05-06',
          name: '王虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id:'2',
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        selectTable:[],
        kayVal:[],
        getRowKeys(row) {
            return row.orderid;
        },
        value10: ''
      }
    },
    mounted() {
      this.aa()
    },
    methods:{
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePreview (file) {
        console.log(file)
        if(file.status === 'uploading'){
          this.uploadStatus = true
        }else if(file.status === 'success'){
          this.uploadStatus = false
        }
      },
      success(response, file, fileList){
        console.log(file)
        let obj = {}
        obj.name= file.name
        obj.url = file.url
        this.upFile.push(obj)
      },
      change(){
        console.log(this.value10)
      },
      handleSelectionChange(row) {
        row.forEach((item, index) =>{
          this.kayVal.push(item.id)
          this.selectTable.push(item.id)
        })
        this.kayVal = Array.from(new Set(this.kayVal))
         this.selectTable = Array.from(new Set(this.selectTable))
      },
      toggleSelection(rows){
        if (rows) {
          rows.forEach(row => {
            console.log(row)
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      pageChange(val){
        if(val === 2){
          this.tableData3 =[
            {
              id:'3',
              date: '2016-05-03',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1518 弄'
            }
          ]
        }else{
          this.tableData3 =[
            {
              id:'0',
              date: '2016-05-03',
              name: '王小',
              address: '上海市普陀区金沙江路 1518 弄'
            }, {
              id:'1',
              date: '2016-05-06',
              name: '王虎',
              address: '上海市普陀区金沙江路 1518 弄'
            }, {
              id:'2',
              date: '2016-05-07',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1518 弄'
            }
          ]
        }
        for(let i =0;i< this.tableData3.length;i++){
          for(let y=0;y<this.kayVal.length;y++){
            if(this.kayVal[y] == this.tableData3[i].id){
              this.$refs.multipleTable.toggleRowSelection(this.tableData3[i], true)               
              // this.toggleSelection([this.tableData3[i]])
            }
          }
        }
      },
      aa(){
        let arr =[
          {
            id:'0',
            date: '2016-05-03',
            name: '王小',
            address: '上海市普陀区金沙江路 1518 弄'
            }, {
              id:'1',
              date: '2016-05-06',
              name: '王虎',
              address: '上海市普陀区金沙江路 1518 弄'
            }
        ]
        let arr2=[
          {
            id:'1',
            date: '2016-05-06',
            name: '王虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            id:'2',
            date: '2016-05-06',
            name: '王虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }
        ]
        let aaa = arr.concat(arr2)
        var result = [];
        let obj ={}
        for(var i =0; i<aaa.length; i++){
          if(!obj[aaa[i].id]){
            result.push(aaa[i]);
            obj[aaa[i].id] = true;
          }
        }
      }
    }
  }
</script>