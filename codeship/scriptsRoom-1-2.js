	var windowProxy;  
	var integration_id="";
	var user_id="";
	var mule_token="";
	var action="";
	var listResultData="";
	var integration_app_icon_url="";
	var spark_icon_url="https://d24wgzqqegxpap.cloudfront.net/api/images/spark-icon.png";
	var instanceData="";
	var formAction=""; 
	var instanceId="";
	var removeRoomId = "";
	var room_modified=false;
	var selected_room_id="0";
	var room_id_old="";
	var oauthRequired=true;
	var appTokenExists=false;
	var saveSparkTokenResponse="";
	var saveIntegrationTokenResponse="";
	var postMessageToSpark = "added to this space";
	var updateMessageToSpark = "added to this space";
	var removeMessageToSpark = "has been removed from this space";
	var roomsArray = [];
	var rooms=[];
	var rooms_list = "";
	var ui_settings="";
	var authenticated_user="";
	var allRooms= [];
	var allInstances= "";
	var appName= "";
	var roomsEventResponse = false;
	var allInstancesResponse = false;
	var listCheckAllRooms = false;
	var isPrivate_config = false;
	var application_id = "";
	var popblockedMessage = "Hey there! Looks like your browser blocked pop ups for this site. Please enable pop ups in your browser settings and refresh screen to set up this integration. You can always disable it after the initial set up of this integration."
	var bannerMsg = 'We are currently investigating an issue with this integration. You may face difficulty setting it up or receiving notifications from previously set up configurations.';
	var clientAppRevokeMsg = "";
	var isClientAppTokenValid = true;
	var instanceList = "";
	var isMobile = false;
	var authenticationFlag = true;
	var roomFirstOption = "";
	if (/Mobi/.test(navigator.userAgent)) {isMobile=true;}
	function onMessage(messageEvent) {
		if (messageEvent.data["resize"]) {
			document.body.bgColor = messageEvent.data["resize"];
		}
	}			
    function gup(url, name) {
        name = name.replace(/[[]/,"\[").replace(/[]]/,"\]");
        var regexS = "[\?&]"+name+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var results = regex.exec( url );		
        if( results == null )
            return "";
        else
            return results[1];
    }
    function resize(){       
		var height = document.body.scrollHeight+40;
		var width =  document.body.scrollWidth+20;
		var isChrome = !!window.chrome && !!window.chrome.webstore;
		var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
		if(isChrome || isSafari){          
            height = document.documentElement.scrollHeight+60;
        }else{
			height = document.body.scrollHeight+60;
			if(height>5000){height=height+10;}
			if(height>8000){height=height+30;}
		}
		if(height<300)height=300;
		if (/Mobi/.test(navigator.userAgent)) {
			height = document.getElementsByTagName("html")[0].scrollHeight+60;
		}		
		console.log("height..." + height);
    	windowProxy.post({'resize':true,'height':height,'width':width});
    }
	function connectIntegration(){       
    	windowProxy.post({'connectIntegration':true,'statusCode':200});
    }
	function disconnectIntegration(){       
    	windowProxy.post({'disconnectIntegration':true,'statusCode':200});
    }
	function getDateTime (expireTime) {
		var current = new Date();
		var newDate = new Date(current.getTime() + (expireTime*1000));
		year = "" + newDate.getFullYear();
		month = "" + (newDate.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
		day = "" + newDate.getDate(); if (day.length == 1) { day = "0" + day; }
		hour = "" + newDate.getHours(); if (hour.length == 1) { hour = "0" + hour; }
		minute = "" + newDate.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
		second = "" + newDate.getSeconds(); if (second.length == 1) { second = "0" + second; }
		return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
	}
		
	var application_auth_details_url="";
	var	token_url="";
	var save_app_token_url="";
	var save_spark_token_url="";
	var get_integration_token_url="";
	var	configuration_settings_url="";
	var save_configuration_settings_url="";
	var update_configuration_settings_url="";
	var delete_instance_url="";
	var list_integration_instances_url="";
	var removeall_integration_instances_url="";	
	var delete_spark_token_url="";
	var delete_integration_token_url="";

	
    $( document ).ready(function() {
		$(".warning-msg").html(bannerMsg);
		$('#integration-form').hide();
		$(document).foundation();
		windowProxy = new Porthole.WindowProxy("https://d24wgzqqegxpap.cloudfront.net/api/proxy.html"); 
		windowProxy.addEventListener(onMessage);		
        var url = window.location.href;
        var integrationId = gup(url,"integrationId");
		user_id = gup(url,"userId");
		mule_token = gup(url,"access_token");
		action = gup(url,"action");     
		integration_id =integrationId;
		getSparkRooms = "/api/integrations/"+integration_id+"/getSparkRooms";
		setTimeout(resize, 200);				
		$.fn.serializeObject = function() {
			var o = {};
			var a = this.serializeArray();
			$.each(a, function() {
				if (o[this.name] !== undefined) {
					if (!o[this.name].push) {
						o[this.name] = [o[this.name]];
					}
					o[this.name].push(this.value || '');
				} else {
					o[this.name] = this.value || '';
				}
			});
			return o;
		};
		$('body').on({ 'touchstart' : function(){ 
			$('.tooltip.right').hide();
			}
		});	
		$(document).on('keyup', '.select2-search__field', function(e) {
			var newId = "";
			if(e.keyCode == 8){
				newId = $("#select2-rooms-results li:first-child").attr('id');
				if(newId!=undefined)newIdArray = newId.split('-');
				var newIdValue = newIdArray[newIdArray.length - 1];
				if(newIdValue!="0"){
					console.log("newId!!!!" + newId);
					$('#'+newId).show();
				}
			}else{
				newId = $("#select2-rooms-results li:first-child").attr('id');
				if(newId!=undefined)newIdArray = newId.split('-');
					var newIdValue = newIdArray[newIdArray.length - 1];
					if(newIdValue!="0"){
						console.log("newId!!!!" + newId);
						$('#'+newId).show();
					}
			}
		});
		$(document).on("click", "#instance-list-block .remove-config" , function() {
			console.log("click on remove.");
			instanceId=this.id;
			$.each(listResultData,function(index,value){
				if(value["instanceId"]==instanceId) {
					instanceData=value;
				}
			});
			var config=JSON.parse(instanceData.configJson);
			if(config.hasOwnProperty("unauthmode")){
				console.log("script unauthmode..." + config.unauthmode);
				if(config.unauthmode)
					oauthRequired=false;
				else
					oauthRequired=true;
			}
			var selectedRoomName = "No";
			if(rooms.length!=0){
				if(allRooms.length!=0){
					$.each(allRooms, function(id,obj){
						if(instanceData.channelId==obj.id){
							selectedRoomName = obj.title;
							removeRoomId = instanceData.channelId;
							 return false; 
						}	
					});
				}else{
					$.each(rooms, function(id,obj){
						if(instanceData.channelId==obj.id){
							selectedRoomName = obj.title;
							removeRoomId = instanceData.channelId;
							return false; 
						}	
					});
				}
				
			} else {
				selectedRoomName = "No";
			}
			$("#displayName-label").html(config.displayName);
			$("#addedon-label").html("Added on: "+getDateForTimestamp(instanceData.createdDate));
			if(selectedRoomName == "No")
			$("#remove-msg").html("Your configured space is not available. Are you sure you  want to remove this configuration?");
			else
			$("#remove-msg").html("Are you sure you  want to remove this configuration from "+selectedRoomName+" Space?");
			$("#remove-msg-mobile").html("Are you sure you  want to remove this configuration from "+selectedRoomName+" Space?");
			console.log("oauthRequired..." + oauthRequired);
			if(oauthRequired){
				$("#remove-auth").html("Authenticated to: "+authenticated_user);				
				$("#remove-auth-mobile").html("Authenticated to: "+authenticated_user);
			}else{
				$("#remove-auth").html("");				
				$("#remove-auth-mobile").html("");
			}
			formAction="remove";
			$('#remove-integration-btn').text("Remove");
			$('#remove-integration-btn-mobile').text("Remove");			
		});
		$('#cancel-remove-integration').click(function(e){
			e.preventDefault();
			$('#remove-integration-popup').foundation('close');
		});
		$('.remove-integration-btn').click(function(e){
			e.preventDefault();
			$('#remove-integration-popup').foundation('close');
			if(formAction=="removeAll") {
				removeAllIntegrationInstances("remove");
			} else { 
				removeIntegrationInstance(instanceId,removeRoomId);
			}
		});
		$(document).on("click", "#remove-all-config" , function() {
			$("#displayName-label").html("");
			$("#addedon-label").html("");
			$("#remove-msg").html("Are you sure you want to remove all the configurations for this integration?");
			formAction="removeAll";
			$('#remove-integration-btn').text("Remove All");		
			$('#remove-integration-btn-mobile').text("Remove All");				
			resize();
		});
		var copyToClipboard = function(textToCopy){
			$("body")
			.append($('<input type="text" name="webhookurl" class="textToCopyInput"/>' )
			.val(textToCopy))
			.find(".textToCopyInput")
			.select();
			try {
				var successful = document.execCommand('copy');
				var msg = successful ? 'successful' : 'unsuccessful'; 
				if(msg == 'unsuccessful'){
					var inp = document.querySelector($('#webhookURL')); 
				}
			} catch (err) {
				window.prompt("To copy the WebhookURL : Ctrl/Cmd+C, Enter", textToCopy);
			}
			$(".textToCopyInput").remove();
		} 
		$('#copy').on('click',function(){
			copyToClipboard($('#webhookURL').val());
			$('#copy').text("Copied!");
			setTimeout(function()
			{
			$('#copy').text("Copy URL");
			},1500) 
		});		
	});	
	function objLength(obj){
		var i=0;
		for (var x in obj){
			if(obj.hasOwnProperty(x)){
				i++;
			}
		} 
		return i;
	}
	function nth(d) {
		if(d>3 && d<21) return 'th'; 
		switch (d % 10) {
			case 1:  return "st";
			case 2:  return "nd";
			case 3:  return "rd";
			default: return "th";
		}
	}
	function getDateForTimestamp(timestamp) {
		var datevalues="";
		if(timestamp!=0 || timestamp!=""|| timestamp!=null){
			var date = new Date(timestamp);
			var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			datevalues=date.getDate()+nth(date.getDate())+" "+(months[date.getMonth()])+", "+ date.getFullYear();
		}
		return datevalues;
	}	
	function listInstancesData(result, checkAllRooms) {
		console.log("in list data");
		var listDataHTML="";
		var noRoomNameList =[];
		listResultData=result;
		if(listResultData.length>0){
		$.each(listResultData, function(i, instance) {
			var roomname="No";
			var configData=JSON.parse(instance.configJson);
			if(!checkAllRooms){	
				if(rooms.length!=0){
					$.each(rooms, function(id,obj){
						if(instance.channelId==obj.id){
						roomname = obj.title;
						 return false; 
						}
					});	
				   if(roomname == "No" && listCheckAllRooms == false){
					 listCheckAllRooms = true;
					  setTimeout(loadListDataAgain ,500);
					}			   
				}
			} else {
				if(allRooms.length!=0){
						$.each(allRooms, function(id,obj){
							if(instance.channelId==obj.id){
							roomname = obj.title;
							 return false; 
							}
						});
					}else roomname = "No";
			}		
			if(roomname == "No")
			{
				  noRoomNameList.push(instance.channelId); 
				  return true;
			}
				listDataHTML+='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
				listDataHTML+='<div class="large-8 medium-8 columns integration-details">';
				listDataHTML+='<img src="'+integration_app_icon_url+'" alt="">';
				listDataHTML+='<label>'+configData.displayName+'</label>';
				if(!checkAllRooms && roomname == "No")
				listDataHTML+='<label class="room"></label>';
				else 
				listDataHTML+='<label class="room">Space: '+roomname+'</label>';
				listDataHTML+='<label class="date">Added: '+getDateForTimestamp(instance.createdDate)+'</label>';
				listDataHTML+='</div>';
				if(!checkAllRooms && roomname == "No"){	
					if(!configData.unauthmode&&!isClientAppTokenValid&&configData.unauthmode!=undefined || application_id=="3"&&configData.unauthmode==undefined&&!isClientAppTokenValid){
						listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
						listDataHTML+='<span class="github-edit-loading"><p id="fakehide">&nbsp;</p></span>'
						listDataHTML+='</div>';	
					}else{
						listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
						listDataHTML+='<span class="edit-loading"><p id="fakehide">&nbsp;</p></span>'
						listDataHTML+='</div>';	
					}
				}else{ 
					if(!configData.unauthmode&&!isClientAppTokenValid&&configData.unauthmode!=undefined || application_id=="3"&&configData.unauthmode==undefined&&!isClientAppTokenValid){
						console.log("in list auth mode...");
						listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
						listDataHTML+='<span class="cross-mark remove-config" data-open="remove-integration-popup" id='+instance.instanceId+'></span>';
						listDataHTML+='<a class="github-edit-config" id='+instance.instanceId+'>Edit</a>';
						listDataHTML+='</div>';
					}else{
						console.log("in list unauth");
						listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
						listDataHTML+='<span class="cross-mark remove-config" data-open="remove-integration-popup" id='+instance.instanceId+'></span>';
						listDataHTML+='<a class="edit-config" id='+instance.instanceId+'>Edit</a>';
						listDataHTML+='</div>';
					}	
				}	
				listDataHTML+='</div>';	
			});
		
		$.each(listResultData, function(i, instance) {
		var configData=JSON.parse(instance.configJson);
		   $.each(noRoomNameList, function(id,obj){
		     if(instance.channelId==obj){
				listDataHTML+='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
				listDataHTML+='<div class="large-8 medium-8 columns integration-details">';
				listDataHTML+='<img src="'+integration_app_icon_url+'" alt="">';
				listDataHTML+='<label>'+configData.displayName+'</label>';
				if(!checkAllRooms )
				listDataHTML+='<label class="room"></label>';
				else 
				listDataHTML+='<label class="room"></label>';
				listDataHTML+='<label class="date">Added: '+getDateForTimestamp(instance.createdDate)+'</label>';
				listDataHTML+='</div>';
				if(!checkAllRooms ){	
					if(!configData.unauthmode&&!isClientAppTokenValid&&configData.unauthmode!=undefined || application_id=="3"&&configData.unauthmode==undefined&&!isClientAppTokenValid){
						listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
						listDataHTML+='<span class="github-edit-loading"><p id="fakehide">&nbsp;</p></span>'
						listDataHTML+='</div>';	
					}else{
						listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
						listDataHTML+='<span class="edit-loading"><p id="fakehide">&nbsp;</p></span>'
						listDataHTML+='</div>';	
					}	
				}else{ 
					if(!configData.unauthmode&&!isClientAppTokenValid&&configData.unauthmode!=undefined || application_id=="3"&&configData.unauthmode==undefined&&!isClientAppTokenValid){
						console.log("in list auth mode...");
						listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
						listDataHTML+='<span class="cross-mark remove-config" data-open="remove-integration-popup" id='+instance.instanceId+'></span>';
						listDataHTML+='<a class="github-edit-config" id='+instance.instanceId+'>Edit</a>';
						listDataHTML+='</div>';
					}else{
						console.log("in list unauth");
						listDataHTML+='<div class="large-2 medium-2 columns edit-remove-icons">';
						listDataHTML+='<span class="cross-mark remove-config" data-open="remove-integration-popup" id='+instance.instanceId+'></span>';
						listDataHTML+='<a class="edit-config" id='+instance.instanceId+'>Edit</a>';
						listDataHTML+='</div>';
					}
				}	
					listDataHTML+='</div>';	
			 }
		   });
		});
			
		}else{
			listDataHTML+='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
				listDataHTML+='<div class="no-config-msg">You have no configurations. Click Add to set up one.</div></div>';
		}
		$("#instance-list-block").html(listDataHTML);
		$(".github-edit-config").css("display","none");
		$(".github-edit-loading").css("display","none");
		if(isClientAppTokenValid == false&&application_id!="3"){ 
		 console.log("^^^^^^^^^");
			$(".edit-config").css("display","none");
		}
		/*if(listResultData.length<=1){ $("#remove-all-config").hide();}
		else { $("#remove-all-config").show();}*///remove all button functionality disabled temporary
	}
	function sortRooms(){
		allRooms = allRooms .sort((function (a, b) { return new Date(b.lastActivity) - new Date(a.lastActivity) }));
	}
	function getRoomsInfo(){
		$.ajax({
			url: configuration_settings_url+"?userId="+user_id,
			async: true,
			success: function(result){
				ui_settings=result;
				if(result["sparkRoomSettings"]!=undefined || result["sparkRoomSettings"]!=null)
				rooms =  result["sparkRoomSettings"]["items"];
				if(result["integrationSpecificSettings"]["isValidToken"]==false && result["integrationSpecificSettings"]["isValidToken"] != undefined){ isClientAppTokenValid = false;$('.client-app-warning').html(clientAppRevokeMsg);$('.client-app-warning').show();}
				else { isClientAppTokenValid = true;$('.client-app-warning').hide();}
				console.log(" isClientAppTokenValid in uisettings ***** "+isClientAppTokenValid);
				if(oauthRequired){
					getAuthUser();
				}
				roomsEventResponse =true;
				loadAllInstancesData();
			},
			 error: function(xmlHttpRequest,error) {
			   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
				   return;
			   } else{
					$('#instance-loading-block').hide();
					alert("We've experienced some difficulty. Try again.");
				}
			}
		});
	}
	function getAllSparkRooms(){
		$.ajax({
			url: getSparkRooms+"?userId="+user_id,
			async: true,
			success: function(result){
				rooms_list = result;
				if(result["sparkRoomSettings"]!=undefined || result["sparkRoomSettings"]!=null)
				allRooms = result["sparkRoomSettings"]["items"];
				console.log("**********Rooms Sorting Statred**********");
					var t0 = performance.now();
					sortRooms();
					var t1 = performance.now();
				console.log("**********Rooms Sorting Ending**********");
				console.log("Call to sortRooms() took " + (t1 - t0) + " milliseconds.");
				$(".rooms-loading").hide();
			},
			 error: function(xmlHttpRequest, error) {
			   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
				   return;
			   } else{
					$(".rooms-loading").hide();
				}
			}
		});
	}
	function loadRooms(){
		console.log("allRooms in loadRooms "+allRooms.length);
		var roomsTimer = setInterval(function(){
			if(rooms_list != ""){
				console.log('allRooms in if(rooms_list!="")  '+allRooms.length);
				clearInterval(roomsTimer);
				setUpRooms();
			}
		},100);
	}
	function setUpRooms(){
		if(allRooms.length !=0){
			$("#rooms").find("option:gt(0)").remove();
			//$('#rooms').customselect("destroy");
			$.each(allRooms, function(id,obj){
				$("#rooms").append($('<option>').text(obj.title).attr('value',obj.id));
			});
			$("#rooms").val(selected_room_id);
			$('.custom-select span').html($("#rooms option:selected").text());
			selected_room_id = 0;
		//	$("#rooms").customselect();
		}
	} 
	function getAllListInstances(){
		$.ajax({url: list_integration_instances_url+"?userId="+user_id+"&integrationId="+integration_id,
			async:true,
			success: function(result){
			 allInstances = result;
			 allInstancesResponse =true;
			 console.log("in list instances response");
			loadAllInstancesData();
			},	
			error: function(xmlHttpRequest,error) {
			   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
				   return;
			   }else{
					$("#integrations-block").show();
					resize();
					alert("We've experienced some difficulty. Try again.");
				}
			}
		});
	}
	function postAddMessageToRoom(roomId,appName){
		console.log("appName...." + appName);
		if(listResultData.length > 0){
			console.log("listResultData.length...in if....." + listResultData.length);
			$.each(listResultData,function(index,value){
				if(value["channelId"]==roomId) {
					postMessageToSpark = "";
					return false;
				}else{
					postMessageToSpark = appName+" added to this space";
				}				
			});
		}else{
			console.log("listResultData.length...in else....." + listResultData.length);
			postMessageToSpark = appName+" added to this space";
		}
	}
	function listIntegrations() {
		console.log("in list action...");
		$("#integrations-block").hide();
		$(".unauth").hide();
		$(".auth").hide();
		$(".github-add-config").hide();
		$("#integration-form").hide();
		$('.github-links').css('margin-left', '0px');
		resize();
		allInstancesResponse =false;
		getAllListInstances();
		if(rooms.length == 0){
			roomsEventResponse =false;
			getRoomsInfo();
		}
		if(allRooms.length == 0){
		  getAllSparkRooms();
		}
		listCheckAllRooms = false;
	
		$("#integrations-block").show(); 
		$(".home").hide();
		$('#instance-loading-block').show();
		$('.instances-loading-text').html("Loading your configurations");
	}	
	function loadAllInstancesData() {
	console.log("loadAllInstancesData....");
	if(allInstancesResponse && roomsEventResponse) {
		$("#integrations-block").show();
		listCheckAllRooms = false;
				if($.isArray(allInstances)){
					listInstancesData(allInstances ,false);					
				} else {
					listInstancesData([] ,false);
				}
				$('#instance-loading-block').hide();
				if(!isClientAppTokenValid)	$('.client-app-warning').show();
				$(".home").show();
				if(authenticationFlag){
					$(".unauth").show();
					$(".github-add-config-text").html('');
					$(".github-add-config-text").html('<p>Click add to create GitHub.com Configuration.</p>');
					$(".github-add-config").show();
				}else{
					$(".github-add-auth").hide();
					$(".note-on-permission").hide();
					$(".unauth-nonauth-link").hide();
					$(".auth").show();
					$(".github-add-config-text").html('');
					$(".github-add-config-text").html('<p>Click add to create GitHub Enterprise Configuration.</p>');
					$(".github-add-config").show();
				}
				if(!isClientAppTokenValid){
					$('.auth').hide();
					$('.client-app-warning').show();
					$('.unauth').show();
					$(".github-add-config-text").html('');
					$(".github-add-config-text").html('<p>Click add to authenticate your GitHub.com account with Cisco Spark.</p>');
					$(".github-add-config").show();
					//$('.unauth').show();
					//$(".github-add-config-text").html('');
					//$(".github-add-config-text").html('<p>Click add to create GitHub.com Configuration.</p>.');
				}
				resize();
		}
	}
	function loadListDataAgain(){
	    if(allRooms.length > 0 ) {
	      listInstancesData(allInstances ,true);	
       } else {
	   setTimeout(loadListDataAgain, 1000);
	   }	   
	}
	function validateClientAppToken() {
		$.ajax({
			url: configuration_settings_url+"?userId="+user_id,
			async: true,
			success: function(result){
				if(result["integrationSpecificSettings"]["isValidToken"]==false && result["integrationSpecificSettings"]["isValidToken"] != undefined){
					isClientAppTokenValid = false;
					$('.client-app-warning').html(clientAppRevokeMsg);
					console.log("isClientAppTokenValid ***** "+isClientAppTokenValid);
				}
				listIntegrations();
				if(isClientAppTokenValid== false){
					$('.edit-config').css("display","none");
				}
			},
			error: function(xmlHttpRequest,error) {
			   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
				   return;
			   } else{
				   alert("We've experienced some difficulty. Try again.");
				}
			}
		});
	}
	function validateIntegrationAppTokenDB() {		
		$.ajax({url: get_app_token_url+"?userId="+user_id,
			async:true,
			type: "get",
			success: function(result){
				if(result.tokenResult.tokenId) {
					appTokenExists=true;
					validateClientAppToken();
				}else if(appName == "Zendesk"){
					$("#protocol").html(protocol);
					$("#domainName").html(domain);
					$("#authenticate-block").show();
				}else {
					appTokenExists=false;
					var authReqMsg ="";
					authReqMsg+='<hr class="instance-hr"><div class="large-12 medium-12 columns instance-background">';
					authReqMsg+='<div class="no-config-msg">You are not authorized to this integration. Click Add to continue.</div></div>';
					$('#integrations-block').show();
					$("#instance-list-block").html(authReqMsg);
				}
			},
			error: function(xmlHttpRequest,error) {				
			   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
				   return;
			   }else{
					alert("We've experienced some difficulty. Try again.");
				}
			}
		});
	}
	$(document).on("click", "#done-button" , function() {
		$('#success-integration').foundation('close');
		$("#integration-form").hide();
		listIntegrations();
	});
	function removeIntegrationInstance(instanceId,removeRoomId) {
		var isRoomAvailable = 0;
		$.each(listResultData,function(index,value){
			if(value["channelId"]==removeRoomId) { 
				isRoomAvailable++;	
			}				
		});
		if(isRoomAvailable>1){
			removeMessageToSpark = "";
		}else{
			removeMessageToSpark = appName+" has been removed from this space";
		}
		$.ajax({url: delete_instance_url+instanceId+"?messageToSpark="+removeMessageToSpark,
			type:"DELETE",
			async:true,
			success: function(result){		
				listIntegrations();
			},
			error: function(xmlHttpRequest,error) {
			   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
				   return;
			   }else{
					alert("We've experienced some difficulty. Try again.");
				}
			}
		});
	}
	function removeAllIntegrationInstances(formAction) {
		console.log("removeAllIntegrationInstances called......"+formAction);
		console.log("Passing removeAll message : "+removeMessageToSpark);
		$.ajax({url: removeall_integration_instances_url+"?integrationId="+integration_id+"&userId="+user_id+"&messageToSpark="+removeMessageToSpark,
			type:"DELETE",
			async:true,
			success: function(result){		
				$(".home").hide();
				$("#remove-all-config").hide();
				if(formAction=="disconnect"){
					disconnectIntegrationApp();
				}
				resize();
			},
			error: function(xmlHttpRequest,error) {
			   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
				   return;
			   }else{
					alert("We've experienced some difficulty. Try again.");
				}
			}
		});		
	}
	function disconnectIntegrationApp() {
		var deleteSparkTokenResponse="";
		var deleteIntegrationTokenResponse="";
		$.ajax({url: delete_spark_token_url+"?userId="+user_id+"&integrationId="+integration_id,
			async:true,
			type:"DELETE",
			success: function(result){
				deleteSparkTokenResponse="success";
			},
			error: function(xmlHttpRequest,error) {
			   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
				   return;
			   }else{
					deleteSparkTokenResponse="failure";
				}
			}
		});			
		if(oauthRequired) {
			$.ajax({url: delete_integration_token_url+"?userId="+user_id+"&integrationId="+integration_id,
				async:true,
				type:"DELETE",
				success: function(result){
					deleteIntegrationTokenResponse="success";
				},
				error: function(xmlHttpRequest,error) {
				   if(xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
					   return;
				   }else{
						deleteIntegrationTokenResponse="failure";
					}
				}
			});
		} else {
			deleteIntegrationTokenResponse="success";
		}		
		var disconnectTimer = window.setInterval(function() { 
			if(deleteSparkTokenResponse!="" & deleteIntegrationTokenResponse!=""){
				window.clearInterval(disconnectTimer);
				if(deleteSparkTokenResponse=="success" & deleteIntegrationTokenResponse=="success") {
					disconnectIntegration();
					$("#integrations-block").html("Successfully disconnected your integration");
				} else {
					alert("We've experienced some difficulty. Try again.");
				}			
			}
        }, 100);
	}
	