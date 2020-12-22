/**
 * 打印患者体格检查西悉尼
 * @Author wahmh
 * @version: 1.0
 * @Date 2020-11-23
 */
var patPhysicalCheckListPrint = avalon.define({
    $id: "patPhysicalCheckListPrint",
    baseFuncInfo: baseFuncInfo,//底层基本方法
    applyDate:'',
    hospitalName:'',
    mechanism:'',
    patientName:'',
    gender:'',
    patientAge:'',
    patientRecordNo:'',
    illness:'',
    purpose:'',
    applyList:[],
    patPhysicalCheckListPrint:{}

});
layui.use(['index'], function () {
    avalon.ready(function () {
        var uuid = GetQueryString('uuid');
        var temp=sessionStorage.getItem(uuid);
        var data = JSON.parse(temp);  //根据获取的uuid获取缓存的数据
        sessionStorage.removeItem(uuid)//清楚缓存数据
        data.appetiteStatus=getSysDictName('AppetiteStatus',data.appetiteStatus);//食欲
        data.sleepStatus=getSysDictName('SleepStatus',data.sleepStatus);//睡眠
        data.stoolStatus=getSysDictName('StoolStatus',data.stoolStatus);//大便
        data.bleedingStatus=getSysDictName('BleedingStatus',data.bleedingStatus);//出血状况
        data.ordinaryStatus=getSysDictName('BodyStatus',data.ordinaryStatus);//一般情况
        data.nutritionalStatus=getSysDictName('BodyStatus',data.nutritionalStatus);//营养状况
        data.anemicFace=getSysDictName('AnemicFace',data.anemicFace);//贫血面容
        data.posture=getSysDictName('Posture',data.posture);//体位
        data.dropsyStatus=getSysDictName('DropsyStatus',data.dropsyStatus);//浮肿
        data.dropsyLevel=getSysDictName('DropsyLevel',data.dropsyLevel);//浮肿程度
        data.hematomaStatus=getSysDictName('HematomaStatus',data.hematomaStatus);//出血点 瘀斑
        data.pleuralRubSounds=getSysDictName('PleuralRubSounds',data.pleuralRubSounds);//胸膜摩擦音
        data.raleSounds=getSysDictName('Posture',data.raleSounds);//啰音
        data.heartRhythm=getSysDictName('HeartRhythm',data.heartRhythm);//心律
        data.cardiacSize=getSysDictName('CardiacSize',data.cardiacSize);//心脏大小
        data.pericardialRubSounds=getSysDictName('CardiacSounds',data.pericardialRubSounds);//心包摩擦音
        data.murmurSounds=getSysDictName('CardiacSounds',data.murmurSounds);//杂音
        data.extraSounds=getSysDictName('CardiacSounds',data.extraSounds);//附加音
        data.pericardialEffusionSign=getSysDictName('PericardialEffusionSign',data.pericardialEffusionSign);//心包积液体征
        data.ascitesSign=getSysDictName('AscitesSign',data.ascitesSign);//腹水征
        data.arterialRefluxSign=getSysDictName('ArterialRefluxSign',data.arterialRefluxSign);//肝颈动脉回流征
        patPhysicalCheckListPrint.patPhysicalCheckListPrint=data
        avalon.scan();
    });
});

/**
 * 点击打印事件
 */
function onPrint() {
    window.print();
}




