/*
 * @author t@tabalt.net
 */

var apiQueryPetsOnSale = 'https://pet-chain.baidu.com/data/market/queryPetsOnSale';
var apiTxnCreate = 'https://pet-chain.baidu.com/data/txn/create';
var num = 0;


//刷新间隔，单位毫秒
var timeStep = 800;

//----------秒杀模式----------
var _pageSize = 1;
var maxPrice = 100; //最高价格

//----------正常模式----------
// var _pageSize = 20;
// var maxPrice = 500; //最高价格

//----------志在必得模式----------
// var _pageSize = 100;
// var maxPrice = 1500; //最高价格


function getBaiduDogs() {
    // 等级配置
    var degreeConf = options.getDegreeConf();
    $.ajax({
        type: 'POST',
        url: apiQueryPetsOnSale,
        contentType: 'application/json',
        data: JSON.stringify({
            "pageNo": 1,
            "pageSize": _pageSize,
            "querySortType": "AMOUNT_ASC",
            "petIds": [],
            "lastAmount": null,
            "lastRareDegree": null,
            "requestId": 1517819116506,
            "appId": 1,
            "tpl": ""
        }),
        success: function(res) {
            var petsOnSale = res.data.petsOnSale || [];
            // console.clear();
            // console.table(res.data.petsOnSale);
            console.log("为您服务次数：" +
                num++);

            $.each(petsOnSale, function(index, item) {
                var degree = degreeConf[item.rareDegree] || { desc: '未知', buyAmount: 5 };
                var buyAmount = degree.buyAmount || 5;
                if (item.amount <= maxPrice) {
                    $.ajax({
                        type: 'POST',
                        url: apiTxnCreate,
                        contentType: 'application/json',
                        data: JSON.stringify({
                            "petId": item.petId,
                            "requestId": 1517819116506,
                            "appId": 1,
                            "tpl": ""
                        }),
                        success: function(res2) {
                            console.log("尝试购买：ID[" + item.id + "],级别[" + item.rareDegree + "],价格[" + item.amount + ']')
                            console.log("命中策略：等级[" + degree.desc + "],最高价格[" + degree.buyAmount + ']')
                            if (res2.errorNo == 0) {
                                console.log("抢到啦！！！！！")
                            } else {
                                console.log("没抢到：错误码[" + res2.errorNo + '],错误信息[' + res2.errorMsg + ']')
                            }
                        }
                    });
                }
            });
        }
    });
}

console.log("start get dogs....\n")
setInterval(function() {
    getBaiduDogs();
}, timeStep);