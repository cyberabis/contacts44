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
var g_password;
var g_email;
var g_tags;

function connection_check() {
    
    $('#loginmsgdiv').hide();
    $('#savemsgdiv').hide();
    $('#errormsgdiv').hide();
    $('#logoutdiv').hide();
    $('#profileonline').hide();
    $('#pupdmsgdiv').hide();
    $('#pfailmsgdiv').hide();
    $('#searchresults').hide();
    $('#searchmsgdiv').hide();
    
    $.ajax({
                url: "http://contacts44.herokuapp.com/connectionTest",
                type: "GET",
                success: function (ajax_response) {
                    userid = ajax_response.user;
                    if ( (userid != null) && (userid !== undefined) ){
                        console.log("Active user: " + userid);
                        g_tags = ajax_response.tags;
                        g_password = ajax_response.password;
                        g_email = ajax_response.email;
                        $('#logindiv').hide();
                        $('#logoutdiv').show();
                        $('#profileoffline').hide();
                        $('#profileonline').show();
                    }
                    else {
                        console.log("Not logged in");
                        $('#logoutdiv').hide();
                        $('#logindiv').show();
                        $('#profileoffline').show();
                        $('#profileonline').hide();
                    }
                },
                error: function() {
                    userid = null;
                    console.log("Could not connect");
                    $('#logoutdiv').hide();
                    $('#logindiv').show();
                    $('#profileoffline').show();
                    $('#profileonline').hide();
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
    
    //Clean up variables, as this is fresh login
    userid = null;
    g_password = null;
    g_email = null;
    g_tags = null;
    $('#yourusername').text("");
    $('#userpassword').val("");
    $('#useremail').val("");
    $('#usercontact').val("");
    
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
                g_password = password;
                g_email = ajax_response.email;
                g_tags = ajax_response.tags;
                console.log("Active user: " + userid);
                console.log("Userid in response: " + ajax_response.userid);
                $('#yourusername').text(userid);
                $('#userpassword').val(g_password);
                $('#useremail').val(g_email);
                $('#usercontact').val(g_tags);
                $('#logindiv').hide();
                $('#logoutdiv').show();
                $('#loginmsgdiv').hide();
                $('#profileoffline').hide();
                $('#profileonline').show();
           },
           error: function() {
                userid = null;
                console.log("Not logged in");
                $('#logoutdiv').hide();
                $('#logindiv').show();
                $('#username').val("");
                $('#password').val("");
                $('#loginmsgdiv').show().delay(1500).fadeOut();
                $('#profileoffline').show();
                $('#profileonline').hide();
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
                $('#profileoffline').show();
                $('#profileonline').hide();
           
                //Clean up variables, as this is a logout
                userid = null;
                g_password = null;
                g_email = null;
                g_tags = null;
                $('#yourusername').text("");
                $('#userpassword').val("");
                $('#useremail').val("");
                $('#usercontact').val("");
           
                }
           });
    
}


function contact_save() {
    
    var contact = $('#newcontact')[0].value;
    if ((userid != null) && (userid !== undefined)){
        $.ajax({
               url: "http://contacts44.herokuapp.com/add",
               type: "POST",
               contentType: "application/json",
               data: JSON.stringify({
                                    "contact": contact
                                    }),
               success: function (ajax_response) {
               console.log("Contact saved: " + contact);
               $('#newcontact').val('');
               $('#savemsgdiv').show().delay(1500).fadeOut();
               $('#errormsgdiv').hide();
               },
               error: function() {
               userid = null;
               console.log("Save error");
               $('#savemsgdiv').hide();
               $('#errormsgdiv').show().delay(1500).fadeOut();
               }
               });
    }
    else {
        //Display alert
        $('#savemsgdiv').hide();
        $('#errormsgdiv').show().delay(1500).fadeOut();
    }
    
}

function get_profile() {
    console.log('Profile page clicked!');
    
    if ( (userid != null) && (userid !== undefined) ){
        //First clear of everything
        //$('#yourusername').text("");
        //$('#userpassword').val("");
        //$('#useremail').val("");
        //$('#usercontact').val("");
        $('#yourusername').text(userid);
        $('#userpassword').val(g_password);
        $('#useremail').val(g_email);
        $('#usercontact').val(g_tags);
    }
    else {
        //Set as not logged in
        //Clean up variables, as this is fresh login
        userid = null;
        g_password = null;
        g_email = null;
        g_tags = null;
        $('#yourusername').text("");
        $('#userpassword').val("");
        $('#useremail').val("");
        $('#usercontact').val("");
    }
}

function user_update() {
    var email = $('#useremail').val();
    var password = $('#userpassword').val();
    var tags = $('#usercontact')[0].value;
    $.ajax({
           url: "http://contacts44.herokuapp.com/updateProfile",
           type: "POST",
           contentType: "application/json",
           data: JSON.stringify({
                                "email": email,
                                "password": password,
                                "tags": tags
                                }),
           success: function (ajax_response) {
           console.log("User saved: " + userid);
           g_password = password;
           g_email = email;
           g_tags = tags;
           get_profile();
           $('#pupdmsgdiv').show().delay(1500).fadeOut();
           $('#pfailmsgdiv').hide();
           },
           error: function() {
           console.log("Error while updating profile");
           $('#pupdmsgdiv').hide();
           $('#pfailmsgdiv').show().delay(1500).fadeOut();
           }
           });
}


function contact_search() {
    
    var tags = $('#searchcontact').val();
    var scope = "global";
    if($('#checkbox-1a').prop('checked')){
        scope = "local";
    }
    var rest_url = "http://contacts44.herokuapp.com/search?scope="+scope+"&tags="+tags;
    console.log("Rest Url for search: " + rest_url);
    $('#searchresults').hide();
    
    $.ajax({
           url: rest_url,
           type: "GET",
           success: function (ajax_response) {
                var data = ajax_response;
                //var htmlout = '<ol data-role="listview" data-inset="true" id="contactlist"><li data-role="list-divider">Contacts</li>';
                var htmlout = '<li data-role="list-divider">Found '+ ajax_response.length + ' Contact(s)</li>';
                for(var i in data)
                {
                    var contactid = data[i].contactid;
                    var contact = data[i].contact;
                    console.log("Received search result: " + contact);
                    htmlout += '<li>'+contact+'</li>';
                }
                //htmlout += '</ol>'
                $('#searchresults').show();
                $('#searchmsgdiv').hide();
                //$('#searchresults').html(htmlout);
           
                $('#olist').html($(htmlout));
                $('#olist').trigger('create');
                $('#olist').listview('refresh');

           },
           error: function() {
                console.log("Could not connect for search");
                $('#searchmsgdiv').show().delay(1500).fadeOut();
           }
           
           });

    
}
