var dropdown;
var template_path = Qva.Remote + "?public=only&type=Document&name=Extensions/dropdownMenu/";
//Qva.LoadScript(template_path + 'packed.js', function () {
Qva.LoadScript(template_path + 'tinydropdown.js', function () {
    Qva.AddDocumentExtension('dropdownMenu', function(){
		//Load a CSS style sheet
		Qva.LoadCSS(template_path + "tinydropdown.css");
		
		var _this = this;
		
		var mydoc = Qv.GetCurrentDocument();
 
		function addEvent(obj, evType, fn) {
			if (obj.addEventListener) {
				obj.addEventListener(evType, fn, false);
				return true;
			} else if (obj.attachEvent) {
				var r = obj.attachEvent("on" + evType, fn);
				return r;
			} else {
				alert("Handler could not be attached");
			}
		}
 
        var paintNav = function(){
            var element = this.Element;
				
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
						tabelem[i].setAttribute("id", tabdata[i].name.replace("\\", "_"));
							
						if(isMainMenuItem) {
							mainMenuElem.appendChild(tabelem[i]);
						} else{
							var parentMenuElem = document.getElementById("Document_"+parentSheetID);
								
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

						if (isLink) {
							tabelem[i].innerHTML = '<a href="javascript:;">'+sheetTitle+'</a>';
						} else {
							tabelem[i].innerHTML = "<span>" +sheetTitle + "</span>";
						}
                        
                    }
                        
                    if (!tabdata[i] || !tabdata[i].visible) {
                        tabelem[i].style.display = "none";
                        continue;
                    }
                    tabelem[i].style.display = "";
                    if (tabdata[i].action && isLink) {
                        tabelem[i].onclick = onclick_action;
                        tabelem[i].Action = this.Name + "." + tabdata[i].name;
						
						// because menu elements are nested the onclick event from the parent menu is inherited automatically. 
						// Prevent execution of the onclick from the parent menu item here
						addEvent(tabelem[i], "click", function() {
                            if (!e) var e = window.event;
                            e.cancelBubble = true;
                            if (e.stopPropagation) e.stopPropagation();	
						});
                    }
                }
					
					
            }
            else {
                element.style.display = "none";
            }			
			dropdown=new TINY.dropdown.init("dropdown", {id:'menu', active:'menuhover'});				
        };

        _this.Document.SetTabrowPaint(paintNav);
			
		// overrule the standard QlikView tabrow style
		var tabrowDiv = document.getElementById("Tabrow");
		tabrowDiv.removeAttribute("class");
	});
});

