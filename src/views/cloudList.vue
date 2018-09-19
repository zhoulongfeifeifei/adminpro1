<template>
<div class="cloudList">
  <section class="con">
    <figure>
      <div class="crumbs">
        <span>编播管理</span>
      </div>
    </figure>
    <div class="box" v-loading="load_data" element-loading-text="拼命加载中">
      <el-form :inline="true" label-position='top'>
        <el-form-item label="商户名称">
            <el-input placeholder="输入商户名称" v-model="shopName">
              <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
            </el-input>
          </el-form-item>
          <el-form-item label="商户ID">
            <el-input type="number" placeholder="输入商户ID" v-model="shopId" oninput="if(value.length>8)value=value.slice(0,8)">
              <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
            </el-input>
          </el-form-item>
          <el-form-item label="是否脸脸自有商户">
            <el-select v-model="mrchant" placeholder="全部">
              <el-option v-for="item in mrchantList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地区选择" style="display:none;">
            <el-cascader :options="areaChoose" change-on-select v-model="workarea" @change="handleChange" ></el-cascader>
          </el-form-item>
          <el-form-item style='margin-top:50px;'>
            <el-button type="primary" icon="el-icon-search" @click="searchs">搜索</el-button>
          </el-form-item>
          <el-form-item style='margin-top:50px;'>
            <el-button type="primary" icon="el-icon-search" @click="clearClod">清空</el-button>
          </el-form-item>
          <el-table :data="tableData">
            <el-table-column aligin='center' prop="shopName" label="商户名称"></el-table-column>
            <el-table-column aligin='center' prop="shopId" label="商户ID"></el-table-column>
            <el-table-column aligin='center' prop="location" label="地区"></el-table-column>
            <el-table-column aligin='center' label="负责人">
              <template slot-scope="scope"><p>{{scope.row.wallahName}}<span v-if="scope.row.wallahPhone !=''">({{scope.row.wallahPhone}})</span></p></template>
            </el-table-column>
            <el-table-column aligin='center' label="操作">
              <template slot-scope="scope">
                <router-link :to="{ name: 'CloudSeedDetail',query: {shopId: scope.row.shopId}}">
                  <el-button type="text">详情</el-button>
                </router-link>
                <router-link :to="{ name: 'ScreenManage',query: {shopId: scope.row.shopId}}">
                  <el-button type="text">屏管理</el-button>
                </router-link>
                <router-link :to="{ name: 'MaterialManageList',query: {sid: scope.$index}}">
                  <el-button type="text">素材管理</el-button>
                </router-link>
                <router-link :to="{ name: 'CloudSeedPlan',query:{shopId:scope.row.shopId}}">
                  <el-button type="text">播放计划</el-button>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination :pageSize="page.pageRow" layout="total, prev, pager, next"
            :total="page.total" prev-text="上页" next-text="下页" @current-change="pageChange" :current-page.sync="page.pageNo"></el-pagination>
      </el-form>
    </div>
  </section>
</div>
</template>
<script>
import * as Api from "@/api/api1"
const Swal=require("sweetalert2")
import { regionData } from 'element-china-area-data'
  export default{
    name:'CloudList',
    data(){
      return{
        load_data:true,
        shopName:'',
        shopId:'',
        mrchant:0,
        page:{
          pageRow:0,
          pageNo:1,
          totalPageNo:0,
          total:0
        },
        workarea:["330000","330100","330106"],
        areaChoose:regionData,
        mrchantList:[
          {
            name:'全部',
            value:0
          },
          {
            name:'是',
            value:1
          },
          {
            name:'否',
            value:2
          }
        ],
        tableData:[]
      }
    },
    mounted() {
      this.load_data = true
      this.shopFindList(1)
    },
    methods: {
      handleChange(value){
      },
      //搜索
      searchs(){
        this.load_data = true
        this.page.pageNo =1
        this.shopFindList(1)
      },
      clearClod(){
        this.shopId = ''
        this.shopName = ''
        this.load_data = true
        this.page.pageNo =1
        this.shopFindList(1)
      },
      //分页
      pageChange(val){
        this.page.pageNo = val
        this.load_data = true
        this.shopFindList(val)
      },
      //商家分页
      shopFindList(pageNo){
        let self = this
        Api.shopFindList(
          {
            pageNo:pageNo,
            shopId:self.shopId,
            shopName:self.shopName
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
              self.page.pageRow = 20
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
      }
    }
  }
</script>
