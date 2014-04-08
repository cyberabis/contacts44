/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var userid;

function connection_check() {
    
    $.ajax({
                url: "http://contacts44.herokuapp.com/connectionTest",
                type: "GET",
                success: function (ajax_response) {
                    userid = ajax_response.user;
                    if ( (userid != null) && (userid !== undefined) ){
                        console.log("Active user: " + userid);
                        $('#logindiv').hide();
                        $('#logoutdiv').show();
                    }
                    else {
                        console.log("Not logged in");
                        $('#logoutdiv').hide();
                        $('#logindiv').show();
                    }
                    $('#loginmsgdiv').hide();
                }
           });
    
}

function user_login() {
    
    var user = $('#username').val();
    var password = $('#password').val();
    var email = $('#email').val();
    var signup = "no";
    if($('#checkbox-2a').prop('checked')){
        signup = "yes";
    }
    
    console.log("Login credentials: " + user + " " + password + " " + email + " " + signup);
    
    console.log("Json content: " + JSON.stringify({
                                                  "userid": user,
                                                  "password": password,
                                                  "email": email,
                                                  "signup": signup
                                                  }));
    
    $.ajax({
           url: "http://contacts44.herokuapp.com/login",
           type: "POST",
           contentType: "application/json",
           data: JSON.stringify({
            "userid": user,
            "password": password,
            "email": email,
            "signup": signup
           }),
           success: function (ajax_response) {
                userid = user;
                console.log("Active user: " + userid);
                $('#logindiv').hide();
                $('#logoutdiv').show();
                $('#loginmsgdiv').hide();
           },
           error: function() {
                userid = null;
                console.log("Not logged in");
                $('#logoutdiv').hide();
                $('#logindiv').show();
                $('#username').val("");
                $('#password').val("");
                $('#loginmsgdiv').show();
            }
           });
    
}


function user_logout() {
    
    $.ajax({
           url: "http://contacts44.herokuapp.com/logout",
           type: "GET",
           success: function (ajax_response) {
                userid = null;
                console.log("Not logged in");
                $('#logoutdiv').hide();
                $('#logindiv').show();
                }
           });
    
}

