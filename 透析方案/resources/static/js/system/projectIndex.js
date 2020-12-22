var projectIndex = avalon.define({
  $id: "projectIndex",
  baseFuncInfo: baseFuncInfo, //底层基本方法

});

layui.use(['index', 'echarts', 'senior'], function () {
  //加载layui的模块，index模块是基础模块，也可添加其它
  avalon.ready(function () {
    //所有的入口事件写在这里...
    getmethod();
    });
    avalon.scan();
});


function getmethod(){
  var myechart = echarts.init(document.getElementById('patientDialysisStatistic'));
  myechart.setOption({
    xAxis: {
      type: 'category',
      data: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      }
    },
    series: [{
      data: [901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true
    }]
  },true);

}
