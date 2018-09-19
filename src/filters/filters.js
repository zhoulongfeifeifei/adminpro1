export function Kind(val) {
  if(val==0) {
    return '优惠券'
  }else if(val == 1){
    return '代金券'
  }else if(val == 2){
    return '折扣券'
  }else if(val == 3){
    return '兑换券'
  }else if(val == 4){
    return '买N送N券'
  }else if(val == 5){
    return '满就送券'
  }else if(val == 6){
    return '第二个半价券'
  }
}

export function Send(val) {
  if(val==0||val==""){
    return '[未发放]'
  }else{
    return '[已发放]'
  }
}

export function CouponStatus(val) {
  if(val==0){
    return '[未过期]'
  }else if(val==1){
    return '[已过期]'
  }
}
