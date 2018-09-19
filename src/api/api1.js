
import packAxios from "./packAxios";
export function findList(data) {                // 查询设备列表
  return packAxios({
    url: "/steyr/api/device/findList",
    method: "get",
    data
  })
}
export function getQiNiuToken(data) { //上传文件
  return packAxios({
    url: 'https://up.qiniup.com/',
    method:'post',
    data
  })
}
export function screenList(data) {                // 查询屏列表
  return packAxios({
    url: "/steyr/api/screen/findList",
    method: "get",
    data
  });
}
export function deviceLoadInfo(data) {                // 查询设备详情
  return packAxios({
    url: "/steyr/api/device/loadInfo",
    method: "get",
    data
  });
}
export function loadInfoByNumber(data) {                // 查询设备详情
  return packAxios({
    url: "/steyr/api/device/loadInfoByNumber",
    method: "get",
    data
  });
}
export function shopLoadName(data) {                // 查询商户所有权
  return packAxios({
    url: "/steyr/api/shop/loadName",
    method: "get",
    data
  });
}
export function deviceSave(data) {                // 设备保存
  return packAxios({
    url: "/steyr/api/device/save",
    method: "post",
    data
  });
}

export function screenSave(data) {                // 设备保存
  return packAxios({
    url: "/steyr/api/screen/save",
    method: "post",
    data
  });
}
export function editScreenInfo(data) {                // 编辑屏管理
  return packAxios({
    url: "/steyr/api/screen/loadInfo",
    method: "get",
    data
  });
}
export function screenLoadInfo(data) {                // 查询屏幕详情
  return packAxios({
    url: "/steyr/api/device/screen/loadInfo",
    method: "get",
    data
  });
}

export function screenDel(data) {                // 删除屏幕
  return packAxios({
    url: "/steyr/api/screen/del",
    method: "post",
    data
  });
}
export function uploadToken(data) {                // 上传获取token
  return packAxios({
    url: "/fussen/api/upload/token",
    method: "get",
    data
  });
}
export function saveMaterial(data) {                // 编辑素材
  return packAxios({
    url: "/fussen/api/material/saveMaterial",
    method: "post",
    data
  });
}
export function saveCircleMaterial(data) {                // 保存循环素材组
  return packAxios({
    url: "/fussen/api/material/saveCircleMaterial",
    method: "post",
    data
  });
}

export function findMaterials(data) {                // 查询素材列表
  return packAxios({
    url: "/fussen/api/material/findMaterials",
    method: "get",
    data
  });
}
export function loadMaterial(data) {
  // 查询素材详情
  return packAxios({
    url: "/fussen/api/material/loadMaterial",
    method: "get",
    data
  });
}
export function saveTag(data) {                // 保存素材标签
  return packAxios({
    url: "/fussen/api/material/tag/saveTag",
    method: "post",
    data
  });
}
export function findTags(data) {                // 查询所有素材标签
  return packAxios({
    url: "/fussen/api/material/tag/findTags",
    method: "get",
    data
  });
}
export function saveGroup(data) {                // 保存屏幕标签类
  return packAxios({
    url: "/fussen/api/tag/saveGroup",
    method: "post",
    data
  });
}
export function findGroupList(data) {                // 查询组列表分页
  return packAxios({
    url: "/fussen/api/tag/findGroupList",
    method: "get",
    data
  });
}
export function loadTagGroup(data) {                // 查询标签组信息
  return packAxios({
    url: "/fussen/api/tag/loadTagGroup",
    method: "get",
    data
  });
}
export function disableGroup(data) {                // 禁用标签组
  return packAxios({
    url: "/fussen/api/tag/disableGroup",
    method: "post",
    data
  });
}
export function enableGroup(data) {                // 取消禁用标签组
  return packAxios({
    url: "/fussen/api/tag/enableGroup",
    method: "post",
    data
  });
}
export function tagSaveTag(data) {                // 标签组新增标签和修改
  return packAxios({
    url: "/fussen/api/tag/saveTag",
    method: "post",
    data
  });
}
export function screenSaves(data) {                // 屏保存
  return packAxios({
    url: "/fussen/api/screen/save",
    method: "post",
    data
  });
}
export function screenFindPage(data) {                // 屏列表使用中
  return packAxios({
    url: "/fussen/api/screen/findPage",
    method: "get",
    data
  });
}
export function findPageUnuse(data) {                // 屏列表未使用
  return packAxios({
    url: "/fussen/api/screen/findPageUnuse",
    method: "get",
    data
  });
}
export function shopFindList(data) {                // 查询商家列表分页
  return packAxios({
    url: "/fussen/api/shop/findList",
    method: "get",
    data
  });
}
export function updateWallah(data) {                // 修改商家负责人
  return packAxios({
    url: "/fussen/api/shop/updateWallah",
    method: "post",
    data
  });
}

export function SavePlan(data) {                // 保存计划
  return packAxios({
    url: "/fussen/api/plan/savePlan",
    method: "post",
    data
  });
}
export function planFindList(data) {                // 查询计划列表分页
  return packAxios({
    url: "/fussen/api/plan/findList",
    method: "get",
    data
  });
}
export function findScreenList(data) {                // 查询屏计划列表分页
  return packAxios({
    url: "/fussen/api/plan/findScreenList",
    method: "get",
    data
  });
}
export function findShopList(data) {                // 查询计划列表分页
  return packAxios({
    url: "/fussen/api/plan/findShopList",
    method: "get",
    data
  });
}
export function updatePlan(data) {                // 修改计划
  return packAxios({
    url: "/fussen/api/plan/updatePlan",
    method: "post",
    data
  });
}
export function delPlan(data) {                // 通过素材删除计划
  return packAxios({
    url: "/fussen/api/plan/delPlan",
    method: "post",
    data
  });
}
export function delPlanByMaterial(data) {                // 通过素材删除计划
  return packAxios({
    url: "/fussen/api/plan/delPlanByMaterial",
    method: "post",
    data
  });
}
export function exchange(data) {                // 交换屏的顺序
  return packAxios({
    url: "/steyr/api/screen/exchange",
    method: "post",
    data
  });
}