var template_path = Qva.Remote + "?public=only&type=Document&name=Extensions/dropdownMenu/";
//Qva.LoadScript(template_path + 'packed.js', function () {
Qva.LoadScript(template_path + 'tinydropdown.js', function () {
    Qva.AddDocumentExtension('dropdownMenu', function(){
		//Load a CSS style sheet
		Qva.LoadCSS(template_path + "tinydropdown.css");
		var _this = this;
		
		var mydoc = Qv.GetCurrentDocument();
//		alert(_this.Element);
  
  /*
  		//add a unique name to the extension in order to prevent conflicts with other extensions.
		//basically, take the object ID and add it to a DIV
		var divName = _this.Layout.ObjectId.replace("\\", "_");
	alert("x2");		
		if(_this.Element.children.length == 0) {//if this div doesn't already exist, create a unique div with the divName
			var ui = document.createElement("div");
			ui.setAttribute("id", divName);
			_this.Element.appendChild(ui);
		} else {
			//if it does exist, empty the div so we can fill it again
			$("#" + divName).empty();
		}
	alert("x3");
 
		var vul=$("<ul id='menu' class='menu'></ul>").text("Text.");   // Create with jQuery
		$("#" + divName).append(vul);         // Append the new elements
*/		
/*
		mydoc.SetVariable("vVariable","something2");
  
		mydoc.GetAllVariables(function(vars) {
			$.each(vars, function() {
				if(this.name == "vBC") {
					alert(this.value);
				}
			});
		});		
	alert("x4");
*/	


            var paintNav = function(){
                var element = this.Element;
				
//				var tabrowElem = element.getElementsByTagName("ul")[0];
				//var tabelem = tabrowElem.getElementsByTagName("li");
                    
				
                //element.className = "mini-tabrow";
                if (this.Layout.visible) {

					var divMenu = document.getElementById("div_Menu");
					if (!divMenu) {
						var divMenu = document.createElement("div");
						divMenu.setAttribute("id", "div_Menu");
						element.appendChild(divMenu);
						divMenu.className = "nav";
					}
					
                    var mainMenuElem = element.getElementsByTagName("ul")[0];
                    if (!mainMenuElem) {
                        mainMenuElem = document.createElement("ul");
						mainMenuElem.setAttribute("id", "menu");
                        divMenu.appendChild(mainMenuElem);
                    }
					mainMenuElem.className = "menu";
                   
                    var tabdata = this.Layout.value;
                    var tabelem = mainMenuElem.getElementsByTagName("li");
					
                    var cnt = Math.max(tabdata.length, tabelem.length);
                    for (var i = 0; i < cnt; i++) {
                        if (!tabdata[i] && !tabelem[i]) 
                            continue;
						
						// get the content of the parameters, this is the text in between the characters % and %
						// 3 variables are filled here 
						// 		parentSheetID = QlikView object ID of the parent menu item
						// 		isMainMenuItem = true if no parentSheetID is provided, then the menu item will be added as a main menu item
						//		isLink = false if this menu item will not be click-able
						if(
							tabdata[i].text.indexOf("%") >= 1 &&
							tabdata[i].text.lastIndexOf("%") >= 3 &&
							tabdata[i].text.indexOf("%") != tabdata[i].text.lastIndexOf("%")								
							){
							// extract the set of parameters from the sheet title in a separate string
							var parameterSet = tabdata[i].text.substring(tabdata[i].text.indexOf("%")+1,tabdata[i].text.lastIndexOf("%")+1);
							var parameterSetUpper = parameterSet.toUpperCase();
							var sheetTitle = tabdata[i].text.substring(0,tabdata[i].text.indexOf("%"));
								
							// extract the parentsheetID from the set of parameters
							if(
								parameterSetUpper.indexOf("PARENTSHEETID=") != -1
								){
								var parentSheetIDFullStr = parameterSetUpper.substring(parameterSetUpper.indexOf("PARENTSHEETID=")+14,parameterSetUpper.length);
								var regExp = /\s|,|%/;
								// copy from the first character until the first occurrence of a space, comma or % sign
								var parentSheetID = parentSheetIDFullStr.substring(0,parentSheetIDFullStr.search(regExp));
								var isMainMenuItem = false;  
							}
							else {
								var parentSheetID = "";
								var isMainMenuItem = true;  
							}

								
							// extract the isLink parameter from the set of parameters
							if(
								parameterSetUpper.indexOf("ISLINK=FALSE") != -1
								){
								var isLink = false;  
							}
							else {
								var isLink = true;  
							}
								
						}
						else {
							var parentSheetID = "";
							var isMainMenuItem = true;  
							var isLink = true;
							var sheetTitle = tabdata[i].text;
						}							

                        if (!tabelem[i]) {
                            tabelem[i] = document.createElement("li");
							tabelem[i].setAttribute("id", tabdata[i].name);
							
							if(isMainMenuItem) {
								mainMenuElem.appendChild(tabelem[i]);
							} else{
								//tabelem[i].className = "submenu";
								var parentMenuElem = document.getElementById("Document\\"+parentSheetID);
								
								if (!parentMenuElem) {
									alert("error: a sheet with sheetID " + parentSheetID + " is unknown");
								} else{
									var subMenuElemUl = parentMenuElem.getElementsByTagName("ul")[0];
									if (!subMenuElemUl) {
										subMenuElemUl = document.createElement("ul");
										parentMenuElem.appendChild(subMenuElemUl);
									}
									subMenuElemUl.appendChild(tabelem[i]);
								}
							}
//                            tabelem[i].innerHTML = "<span>" + tabdata[i].text + "</span>";
                            tabelem[i].innerHTML = sheetTitle;
                        }
                        
                        if (!tabdata[i] || !tabdata[i].visible) {
                            tabelem[i].style.display = "none";
                            continue;
                        }
                        tabelem[i].style.display = "";
 /*                       
                        if (tabdata[i].selected === "true") {
                            tabelem[i].className = "mini-tab mini-selected";
                        }
                        else {
                            tabelem[i].className = "mini-tab";
                        }
*/						
                        tabelem[i].title = sheetTitle;
						
                        if (tabdata[i].action) {
                            tabelem[i].onclick = onclick_action;
                            tabelem[i].Action = this.Name + "." + tabdata[i].name;
                        }
						
                    }
					
					
                }
                else {
                    element.style.display = "none";
                }
            };

            _this.Document.SetTabrowPaint(paintNav);
			
			var dropdown=new TINY.dropdown.init("dropdown", {id:'menu', active:'menuhover'});

	});
});

