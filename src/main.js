// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue"
import App from "./App"
// import VueResource from "vue-resource"
import axios from "axios"
import { Dialog, DatePicker, TimePicker, TimeSelect, Tabs, TabPane, Upload, Pagination, Tree, Form, FormItem, Button,ButtonGroup, Input, Select, OptionGroup,Option, Cascader, Table, TableColumn, Loading, Radio, RadioGroup, Checkbox, Message, MessageBox, Tag} from "element-ui"
import router from "./router"
import * as filters from "./filters/filters"
Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$msgbox = MessageBox;
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
Vue.component(Message)
Vue.component(MessageBox)
// Vue.use(VueResource)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(TimeSelect)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tree)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Input)
Vue.use(Select)
Vue.use(OptionGroup)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Table)
Vue.use(Loading)
Vue.use(TableColumn)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Checkbox)
Vue.use(Tag)
/* eslint-disable no-new */
new Vue({
  el: "#App",
  router,
  components: { App },
  template: "<App/>"
})
