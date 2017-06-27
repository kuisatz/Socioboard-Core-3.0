'use strict';

SocioboardApp.controller('AccessPasswdController', function ($rootScope, $scope, $http, $timeout, $mdpDatePicker, $mdpTimePicker, apiDomain, domain) {
    //alert('helo');
    $scope.$on('$viewContentLoaded', function () {

        access_passwd();
        $scope.twosteploginstatus = $rootScope.user.TwostepEnable;
        $scope.password = $rootScope.user.Password;
        //Initialization
        $scope.updatePassword = {};

        
        




        //open password model for two step login
        $scope.enableModel = function () {
            $("#2step_login_enable").openModal();
        }
        $scope.disableModel = function () {
            $("#2step_login_disable").openModal();
        }
        $scope.changepasswordModel = function () {
            $("#change_passwd").openModal();
        }

        //Enable two step login
        $scope.enabletwosteplogin = function (verifyPassword) {
            debugger;
            $http({
                method: 'POST',
                url: apiDomain + '/api/User/EnableTwoStepLogin?currentPassword=' + verifyPassword.currentPassword + '&userId=' + $rootScope.user.Id,
                crossDomain: true,
                //data: ,
            }).then(function (response) {

                alertify.set({ delay: 5000 });
                alertify.success(response.data);
                window.location.reload();
                //document.querySelector("#mail_div").style.display = "block";
                //document.querySelector("#change_email_btn").style.display = "none";
            }, function (reason) {

                alertify.set({ delay: 5000 });
                alertify.error(reason.data);


            });
        }

        //Disable two step login
        $scope.disabletwosteplogin = function (verifyPassword) {
            debugger;
            $http({
                method: 'POST',
                url: apiDomain + '/api/User/DisablebleTwoStepLogin?currentPassword=' + verifyPassword.currentPassword + '&userId=' + $rootScope.user.Id,
                crossDomain: true,
                //data: ,
            }).then(function (response) {

                alertify.set({ delay: 5000 });
                alertify.success(response.data);
                window.location.reload();
                //document.querySelector("#mail_div").style.display = "block";
                //document.querySelector("#change_email_btn").style.display = "none";
            }, function (reason) {

                alertify.set({ delay: 5000 });
                alertify.error(reason.data);


            });
        }

        //Update Password
        $scope.UpdatePassword = function (updatePassword) {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                var eqPos = cookie.indexOf("=");
                var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                if (name.indexOf("socioboardpluginemailId") > -1) {
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
                if (name.indexOf("socioboardpluginToken") > -1) {
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
            }
            $http({
                method: 'POST',
                url: apiDomain + '/api/User/ChangePassword?currentPassword=' + updatePassword.currentPassword + '&newPassword=' + updatePassword.newPassword + '&conformPassword=' + updatePassword.conformPassword + '&userId=' + $rootScope.user.Id,
                crossDomain: true,
                //data: ,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                alertify.set({ delay: 5000 });
                alertify.success(response.data);
                updatePassword.currentPassword = '';
                updatePassword.newPassword = '';
                updatePassword.conformPassword = '';
            }, function (reason) {
                alertify.set({ delay: 5000 });
                alertify.error(reason.data);

            });
        }
        //Code for fetching session details
        $scope.fetchUserSession = function () {
            $http.get(apiDomain + '/api/User/GetUserSessions?userId=' + $rootScope.user.Id)
                            .then(function (response) {
                                $scope.userSessions = response.data;
                                $scope.sessionTimedifference($scope.userSessions);
                            }, function (reason) {
                                $scope.error = reason.data;
                            });
        }
        $scope.fetchUserSession();

        $scope.Revokesession = function (sessionId, systemId) {
            $http.post(apiDomain + '/api/User/RevokeSession?sessionId=' + sessionId + '&systemId=' + systemId)
                            .then(function (response) {
                                swal('your session has been revoked');
                                var cookies = document.cookie.split(";");
                                for (var i = 0; i < cookies.length; i++) {
                                    var cookie = cookies[i];
                                    var eqPos = cookie.indexOf("=");
                                    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                                    if (name.indexOf("socioboardpluginemailId") > -1) {
                                        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                                    }
                                    if (name.indexOf("socioboardpluginToken") > -1) {
                                        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                                    }
                                    if (name.indexOf("socioboardToken") > -1) {
                                        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                                    }
                                    if (name.indexOf("socioboardemailId") > -1) {
                                        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                                    }
                                    if (name.indexOf("sociorevtoken") > -1) {
                                        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                                    }
                                }
                                $scope.fetchUserSession();
                            }, function (reason) {
                                $scope.error = reason.data;
                            });
        }


        $scope.sessionTimedifference = function (parm) {

            for (var i = 0; i < parm.length; i++) {
                //var mytimeinUtc = new Date('2017-06-24 10:55:10').toUTCString();
                var utcTime = new Date().toUTCString();
                
                var x = new Date(parm[i].lastAccessedTime);
                var y = new Date(parm[i].firstloginTime);
                var test = new Date(x);//new Date(mytimeinUtc);
                var test1 = new Date(y);//new Date(mytimeinUtc);
                var d1 = new Date();
                try {
                    var adtlastAccessedTime = moment([test.getFullYear(), test.getMonth(), test.getDate(), test.getHours(), test.getMinutes(), test.getSeconds()]);
                } catch (e) {
                    console.log(e);
                }
                try {
                    var afirstloginTime = moment([test1.getFullYear(), test1.getMonth(), test1.getDate(), test1.getHours(), test1.getMinutes(), test1.getSeconds()]);
                } catch (x) {
                    console.log(x);
                }
                var b = moment([d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds()]);
                var dlastAcce = adtlastAccessedTime.from(b);
                var dfirstlog = afirstloginTime.from(b);
                parm[i].lastAccessedTime = dlastAcce;
                parm[i].firstloginTime = dfirstlog;
            }
            $scope.Sessions = parm;

        }


    });
});