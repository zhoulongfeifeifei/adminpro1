import Vue from "vue"
import Router from "vue-router"
import Public from "@/components/public"
import AppList from "@/views/appList"
import AppShopList from "@/views/appShopList"
import ShopList from "@/views/shopList"
import ShopActiveList from "@/views/shopActiveList"
import ShopActive from "@/views/shopActive"
import ShopEdit from "@/views/shopEdit"
import Role from "@/views/role"
import Business from "@/views/business"
import MemberLevel from "@/views/memberLevel"
import Address from "@/views/address"
import AuthVersionList from "@/views/authVersionList"
import UseShopList from "@/views/useShopList"
import CheckAuth from "@/views/checkAuth"
import Menu from "@/views/menu"
import ScreenManage from "../views/screenManage.vue"
import CloudList from "../views/cloudList.vue"
import CloudSeedDetail from "../views/cloudSeedDetail.vue"
import CloudSeedPlan from "../views/cloudSeedpPlan.vue";
import CloudPlanModify from "../views/cloudPlanModify.vue"
import PlayPlanList from "../views/playPlanList.vue"
import PlayPlanModify from "../views/playPlanModify.vue"
import MaterialManageList from "../views/materialManageList.vue"
import MaterialModify from "../views/materialModify.vue"
import BaseLabelConfig from "../views/baseLabelConfig.vue"
import BaseLabelList from "../views/baseLabelList.vue"
import Data from '../views/data.vue'
import Test from "../views/test.vue"
import Test1 from "../views/test2.vue"
import Test3 from "../views/test3.vue"
import EquipMent from '../views/equipMent.vue'
/*import GameInfo from "@/components/gameInfo"
import GuessChampion from "@/components/guessChampion"
import UpdateVideo from "@/components/updateVideo"
import Schedule from "@/components/schedule"
import ActivityList from "@/components/activityList"
import ActivityInfo from "@/components/activityInfo"
import CouponList from "@/components/couponList"
import AddCoupon from "@/components/addCoupon"
import ActivityGame from "@/components/activityGame"
import ActivityGameInfo from "@/components/activityGameInfo"
import ActivityScreen from "@/components/activityScreen"
import ActivityGuessChampion from "@/components/activityGuessChampion"
import ActivityGameChampionInfo from "@/components/activityGameChampionInfo"
import ActivityRanking from "@/components/activityRanking"
import ActivityRankingInfo from "@/components/activityRankingInfo"
import ActivityScreenManage from "@/components/activityScreenManage"
import ActivityInfo2 from "@/components/activityInfo2"*/

Vue.use(Router)

export default new Router({
  mode: "history",
  base: __dirname,
  linkActiveClass: "active",
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      };
    }
  },
  routes: [
    {
      path: "/",
      redirect: "/shop"
    },
    /*{
      path: "/app",
      component: Public,
      children: [
        {
          path: "/",
          name: "AppList",
          component: AppList
        },
        {
          path: "appShopList",
          name: "AppShopList",
          component: AppShopList
        }
      ]
    },*/
    {
      path: "/shop",
      component: Public,
      children: [
        {
          path: "/",
          name: "ShopList",
          component: ShopList
        },
        {
          path: "shopActiveList",
          name: "ShopActiveList",
          component: ShopActiveList
        },
        {
          path: "shopActive",
          name: "ShopActive",
          component: ShopActive
        },
        {
          path: "shopEdit",
          name: "ShopEdit",
          component: ShopEdit
        }
      ]
    },
    {
      path: "/menu",
      name: "Menu",
      component: Menu
    },
    {
      path: "/role",
      name: "Role",
      component: Role
    },
    {
      path: "/business",
      name: "Business",
      component: Business
    },
    {
      path: "/memberLevel",
      name: "MemberLevel",
      component: MemberLevel
    },
    {
      path: "/address",
      name: "Address",
      component: Address
    },
    {
      path: "/authVersionList",
      component: Public,
      children: [
        {
          path: "/",
          name: "AuthVersionList",
          component: AuthVersionList
        },
        {
          path: "useShopList",
          name: "UseShopList",
          component: UseShopList
        },
        {
          path: "checkAuth",
          name: "CheckAuth",
          component: CheckAuth
        }
      ]
    },
    {
      path: "/screenManage",
      name: "ScreenManage",
      component: ScreenManage
    },
    {
      path: "/cloud",
      component: Public,
      children: [
        {
          path: "/",
          name: "CloudList",
          component: CloudList
        },
        {
          path: "cloudSeedDetail",
          name: "CloudSeedDetail",
          component: CloudSeedDetail
        },
        {
          path: "cloudSeedPlan",
          name: "CloudSeedPlan",
          component: CloudSeedPlan
        },
        {
          path: "cloudPlanModify",
          name: "CloudPlanModify",
          component: CloudPlanModify
        }
      ]
    },
    {
      path: "/materialManage",
      component: Public,
      children: [
        {
          path: "/",
          name: "MaterialManageList",
          component: MaterialManageList
        },
        {
          path: "materialModify",
          name: "MaterialModify",
          component: MaterialModify
        }
      ]
    },
    {
      path: "/playPlan",
      component: Public,
      children: [
        {
          path: "/",
          name: "PlayPlanList",
          component: PlayPlanList
        },
        {
          path: "playPlanModify",
          name: "PlayPlanModify",
          component: PlayPlanModify
        }
      ]
    },
    {
      path: "/data",
      name: "Data",
      component: Data
    },
    {
      path: "/baseLabel",
      component: Public,
      children: [
        {
          path: "/",
          name: "BaseLabelConfig",
          component: BaseLabelConfig
        },
        {
          path: "baseLabelList",
          name: "BaseLabelList",
          component: BaseLabelList
        }
      ]
    },
    {
      path: "/test",
      name: "Test",
      component: Test
    },
    {
      path: "/test1",
      name: "Test1",
      component: Test1
    },
    {
      path: "/test3",
      name: "Test3",
      component: Test3
    },
    {
      path: "/equipMent",
      name: "EquipMent",
      component: EquipMent
    }
  ]
});
