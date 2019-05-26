var findCarTarget = false;
var data = {
    carName: '۲۰۶',
    color: 'خاکستری متالیک',
    firstName: 'اصغر',
    lastName: 'اکبری',
    nationalCode: '0720557798',
    nationalCode2: '۰۰۱۷۷۷۷۲۲۲',
    phone: '09121234567',
    province: 'تهران',
    city: 'تهران',
    bank: 'حساب سپه'
}
var color = 'خاکستری متالیک';
function ssGetCarList(carName, index) {
    var f = angular.element($("[ng-controller='app.views.searchcars as vm']")[0]).scope();
    var n = "" + f.csb + "|" + f.ccc + "|" + (f.cca || "0") + "|" + f.cpd;
    grecaptcha.ready(function() {
        grecaptcha.execute(abc.setting.get("SiteKey"), {
            action: "searchcars"
        }).then(function(t) {
            $.ajax({
                url: abc.appPath + "api/services/OnlineSales/searchCar/GetCustomerSearchCar2",
                type: "GET",
                data: {
                    SearchParams: n,
                    recap: t
                }
            }).then(function(n) {
                f.$apply(function () {
                    f.itemsFound = n.result.gssa.length;
                    f.Cars = n.result.gssa;
                    f.selectedRequest.carBrandSelected = f.ccc;
                    f.selectedRequest.prepaymentSelected = parseInt(f.cpd);
                    n.result.gssa.forEach(function (item) {
                        if (RegExp(carName).test(item.sta) && !findCarTarget) {
                            console.log('find target successfully')
                            findCarTarget = true;
                            f.redirectToNextLevel(item.ssu, item.sbp);
                            $( document ).ajaxStop(function() {
                                setTimeout(function () {
                                    ssSelectItemInPageStep1();
                                }, 1000);
                            });
                        }
                    });
                });
                setTimeout(function () {
                    $("#carGroupSelect").val(f.cca)
                }, 100)
                $("[name=carGroup]").val(f.cca);
                
                console.log('req ' + index + ' done');
            })
        })
    })
}

var ssIndex = 1;
function ssMain() {
    ssGetCarList(data.carName, ssIndex);
    ssIndex++;
    if (!findCarTarget) {
        setTimeout(function() {
            ssMain()
        }, 2000);
    }
}

function ssSelectItemInPageStep1 () {
    $("[name=GoldenCard]").eq(0).click();
    $("[name=Colors]").next().each(function (i, item) {
        if (RegExp(data.color).test($(item).text())) {
            $(item).prev().click()
        }
    })
    $("#featuresNextStep").click();
    setTimeout(function () {
        ssSelectItemInPageStep2();
    }, 1000);
}

function ssSelectItemInPageStep2 () {
    $('[name="firstName"]').val(data.firstName).change();
    $('[name="lastName"]').val(data.lastName).change();
    $('[name="userName"]').val(data.nationalCode).change();
    $('[name="password"]').val(data.nationalCode2).change();
    $('[name="cellPhoneNo"]').val(data.phone).change();
    $('#directiveProvince').children().each(function (i, item) {if (RegExp(data.province).test($(item).text())) {$('#directiveProvince').val($(item).val()).change()}})
    $('#directiveCity').children().each(function (i, item) {if (RegExp(data.city).test($(item).text())) {$('#directiveCity').val($(item).val()).change()}})
    $('#LoginButton').click();
    setTimeout(function () {
        ssSelectItemInPageStep3();
    }, 2000);
}

function ssSelectItemInPageStep3 () {
    $('#banksList').children().each(function(i, item) {
        if (RegExp(data.bank).test($(item).find('label').text())) {
            $(item).click();
        }
    })
    $('[name="que1"]').click();
    $('[name="que2"]').click();
    $('[name="agrement_checked"]').click();
    // $('[ng-click="SaveOrder()"]').click()
}

ssMain();