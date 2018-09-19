import packAxios from "./packAxios"

export function Province(data) {                // 获取省份
    return packAxios({
        url: "/api/location/provinces",
        method: "get",
        data
    })
}

export function City(data) {                    // 获取城市
    return packAxios({
        url: "/api/location/citys",
        method: "get",
        data
    })
}

export function Business(data) {                // 业态列表
    return packAxios({
        url: "/api/permission/businessType/list",
        method: "get",
        data
    })
}
export function Address(data) {                // 地点列表
    return packAxios({
        url: "/api/shopType/findAllShopType",
        method: "get",
        data
    })
}

export function MemberLevel(data) {             // 等级列表
    return packAxios({
        url: "/api/member/findAllMemberLevel",
        method: "get",
        data
    })
}

export function AppList(data) {					// 应用管理列表
    return packAxios({
        url: "/api/game/findList",
        method: "get",
        data
    })
}

export function AppShopList(data) {				// 商家应用管理列表
    return packAxios({
        url: "/api/game/findList",
        method: "get",
        data
    })
}

export function ShopList(data) {                // 商家列表
    return packAxios({
        url: "/api/permission/memberShop/list",
        method: "get",
        data
    })
}

export function ShopAddressList(data) {         // 地点商家列表
    return packAxios({
        url: "/api/permission/memberShop/shopList",
        method: "get",
        data
    })
}

export function ShopInfo(data) {                // 商家详情
    return packAxios({
        url: "/api/permission/memberShop/load",
        method: "get",
        data
    })
}

export function ShopActive(data) {              // 激活商家
    return packAxios({
        url: "/api/permission/memberShop/activate",
        method: "get",
        data
    })
}

export function ShopEdit(data) {                // 保存商家
    return packAxios({
        url: "/api/permission/memberShop/update",
        method: "get",
        data
    })
}

export function AuthTree(data) {                // 查询权限树
    return packAxios({
        url: "/api/shop/permission/queryByType",
        method: "get",
        data
    })
}

export function Role(data) {                    // 角色管理
    return packAxios({
        url: "/api/staff/role/findAllRoles",
        method: "get",
        data
    })
}

export function CreateRole(data) {              // 新增角色
    return packAxios({
        url: "/api/staff/role/createRole",
        method: "post",
        data
    })
}

export function FindShopCustomAuth(data) {      // 查询商家权限树
    return packAxios({
        url: "/api/permission/custom/findNavByShop",
        method: "get",
        data
    })
}

export function ShopCustomAuth(data) {          // 查询商家自定义权限树
    return packAxios({
        url: "/api/permission/custom/shopCustomPermission",
        method: "get",
        data
    })
}

export function ShopCustomUpdateAuth(data) {     // 保存商家自定义权限树
    return packAxios({
        url: "/api/permission/custom/update",
        method: "post",
        data
    })
}

export function ShopAllAuth(data) {             // 商家所有权限
    return packAxios({
        url: "/api/shop/permission/findNavByKind",
        method: "get",
        data
    })
}

export function ShopSubmitAuth(data) {          // 保存权限
    return packAxios({
        url: "/api/shop/permission/saveShopPermission",
        method: "post",
        data
    })
}

export function UpDataAuth(data) {              // 更新权限
    return packAxios({
        url: "/api/shop/permission/updateShopPermission",
        method: "post",
        data
    })
}

export function AuthVersionList(data) {         // 权限版本列表
    return packAxios({
        url: "/api/permission/version/list",
        method: "get",
        data
    })
}

export function PushAuth(data) {                // 发布新权限
    return packAxios({
        url: "/api/permission/version/publish",
        method: "get",
        data
    })
}

export function ResetAuth(data) {               // 重置权限
    return packAxios({
        url: "/api/permission/version/reset",
        method: "get",
        data
    })
}

export function CheckAuth(data) {               // 查询权限
    return packAxios({
        url: "/api/shop/permission/findShopNav",
        method: "get",
        data
    })
}

export function ShopAuthUpdate(data) {          // 提交商家自定义权限
    return packAxios({
        url: "/api/permission/custom/update",
        method: "get",
        data
    })
}

export function AuthUpdate(data) {              // 更新权限
    return packAxios({
        url: "/api/shop/permission/update",
        method: "post",
        data
    })
}

export function AuthDelete(data) {              // 删除权限
    return packAxios({
        url: "/api/shop/permission/delete",
        method: "get",
        data
    })
}

export function AuthCreate(data) {              // 新建权限
    return packAxios({
        url: "/api/shop/permission/create",
        method: "post",
        data
    })
}

export function AuthInfo(data) {                // 查询权限
    return packAxios({
        url: "/api/shop/permission/detail",
        method: "get",
        data
    })
}
