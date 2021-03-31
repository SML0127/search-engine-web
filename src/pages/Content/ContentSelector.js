/**
 * @param options.parentCSSSelector	Elements can be only selected within this element
 * @param options.allowedElements	Elements that can only be selected
 * @constructor
 */
ContentSelector = function(options) {

	// deferred response
	this.deferredCSSSelectorResponse = $.Deferred();

	this.allowedElements = options.allowedElements;
	//this.parentCSSSelector = options.parentCSSSelector.trim();
	//this.alert = options.alert || function(txt) {alert(txt);};

	//if(this.parentCSSSelector) {
	//	this.parent = $(this.parentCSSSelector)[0];

	//	//  handle situation when parent selector not found
	//	if(this.parent === undefined) {
	//		this.deferredCSSSelectorResponse.reject("parent selector not found");
	//		this.alert("Parent element not found!");
	//		return;
	//	}
	//}
	//else {
		this.parent = $("body")[0];
	//}
};

ContentSelector.prototype = {
  tempXpath: "",
  containsFlag: !1,
  indexes: [],
  matchIndex: [],
  selectedElementOtips: "",
  selectedOptRelXpath: "",
  selectedOptRelListXpath: "",
  selectedOptRelListXpath2: "",
  selectedElementOtipsList: [],
  currentEvent: "",
  g_document: "",
	/**
	 * get css selector selected by the user
	 */
	getCSSSelector: function(request) {

		if(this.deferredCSSSelectorResponse.state() !== "rejected") {

			this.selectedElements;
      this.resultXpath;
			this.top = 0;
			this.initGUI();
		}

		return this.deferredCSSSelectorResponse.promise();
	},

	getCSSSelectorURL: function(request) {

		if(this.deferredCSSSelectorResponse.state() !== "rejected") {

			this.selectedElements = [];
      this.resultXpath;
			this.top = 0;
			this.initGUIURL();
		}

		return this.deferredCSSSelectorResponse.promise();
	},

	getCurrentCSSSelector: function() {

		if(this.selectedElements && this.selectedElements.length > 0) {

			var cssSelector;

			// handle special case when parent is selected
			if(this.isParentSelected()) {
				if(this.selectedElements.length === 1) {
					cssSelector = '_parent_';
				}
				else if($("#-selector-toolbar [name=diferentElementSelection]").prop("checked")) {
					var selectedElements = this.selectedElements.clone();
					selectedElements.splice(selectedElements.indexOf(this.parent),1);
					cssSelector = '_parent_, '+this.cssSelector.getCssSelector(selectedElements, this.top);
				}
				else {
					// will trigger error where multiple selections are not allowed
					cssSelector = this.cssSelector.getCssSelector(this.selectedElements, this.top);
				}
			}
			else {
				cssSelector = this.cssSelector.getCssSelector(this.selectedElements, this.top);
			}

			return cssSelector;
		}
		return "";
	},

	isParentSelected: function() {
		return this.selectedElements.indexOf(this.parent) !== -1;
	},

	/**
	 * initialize or reconfigure css selector class
	 * @param allowMultipleSelectors
	 */
	initCssSelector: function(allowMultipleSelectors) {
		this.cssSelector = new CssSelector({
			enableSmartTableSelector: true,
			parent: this.parent,
			allowMultipleSelectors:allowMultipleSelectors,
			ignoredClasses: [
				"-sitemap-select-item-selected",
				"-sitemap-select-item-hover",
				"-sitemap-parent",
				"-web-scraper-img-on-top",
				"-web-scraper-selection-active"
			],
			query: jQuery
		});
	},

	previewSelector: function (elementCSSSelector) {

		if(this.deferredCSSSelectorResponse.state() !== "rejected") {

			this.highlightParent();
			$(ElementQuery(elementCSSSelector, this.parent)).addClass('-sitemap-select-item-selected');
			this.deferredCSSSelectorResponse.resolve();
		}

		return this.deferredCSSSelectorResponse.promise();
	},

  unbindOperationTipsGUI: function () {
    
    console.log('Hide OpeartionTips')
		//this.unbindElementSelection();
		//this.unbindElementHighlight();


		//$(this.$allElements).unbind("mouseover.elementSelector").unbind("mouseout.elementSelector");
    //$(".-sitemap-select-item-hover").removeClass('-sitemap-select-item-hover')
    this.unbindElementOperationTips();
		this.removeOperationTips();
  },

	initOperationTipsGUI: function () {
    console.log('init OpeartionTips GUI')
    this.selectedElementOtipsList = []

		//this.highlightParent();

		// all elements except toolbar
		this.$allElements = $(this.allowedElements+":not(#-selector-toolbar):not(#-selector-toolbar *)", this.parent);
		// allow selecting parent also
		if(this.parent !== document.body) {
			this.$allElements.push(this.parent);
		}

		this.unbindElementSelection();
		this.unbindElementHighlight();
		this.removeOperationTips();

    this.bindElementHighlightOtips() // mouseover
    this.bindElementOperationTips() // click
	  this.attachOperationTips()

	},



	//initOperationTipsListGUI: function () {

	//	this.$allElements = $(this.allowedElements+":not(#-selector-toolbar):not(#-selector-toolbar *)", this.parent);

	//	if(this.parent !== document.body) {
	//		this.$allElements.push(this.parent);
	//	}

	//	//this.unbindElementSelection();
	//	//this.unbindElementHighlight();
	//	//this.removeToolbar();


	//	this.bindElementHighlight();
	//	//this.bindElementHighlightURL();
	//	//this.bindElementSelectionURL();
	//
	//	this.attachToolbarURL();
	//},



	initGUIURL: function () {

		this.$allElements = $(this.allowedElements+":not(#-selector-toolbar):not(#-selector-toolbar *)", this.parent);

		if(this.parent !== document.body) {
			this.$allElements.push(this.parent);
		}

		this.unbindElementSelection();
		this.unbindElementHighlight();
		this.removeToolbar();


		this.bindElementHighlight();
		this.bindElementHighlightURL();
		this.bindElementSelectionURL();
	
		this.attachToolbarURL();
	},



	initGUI: function () {
    console.log('init GUI')

		//this.highlightParent();

		// all elements except toolbar
		this.$allElements = $(this.allowedElements+":not(#-selector-toolbar):not(#-selector-toolbar *)", this.parent);
		// allow selecting parent also
		if(this.parent !== document.body) {
			this.$allElements.push(this.parent);
		}

		this.unbindElementSelection();
		this.unbindElementHighlight();
		this.removeToolbar();
    
    this.bindElementHighlight()
		this.bindElementSelection();
	  this.attachToolbar()

	},


  getListXpathNew: function(x1, x2){
    let output1 = x1.split('//')
    let output2 = x2.split('//')
    
    let output1_len = output1.length - 1
    let output2_len = output2.length - 1
    let output_idx = 1
    let sub_output_idx = 0
    let is_finished = false 
    for (let idx_outer in output1) {
        if (output1 == output2){
           break;
        }

        sub_output1 = output1[output1_len - idx_outer].split('/')
        try {
          sub_output2 = output2[output2_len - idx_outer].split('/')
        } catch (error) {
          sub_output_idx = 0
          output_idx = output1_len - idx_outer
          break;
        }


        let sub_output1_len = sub_output1.length
        let sub_output2_len = sub_output2.length
    
        for (let idx in sub_output1) {
            if (sub_output1[sub_output1_len - idx - 1] != sub_output2[sub_output2_len - idx -1]) {
                sub_output_idx = sub_output1_len - idx - 1
                output_idx = output1_len - idx_outer 
                is_finished = true
                break;
            }
        }
        if (is_finished){
          break;
        }
    }
    let fin = ''
         
    sub_output1 = output1[output_idx].split('/')
    sub_output2 = output2[output_idx].split('/')
    sub_output1[sub_output_idx] = sub_output1[sub_output_idx].split('[')[0]
    
    for (let idx in output1) {
        if (idx == 0) {
           continue;
        }
        if(idx == output_idx){
           
           for(let idx2 in sub_output1){
              if (idx == 1 && idx2 == 0){
                 //fin = fin + '//' + sub_output1[idx2]
              }
              else{
                 if(sub_output_idx <= idx2){
                   fin = fin + '/' + sub_output1[idx2]
                 }
              }
           }
        }
        else  if(idx >= output_idx){
           fin = fin + '//' + output1[idx]
        }   
    
    }
    return fin
  },



  getListXpath: function(x1, x2){

     let output1 = x1.split('//')
     let output2 = x2.split('//')

     let output1_len = output1.length - 1
     let output_idx

     for(let idx in output1){
       if(output1[output1_len - idx] != output2[output1_len - idx]){
         output = output1[output1_len - idx]
         console.log(output1_len)
         console.log(output)
         output = output.split('[')[0]
         output_idx = output1_len - idx
       }
     }
     //listXPath1 =  //div[1]/div[1]/table[1]/tbody[1]/tr[2]/td[1]
     //listXPath2 =  //div[1]/div[1]/table[1]/tbody[1]/tr[1]/td[1]

     let fin = ''
     for(let idx in output1){
       if(idx == 0){
         continue;
       }
       if(idx == output_idx){
         fin = fin + '//' + output
       }
       else{
         fin = fin + '//' + output1[idx]
       }
     }
     return fin
  },



	bindElementSelectionOtipsList: function (is_link = false) {

    console.log('bindElementSelectionOtipsList')
		this.$allElements.bind("click.elementSelector", function (e) {
			var element = e.currentTarget;
      console.log(e)
      this.currentEvent = e
       
      console.log(element)
      console.log(element.className)
      //if(element.className){
      //  return false
      //}

      let num_selected = this.selectedElementOtipsList.length
      if(num_selected >= 1){
        if(this.selectedElementOtipsList[0] == e.currentTarget){

        }
        else{
          this.selectedElementOtipsList.push(element)
        }
      }
      else if(num_selected == 0){
        this.selectedElementOtipsList.push(element)
      }
      num_selected = this.selectedElementOtipsList.length
     
      if(num_selected >= 2){
        let elem1 = this.selectedElementOtipsList[num_selected - 1]
        let elem2 = this.selectedElementOtipsList[num_selected - 2]
			  $(elem1).removeClass("-sitemap-select-item-hover");
			  $(elem1).removeClass('-sitemap-select-item-selected');
			  $(elem2).removeClass("-sitemap-select-item-hover");
			  $(elem2).removeClass('-sitemap-select-item-selected');
        var optRelXpath1 = this.generateRelXpath(elem1);
        console.log("optRelXPath = ", optRelXpath1)
        var absXpath1 = this.generateAbsXpath(elem1);
        console.log("absXPath = ", absXpath1)
        var listXpath1 = this.generateListXpath(absXpath1)
        console.log("listXPath = ", listXpath1)

        var optRelXpath2 = this.generateRelXpath(elem2);
        console.log("optRelXPath = ", optRelXpath2)
        var absXpath2 = this.generateAbsXpath(elem2);
        console.log("absXPath = ", absXpath2)
        var listXpath2 = this.generateListXpath(absXpath2)
        console.log("listXPath = ", listXpath2)

        this.resultXpath = optRelXpath1;

        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
        let suffixListXpath = this.getListXpathNew(optRelXpath1, optRelXpath2)
        console.log(suffixListXpath)
        
        let x1 = absXpath1
        let x2 = absXpath2


        let output3 = x1.split('/')
        let output4 = x2.split('/')
        let output3_len = output3.length
        let output3_idx
        
        for (let idx in output3) {
            if (output3[idx] != output4[idx]) {
                output3_idx = idx
                break;
            }
        }
        
        let fin2 = ''
        for (let idx in output3) {
            if (idx == 0) {
                continue;
            }
            if (parseInt(idx) < parseInt(output3_idx)) {
                fin2 = fin2 + '/' + output3[idx]
            } else {
                break;
                //fin = fin + '/' + output1[idx]
            }
        }
        let finalXpath
        if (suffixListXpath.slice(0,2) == '//'){
          finalXpath = fin2 + suffixListXpath
        }
        else{
          finalXpath = fin2 + '/' + suffixListXpath
        }

        let res = document.evaluate(finalXpath, document);
        let tmpElements = [];
        let node
        while(node = res.iterateNext()) {
          tmpElements.push(node)
        }
        let limit_num = tmpElements.length

        if(is_link){
          let idx1 = finalXpath.lastIndexOf('//')
          let idx2 = finalXpath.lastIndexOf('[')
          let last_tag = finalXpath.slice(idx1+2, idx2)
          if(last_tag == 'a'){
            //console.log(finalXpath)
			      this.highlightSelectedElementsOtipsURL(finalXpath);
            this.openCollapse5()
            this.selectedOptRelListXpath = finalXpath
            console.log(finalXpath)
            console.log(this.selectedOptRelListXpath)
			      return false;
          }
          else{
            let candidate1 = finalXpath.slice(0, idx1+2) + 'a'

            //console.log(candidate1)
            let res1 = document.evaluate(candidate1, document);
            let tmpElements1 = [];
            let node1
            while(node1 = res1.iterateNext()) {
              tmpElements1.push(node)
            }
            let candidate_limit_num = tmpElements1.length
            //console.log(candidate_limit_num, limit_num)
            if(parseInt(candidate_limit_num) <= parseInt(limit_num) && parseInt(candidate_limit_num) != 0 ){
              finalXpath = candidate1
              //console.log(finalXpath)
			        this.highlightSelectedElementsOtipsURL(finalXpath);
              this.selectedElementOtipsList = []
              this.openCollapse5()
              this.selectedOptRelListXpath = finalXpath
              console.log(finalXpath)
              console.log(this.selectedOptRelListXpath)
			        return false;
            }
            else{
              let candidate2 = finalXpath + '//a'
              //console.log(candidate2)

              let res2 = document.evaluate(candidate2, document);
              let tmpElements2 = [];
              let node2
              while(node2 = res2.iterateNext()) {
                tmpElements2.push(node)
              }
              let candidate_limit_num2 = tmpElements2.length
              //console.log(candidate_limit_num2)
              if(parseInt(candidate_limit_num2) <= parseInt(limit_num) && parseInt(candidate_limit_num2) != 0 ){
                finalXpath = candidate2
                console.log(finalXpath)
			          this.highlightSelectedElementsOtipsURL(finalXpath);
                this.selectedElementOtipsList = []
                this.openCollapse5()
                this.selectedOptRelListXpath = finalXpath
                console.log(finalXpath)
                console.log(this.selectedOptRelListXpath)
			          return false;
              }
            }

			      this.highlightSelectedElementsOtipsURL(finalXpath);
            this.selectedElementOtipsList = []
            this.openCollapse5()
            this.selectedOptRelListXpath = finalXpath
            console.log(finalXpath)
            console.log(this.selectedOptRelListXpath)
		        
			      return false;
          }
        }
        else{
			    this.highlightSelectedElementsOtipsURL(finalXpath);
          this.selectedElementOtipsList = []
          this.openCollapse5()
          this.selectedOptRelListXpath = finalXpath
			    return false;
        }

        
      }
			// Cancel all other events
			return false;
		}.bind(this));
	},

  bindElementSelectionOtipsListClickTwo: function (is_link = false) {

    console.log('bindElementSelectionOtipsListClickTwo')
		this.$allElements.bind("click.elementSelector", function (e) {
			var element = e.currentTarget;
      this.currentEvent = e
     
      $(".-sitemap-select-item-selected").removeClass("-sitemap-select-item-selected");
      $(element).addClass('-sitemap-select-item-selected');

      let num_selected = this.selectedElementOtipsList.length
      console.log(num_selected) 
      console.log(this.selectedElementOtipsList) 

      if(num_selected >= 1){
        if(this.selectedElementOtipsList[0] == e.currentTarget){

        }
        else{
          this.selectedElementOtipsList.push(element)
        }
      }
      else if(num_selected == 0){
        this.selectedElementOtipsList.push(element)
      }
      num_selected = this.selectedElementOtipsList.length
      console.log(num_selected) 
      console.log(this.selectedElementOtipsList) 
     
      if(num_selected >= 2){
        let elem1 = this.selectedElementOtipsList[num_selected - 1]
        let elem2 = this.selectedElementOtipsList[num_selected - 2]
			  $(elem1).removeClass("-sitemap-select-item-hover");
			  $(elem1).removeClass('-sitemap-select-item-selected');
			  $(elem2).removeClass("-sitemap-select-item-hover");
			  $(elem2).removeClass('-sitemap-select-item-selected');
        var optRelXpath1 = this.generateRelXpath(elem1);
        //console.log("optRelXPath = ", optRelXpath1)
        var absXpath1 = this.generateAbsXpath(elem1);
        //console.log("absXPath = ", absXpath1)
        var listXpath1 = this.generateListXpath(absXpath1)
        //console.log("listXPath = ", listXpath1)

        var optRelXpath2 = this.generateRelXpath(elem2);
        //console.log("optRelXPath = ", optRelXpath2)
        var absXpath2 = this.generateAbsXpath(elem2);
        //console.log("absXPath = ", absXpath2)
        var listXpath2 = this.generateListXpath(absXpath2)
        //console.log("listXPath = ", listXpath2)

        this.resultXpath = optRelXpath1;

        let suffixListXpath = this.getListXpathNew(optRelXpath1, optRelXpath2)
        console.log(suffixListXpath)


        let x1 = absXpath1
        let x2 = absXpath2


        let output3 = x1.split('/')
        let output4 = x2.split('/')
        let output3_len = output3.length
        let output3_idx
        
        for (let idx in output3) {
            if (output3[idx] != output4[idx]) {
                output3_idx = idx
                break;
            }
        }
        
        let fin2 = ''
        for (let idx in output3) {
            if (idx == 0) {
                continue;
            }
            if (parseInt(idx) < parseInt(output3_idx)) {
                fin2 = fin2 + '/' + output3[idx]
            } else {
                break;
                //fin = fin + '/' + output1[idx]
            }
        }
        let finalXpath
        if (suffixListXpath.slice(0,2) == '//'){
          finalXpath = fin2 + suffixListXpath
        }
        else{
          finalXpath = fin2 + '/' + suffixListXpath
        }

        let res = document.evaluate(finalXpath, document);
        let tmpElements = [];
        let node
        while(node = res.iterateNext()) {
          tmpElements.push(node)
        }
        let limit_num = tmpElements.length

        let idx1 = finalXpath.lastIndexOf('//')
        let idx2 = finalXpath.lastIndexOf('[')
        let last_tag = finalXpath.slice(idx1+2, idx2)
        if (is_link){
          if(last_tag == 'a'){
            //console.log(finalXpath)
			      this.highlightSelectedElementsOtipsURL(finalXpath);
            this.openCollapse5()
            this.selectedOptRelListXpath2 = finalXpath
			      return false;
          }
          else{
            let candidate1 = finalXpath.slice(0, idx1+2) + 'a'

            //console.log(candidate1)
            let res1 = document.evaluate(candidate1, document);
            let tmpElements1 = [];
            let node1
            while(node1 = res1.iterateNext()) {
              tmpElements1.push(node)
            }
            let candidate_limit_num = tmpElements1.length
            //console.log(candidate_limit_num, limit_num)
            if(parseInt(candidate_limit_num) <= parseInt(limit_num) && parseInt(candidate_limit_num) != 0 ){
              finalXpath = candidate1
              //console.log(finalXpath)
			        this.highlightSelectedElementsOtipsURL(finalXpath);
              this.selectedElementOtipsList = []
              this.openCollapse5()
              this.selectedOptRelListXpath2 = finalXpath
			        return false;
            }
            else{
              let candidate2 = finalXpath + '//a'
              //console.log(candidate2)

              let res2 = document.evaluate(candidate2, document);
              let tmpElements2 = [];
              let node2
              while(node2 = res2.iterateNext()) {
                tmpElements2.push(node)
              }
              let candidate_limit_num2 = tmpElements2.length
              //console.log(candidate_limit_num2)
              if(parseInt(candidate_limit_num2) <= parseInt(limit_num) && parseInt(candidate_limit_num2) != 0 ){
                finalXpath = candidate2
                console.log(finalXpath)
			          this.highlightSelectedElementsOtipsURL(finalXpath);
                this.selectedElementOtipsList = []
                this.openCollapse5()
                this.selectedOptRelListXpath2 = finalXpath
			          return false;
              }
            }

			      this.highlightSelectedElementsOtipsURL(finalXpath);
            this.selectedElementOtipsList = []
            this.openCollapse5()
            this.selectedOptRelListXpath2 = finalXpath
			      return false;
          }
        }
        else{
			    this.highlightSelectedElementsOtipsURL(finalXpath);
          this.selectedElementOtipsList = []
          this.openCollapse5()
          this.selectedOptRelListXpath2 = finalXpath
			    return false;
        }
      }


			// Cancel all other events
			return false;
		}.bind(this));
	},



	bindElementSelectionURL: function () {

    if(this.selectedElements.length >=2){
      this.selectedElements = []
		  $(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');
    }
		this.$allElements.bind("click.elementSelector", function (e) {
			var element = e.currentTarget;
      //let elementsOfXPath = document.evaluate(optListXpath,document);
      this.selectedElements.push(element)
      let num_selected = this.selectedElements.length
      console.log(this.selectedElements)
      console.log(num_selected)
      if(num_selected >= 2){
        let elem1 = this.selectedElements[num_selected - 1]
        let elem2 = this.selectedElements[num_selected - 2]
			  $(elem1).removeClass("-sitemap-select-item-hover");
			  $(elem1).removeClass('-sitemap-select-item-selected');
			  $(elem2).removeClass("-sitemap-select-item-hover");
			  $(elem2).removeClass('-sitemap-select-item-selected');
        var optRelXpath1 = this.generateRelXpath(elem1);
        console.log("optRelXPath = ", optRelXpath1)
        var absXpath1 = this.generateAbsXpath(elem1);
        console.log("absXPath = ", absXpath1)
        var listXpath1 = this.generateListXpath(absXpath1)
        console.log("listXPath = ", listXpath1)

        var optRelXpath2 = this.generateRelXpath(elem2);
        console.log("optRelXPath = ", optRelXpath2)
        var absXpath2 = this.generateAbsXpath(elem2);
        console.log("absXPath = ", absXpath2)
        var listXpath2 = this.generateListXpath(absXpath2)
        console.log("listXPath = ", listXpath2)

        this.resultXpath = optRelXpath1;


        let suffixListXpath = this.getListXpath(listXpath1, listXpath2)
        console.log(suffixListXpath)
        let x1 = absXpath1
        let x2 = absXpath2

        let output1 = x1.split('/')
        let output2 = x2.split('/')

        let output1_len = output1.length
        let output_idx

        for(let idx in output1){
          if(output1[idx] != output2[idx]){
            output_idx = idx
            break;
          }
        }

        let fin = ''
        for(let idx in output1){
          if(idx == 0){
            continue;
          }
          if(parseInt(idx) < parseInt(output_idx)){
            fin = fin + '/' + output1[idx]
          }
          else{
            break;
            //fin = fin + '/' + output1[idx]
          }
        }
        let finalXpath = fin + suffixListXpath



        let res = document.evaluate(finalXpath, document);
        let tmpElements = [];
        let node
        while(node = res.iterateNext()) {
          tmpElements.push(node)
        }
        let limit_num = tmpElements.length

        let idx1 = finalXpath.lastIndexOf('//')
        let idx2 = finalXpath.lastIndexOf('[')
        let last_tag = finalXpath.slice(idx1+2, idx2)
        if(last_tag == 'a'){
          console.log(finalXpath)
			    this.highlightSelectedElementsURL(finalXpath);
			    return false;
        }
        else{
          let candidate1 = finalXpath.slice(0, idx1+2) + 'a'

          console.log(candidate1)
          let res1 = document.evaluate(candidate1, document);
          let tmpElements1 = [];
          let node1
          while(node1 = res1.iterateNext()) {
            tmpElements1.push(node)
          }
          let candidate_limit_num = tmpElements1.length
          console.log(candidate_limit_num, limit_num)
          if(parseInt(candidate_limit_num) <= parseInt(limit_num) && parseInt(candidate_limit_num) != 0 ){
            finalXpath = candidate1
            console.log(finalXpath)
			      this.highlightSelectedElementsURL(finalXpath);
			      return false;
          }
          else{
            let candidate2 = finalXpath + '//a'
            console.log(candidate2)

            let res2 = document.evaluate(candidate2, document);
            let tmpElements2 = [];
            let node2
            while(node2 = res2.iterateNext()) {
              tmpElements2.push(node)
            }
            let candidate_limit_num2 = tmpElements2.length
            console.log(candidate_limit_num2)
            if(parseInt(candidate_limit_num2) <= parseInt(limit_num) && parseInt(candidate_limit_num2) != 0 ){
              finalXpath = candidate2
              console.log(finalXpath)
			        this.highlightSelectedElementsURL(finalXpath);
			        return false;
            }
          }

			    this.highlightSelectedElementsURL(finalXpath);
			    return false;
        }
      }


			// Cancel all other events
			return false;
		}.bind(this));
	},




	bindElementOperationTips: function () {

		this.$allElements.bind("click.elementSelector", function (e) {

			var element = e.currentTarget;
      var tag_name = e.currentTarget.nodeName
      var class_name = e.currentTarget.className
      var txt = e.currentTarget.innerText
      var tag_id = e.currentTarget.id
      
      console.log(tag_name)
      console.log(class_name)
      console.log(txt)
      $(".-sitemap-select-item-selected").removeClass("-sitemap-select-item-selected");
      $(element).removeClass("-sitemap-select-item-hover");
      $(element).removeClass("-sitemap-select-item-selected");
      if( (tag_name == 'DIV' && txt == 'Cancel') || (tag_name == 'UL' && class_name == 'list-group')){
        console.log('????????')
        return false
      }
      console.log(e)
      this.currentEvent = e
      this.g_document = document
      this.selectedElementOtips = element

      var cand1 = this.generateRelXpath(element);
      console.log("cand1 = ", cand1)
      if (cand1.indexOf('text()') !== -1){
        var absXpath = this.generateAbsXpath(element);
        this.selectedOptRelXpath = this.generateListXpath(absXpath)
      }
      else{
        this.selectedOptRelXpath = cand1
      }
      console.log("optRelXPath = ", this.selectedOptRelXpath)
      //$(".-sitemap-select-item-selected").removeClass("-sitemap-select-item-selected");
      
     
      //console.log('111111111111')
      //console.log(tag_name)
      //console.log(txt)
      //console.log(tag_id)
      if((tag_name == 'INPUT' && !class_name.includes('button') && !tag_id.includes("submit"))|| tag_name == 'TEXTAREA'){
        console.log('22222222222')
        console.log(this.currentEvent.currentTarget.value)
        document.getElementById('input_txt_box').value = this.currentEvent.currentTarget.value
        //document.getElementsByClassName(this.currentEvent.currentTarget.className)[0].value
		    $("#collapse1").removeClass('in')
		    $("#collapse2").removeClass('in')
		    $("#collapse3").addClass('in')
		    $("#collapse4").removeClass('in')
		    $("#collapse5").removeClass('in')
		    $("#collapse6").removeClass('in')
      }
      else if(tag_name == 'DIV' && txt == 'Cancel'){
        console.log('33333333')
        //console.log('????????/')
      }
      else{
        console.log('444444')
		    $("#collapse1").removeClass('in')
		    $("#collapse2").addClass('in')
		    $("#collapse3").removeClass('in')
		    $("#collapse4").removeClass('in')
		    $("#collapse5").removeClass('in')
		    $("#collapse6").removeClass('in')
      }


			// Cancel all other events
      $(element).addClass('-sitemap-select-item-selected');
			return false;
		}.bind(this));
	},




	unbindElementOperationTips: function () {
    console.log('unbindElementOperationTips')
		// all elements except toolbar
		this.$allElements = $(this.allowedElements+":not(#-selector-toolbar):not(#-selector-toolbar *)", this.parent);
		// allow selecting parent also
		if(this.parent !== document.body) {
			this.$allElements.push(this.parent);
		}

    $(".-sitemap-select-item-hover").removeClass('-sitemap-select-item-hover')
    $(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected')

		$(this.$allElements).unbind("click.elementSelector")
		$(this.$allElements).unbind("mouseover.elementSelector")
	},






	bindElementSelection: function () {

		this.$allElements.bind("click.elementSelector", function (e) {
			var element = e.currentTarget;
			$(element).removeClass("-sitemap-select-item-hover");
			//$(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');
			$(element).removeClass('-sitemap-select-item-selected');
      console.log(element)
      var optRelXpath = this.generateRelXpath(element);
      console.log("optRelXPath = ")
      console.log(optRelXpath)
      var absXpath = this.generateAbsXpath(element);
      console.log("absXPath = ")
      console.log(absXpath)
      var listXpath = this.generateListXpath(absXpath)
      console.log("listXPath = ")
      console.log(listXpath)
      let optListXpath
      if(element.id != ''){
        optListXpath = listXpath.slice(0,-2) + "@id='" + element.id + "']"
        console.log(optListXpath)
      }
      else if(element.className != ''){
        optListXpath = listXpath.slice(0,-2) + "@class='" + element.className + "']"
        console.log(optListXpath)
      }
      else{
        optListXpath = listXpath;
        console.log(optListXpath)
      }
      this.resultXpath = optRelXpath;
      //for highlight list
      //let elementsOfXPath = document.evaluate(optListXpath,document);
      //let selectedListElements = [];
      //let node
      //while(node = elementsOfXPath .iterateNext()) {
      //  selectedListElements.push(node)
      //}
      ////console.log(selectedListElements)
      //for (let i = 0; i < selectedListElements.length; i++) {
      //  $(selectedListElements[i]).addClass('-sitemap-select-item-selected');
      //}

			this.selectedElements = element;
			this.highlightSelectedElements(optRelXpath);

			// Cancel all other events
			return false;
		}.bind(this));
	},

  generateListXpath: function(xpath){
    let xpathDiv = xpath.split("/");
    let leng = xpathDiv.length;
    let topADEdgeIndex = 1;
    let prevTopADEdgeIndex = 0;
    let xpathPrefix = "//";
    let i = 0;
    let lastCandidate = ""
    while(topADEdgeIndex <= leng -1){
      let candidate = ""
      for (i = leng -1 ; i > topADEdgeIndex; i--){
        let res;
        if(xpathPrefix != '//'){
          candidate = xpathDiv[i] + candidate;
          res = document.evaluate(xpathPrefix +'//'+ candidate, document);//Can't find elements in iframe 
        }
        else{
          candidate = xpathDiv[i] +candidate;
          res = document.evaluate(xpathPrefix + candidate, document);//Can't find elements in iframe 
        }
        let cnt = 0;
        let elem;
        while(elem = res.iterateNext()) {
          cnt++;
        }
        if(cnt == 1){
          topADEdgeIndex = i;
          if(xpathPrefix == '//'){
            xpathPrefix = xpathPrefix + xpathDiv[i]; 
          }
          else{
            xpathPrefix = xpathPrefix +'//'+ xpathDiv[i]; 
          }
          break;
        }
        else{
          candidate = '/' + candidate
        }
      }
      if(topADEdgeIndex == i){
        if(prevTopADEdgeIndex == topADEdgeIndex){
          xpathPrefix = '/' + candidate
          prevTopADEdgeIndex = topADEdgeIndex
          return xpathPrefix;
          break;
        }
        else{
          prevTopADEdgeIndex = topADEdgeIndex
          //console.log(topADEdgeIndex)
        }
      }
      if(i == leng -1 ){
        break;
      }
    }
    //console.log('end')
    //console.log(xpathPrefix);
    //console.log(xpathPrefix + '//' + lastCandidate) 
    return xpathPrefix; 
  },


  optimizeXpath: function(_document, xpath) {
    let xpathDiv = xpath.split("//");
    let leng = xpathDiv.length;
    var regBarces = /[^[\]]+(?=])/g;
    let bracesContentArr = xpath.match(regBarces);
    let startOptimizingFromHere = 1;
    for (let j = bracesContentArr.length - 1; j > 0; j--) {
        startOptimizingFromHere++;
        if (bracesContentArr[j].length > 3) {
            startOptimizingFromHere = startOptimizingFromHere;
            break
        }
    }
    let tempXpath = xpath.split("//" + xpathDiv[leng - startOptimizingFromHere])[1];
    let totalMatch = 0;
    try {
        totalMatch = _document.evaluate(tempXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength
    } catch (err) {
        return xpath
    }
    if (totalMatch === 1) {
        return tempXpath
    }
    for (let i = leng - startOptimizingFromHere; i > 0; i--) {
        let temp = xpath.replace("//" + xpathDiv[i], "");
        try {
            totalMatch = _document.evaluate(temp, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
            if (totalMatch === 1) {
                xpath = temp
            }
        } catch (err) {
            return xpath
        }
    }
    return xpath
  },

  generateAbsXpath: function(element) {
    if (element.tagName.toLowerCase().includes("style") || element.tagName.toLowerCase().includes("script")) {
        return "This is " + element.tagName.toLowerCase() + " tag. For " + element.tagName.toLowerCase() + " tag, no need to write selector. :P"
    }
    if (element.tagName.toLowerCase() === 'html')
        return '/html[1]';
    if (element.tagName.toLowerCase() === 'body')
        return '/html[1]/body[1]';
    var ix = 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element) {
            if (element.tagName.toLowerCase().includes('svg')) {
                var absXpath = this.generateAbsXpath(element.parentNode) + '/' + '*';
                return absXpath
            } else {
                var absXpath = this.generateAbsXpath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
                if (absXpath.includes("/*/")) {
                    absXpath = "It might be child of iframe & it is not supported currently."
                }
                return absXpath
            }
        }
        if (sibling.nodeType === 1 && sibling.tagName.toLowerCase() === element.tagName.toLowerCase()) {
            ix++
        }
    }
  },


  generateRelXpath: function(element) {
    _document = element.ownerDocument;
    this.tempXpath = "";
    this.indexes = [];
    this.matchIndex = [];
    relXpath = this.formRelXpath(_document, element);
    console.log(relXpath)

    let doubleForwardSlash = /\/\/+/g;
    let numOfDoubleForwardSlash = 0;
    try {
        numOfDoubleForwardSlash = relXpath.match(doubleForwardSlash).length
    } catch (err) {}
    if (numOfDoubleForwardSlash > 1 && relXpath.includes('[') && !relXpath.includes('@href') && !relXpath.includes('@src')) {
        relXpath = this.optimizeXpath(_document, relXpath)
        console.log('optimize : ', relXpath)
    }
    if (relXpath === undefined) {
        relXpath = "It might be child of svg/pseudo/comment/iframe from different src. XPath doesn't support for them."
    }
    return relXpath
  },
  
  removeLineBreak: function(value) {
    if (value) {
        value = value.split('\n')[0].length > 0 ? value.split('\n')[0] : value.split('\n')[1]
    }
    return value
  },

  formRelXpath: function(_document, element) {
    var userAttr = "";//userAttrName.value.trim();
    var idChecked = "withid";//idCheckbox.checked ? "withid" : "withoutid";
    var classChecked = "withclass";//classAttr.checked ? "withclass" : "withoutclass";
    var nameChecked = "withname";//nameAttr.checked ? "withname" : "withoutname";
    var placeholderChecked = "withplaceholder";//placeholderAttr.checked ? "withplaceholder" : "withoutplaceholder";
    var textChecked = "withouttext";//placeholderAttr.checked ? "withplaceholder" : "withoutplaceholder";
    var attributeChoicesForXpath = [userAttr, idChecked, classChecked, nameChecked, placeholderChecked, textChecked]
    var userAttr = attributeChoicesForXpath[0];

    //smlee
    //var innerText = [].reduce.call(element.childNodes, function(a, b) {
    //    //return a + (b.nodeType === 3 ? b.textContent : '')
    //    return a + ''
    //}, '').trim().slice(0, 50);
    //innerText = this.removeLineBreak(innerText);
    
   
    var tagName = element.tagName.toLowerCase();
    if (tagName.includes("style") || tagName.includes("script")) {
        return "This is " + tagName + " tag. For " + tagName + " tag, no need to write selector. :P"
    }
    if (tagName.includes('svg')) {
        tagName = "*"
    }

    //smlee
    //if (innerText.includes("'")) {
    //    innerText = innerText.split('  ')[innerText.split('  ').length - 1];
    //    containsText = '[contains(text(),"' + innerText + '")]';
    //    equalsText = '[text()="' + innerText + '"]'
    //} else {
    //    innerText = innerText.split('  ')[innerText.split('  ').length - 1];
    //    containsText = "[contains(text(),'" + innerText + "')]";
    //    equalsText = "[text()='" + innerText + "']"
    //}
    //smlee
    var innerText = "";


    if (tagName.includes('html')) {
        return '//html' + this.tempXpath
    }
    var attr = "";
    var attrValue = "";
    var listOfAttr = {};
    //smlee
    //if ((!element.getAttribute(userAttr) || userAttr.toLowerCase() === "id") && element.id !== '' && attributeChoicesForXpath.includes("withid")) {
    if ( element.id !== '') {
        var id = element.id;
        id = this.removeLineBreak(id);
        this.tempXpath = '//' + tagName + "[@id='" + id + "']" + this.tempXpath;
        var totalMatch = _document.evaluate(this.tempXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
        if (totalMatch === 1) {
            console.log(this.tempXpath)
            return this.tempXpath
        } 
        else {
            //smlee
            // empty string like '', "" is false
            if (innerText && element.getElementsByTagName('*').length === 0) {
                console.log('never 1115')
                var containsXpath = '//' + tagName + containsText;
                var totalMatch = _document.evaluate(containsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                if (totalMatch === 0) {
                    var equalsXpath = '//' + tagName + equalsText;
                    var totalMatch = _document.evaluate(equalsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                    if (totalMatch === 1) {
                        return equalsXpath
                    } else {
                        this.tempXpath = this.tempXpath
                    }
                } else if (totalMatch === 1) {
                    return containsXpath
                } else {
                    this.tempXpath = this.tempXpath
                }
            } 
            else {
              this.tempXpath = this.tempXpath
            }
        }
    } 
    else if (element.attributes.length != 0) {
        if (!attrValue) {
            for (var i = 0; i < element.attributes.length; i++) {
                attr = element.attributes[i].name;
                attrValue = element.attributes[i].nodeValue;
                if (attrValue != null && attrValue != "" && (attr !== "style" || userAttr === "style") && attr !== "id" && attr !== "xpath" && (attributeChoicesForXpath.includes("with" + attr) || userAttr == attr)) {
                    listOfAttr[attr] = attrValue
                }
            }
        }

        if (userAttr in listOfAttr) {
            attr = userAttr;
            attrValue = listOfAttr[attr]
        } 
        else if ("placeholder" in listOfAttr) {
            attr = "placeholder";
            attrValue = listOfAttr[attr]
        }
        else if ("title" in listOfAttr) {
            attr = "title";
            attrValue = listOfAttr[attr]
        }
        else if ("value" in listOfAttr) {
            attr = "value";
            attrValue = listOfAttr[attr]
        }
        else if ("name" in listOfAttr) {
            attr = "name";
            attrValue = listOfAttr[attr]
        }
        else if ("type" in listOfAttr) {
            attr = "type";
            attrValue = listOfAttr[attr]
        }
        else if ("class" in listOfAttr) {
            attr = "class";
            attrValue = listOfAttr[attr]
        }
        else {
            attr = Object.keys(listOfAttr)[0];
            attrValue = listOfAttr[attr]
        }
        attrValue = this.removeLineBreak(attrValue);
        if (attrValue != null && attrValue != "" && attr !== "xpath") {
            var xpathWithoutAttribute = '//' + tagName + this.tempXpath;
            var xpathWithAttribute = "";
            if (attrValue.includes('  ')) {
                attrValue = attrValue.split('  ')[attrValue.split('  ').length - 1];
                this.containsFlag = !0
            }
            if (attrValue.includes("'")) {
                if (attrValue.charAt(0) === " " || attrValue.charAt(attrValue.length - 1) === " " || this.containsFlag) {
                    xpathWithAttribute = '//' + tagName + '[contains(@' + attr + ',"' + attrValue.trim() + '")]' + this.tempXpath
                } 
                else {
                  xpathWithAttribute = '//' + tagName + '[@' + attr + '="' + attrValue + '"]' + this.tempXpath
                }
            }
            else {
                if (attrValue.charAt(0) === " " || attrValue.charAt(attrValue.length - 1) === " " || this.containsFlag) {
                    xpathWithAttribute = '//' + tagName + "[contains(@" + attr + ",'" + attrValue.trim() + "')]" + this.tempXpath
                } 
                else {
                  xpathWithAttribute = '//' + tagName + "[@" + attr + "='" + attrValue + "']" + this.tempXpath
                }
            }
            var totalMatch = _document.evaluate(xpathWithAttribute, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;

            if (totalMatch === 1) {
                if ((xpathWithAttribute.includes('@href') && !userAttr.includes("href")) || (xpathWithAttribute.includes('@src') && !userAttr.includes("src")) && innerText) {
                    console.log('never 1211')
                    var containsXpath = '//' + tagName + containsText;
                    var totalMatch = _document.evaluate(containsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                    if (totalMatch === 0) {
                        var equalsXpath = '//' + tagName + equalsText;
                        var totalMatch = _document.evaluate(equalsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                        if (totalMatch === 1) {
                            console.log(this.tempXpath)
                            return equalsXpath
                        }
                    } 
                    else if (totalMatch === 1) {
                        console.log(this.tempXpath)
                        return containsXpath
                    }
                }
                console.log(this.tempXpath)
                return xpathWithAttribute
            } 
            else if (innerText) {
                console.log('never 1228')
                var containsXpath = '//' + tagName + containsText;
                var totalMatch = _document.evaluate(containsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                if (totalMatch === 0) {
                    var equalsXpath = '//' + tagName + equalsText;
                    var totalMatch = _document.evaluate(equalsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                    if (totalMatch === 1) {
                        return equalsXpath
                    } else {
                        this.tempXpath = equalsXpath
                    }
                } 
                else if (totalMatch === 1) {
                    return containsXpath
                } 
                else {
                    containsXpath = xpathWithAttribute + containsText;
                    totalMatch = _document.evaluate(containsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                    if (totalMatch === 0) {
                        var equalsXpath = xpathWithAttribute + equalsText;
                        var totalMatch = _document.evaluate(equalsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                        if (totalMatch === 1) {
                            return equalsXpath
                        }
                    } else if (totalMatch === 1) {
                        return containsXpath
                    } else if (attrValue.includes('/') || innerText.includes('/')) {
                        if (attrValue.includes('/')) {
                            containsXpath = xpathWithoutAttribute + containsText
                        }
                        if (innerText.includes('/')) {
                            containsXpath = containsXpath.replace(containsText, "")
                        }
                        this.tempXpath = containsXpath
                    } else {
                        this.tempXpath = containsXpath
                    }
                }
            } 
            else {
                this.tempXpath = xpathWithAttribute;
                if (attrValue.includes('/')) {
                    this.tempXpath = "//" + tagName + xpathWithoutAttribute
                }
            }
        } 
        else if (innerText) {
            console.log('never 1275')
            var containsXpath = '//' + tagName + containsText;
            var totalMatch = _document.evaluate(containsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
            if (totalMatch === 0) {
                var equalsXpath = '//' + tagName + equalsText;
                var totalMatch = _document.evaluate(equalsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                if (totalMatch === 1) {
                    return equalsXpath
                }
            }
            else if (totalMatch === 1) {
                return containsXpath
            }
            this.tempXpath = containsXpath
        } 
        else if ((attrValue == null || attrValue == "" || attr.includes("xpath"))) {
            this.tempXpath = "//" + tagName + this.tempXpath
        }
    } 
    else if (attrValue == "" && innerText && !tagName.includes("script")) {
        console.log('never 1295')
        var containsXpath = '//' + tagName + containsText + this.tempXpath;
        var totalMatch = _document.evaluate(containsXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
        if (totalMatch === 0) {
            this.tempXpath = '//' + tagName + equalsText + this.tempXpath;
            var totalMatch = _document.evaluate(this.tempXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
            if (totalMatch === 1) {
                return this.tempXpath
            }
        } else if (totalMatch === 1) {
            return containsXpath
        } else {
            this.tempXpath = containsXpath
        }
    } 
    else {
        this.tempXpath = "//" + tagName + this.tempXpath
    }
    var ix = 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element) {
            this.indexes.push(ix + 1);
            this.tempXpath = this.formRelXpath(_document, element.parentNode);
            //if(typeof this.tempXpath == 'undefined'){
            //  this.tempXpath = ""
            //}
            if (!this.tempXpath.includes("/")) {
                return this.tempXpath
            } 
            else {
                var totalMatch = _document.evaluate(this.tempXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                if (totalMatch === 1) {
                    return this.tempXpath
                } 
                else {
                    this.tempXpath = "/" + this.tempXpath.replace(/\/\/+/g, '/');
                    var regSlas = /\/+/g;
                    var regBarces = /[^[\]]+(?=])/g;
                    while ((match = regSlas.exec(this.tempXpath)) != null) {
                        this.matchIndex.push(match.index)
                    }
                    for (var j = 0; j < this.indexes.length; j++) {
                        if (j === 0) {
                            var lastTag = this.tempXpath.slice(this.matchIndex[this.matchIndex.length - 1]);
                            if ((match = regBarces.exec(lastTag)) != null) {
                                lastTag = lastTag.replace(regBarces, this.indexes[j]).split("]")[0] + "]";
                                this.tempXpath = this.tempXpath.slice(0, this.matchIndex[this.matchIndex.length - 1]) + lastTag
                            } 
                            else {
                                this.tempXpath = this.tempXpath + "[" + this.indexes[j] + "]"
                            }
                        } 
                        else {
                            var lastTag = this.tempXpath.slice(this.matchIndex[this.matchIndex.length - (j + 1)], this.matchIndex[this.matchIndex.length - (j)]);
                            if ((match = regBarces.exec(lastTag)) != null) {
                                lastTag = lastTag.replace(regBarces, this.indexes[j]);
                                this.tempXpath = this.tempXpath.slice(0, this.matchIndex[this.matchIndex.length - (j + 1)]) + lastTag + this.tempXpath.slice(this.matchIndex[this.matchIndex.length - j])
                            } 
                            else {
                               
                                this.tempXpath = this.tempXpath.slice(0, this.matchIndex[this.matchIndex.length - j]) + "[" + this.indexes[j] + "]" + this.tempXpath.slice(this.matchIndex[this.matchIndex.length - j])
                            }
                        }
                        if (this.tempXpath[0] == '['){
                          this.tempXpath = this.tempXpath.slice(3)
                        }
                        var totalMatch = _document.evaluate(this.tempXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                        if (totalMatch === 1) {
                            var regSlashContent = /([a-zA-Z])([^/]*)/g;
                            var length = this.tempXpath.match(regSlashContent).length;
                            for (var k = j + 1; k < length - 1; k++) {
                                var lastTag = this.tempXpath.match(/\/([^\/]+)\/?$/)[1];
                                var arr = this.tempXpath.match(regSlashContent);
                                arr.splice(length - k, 1, '/');
                                var relXpath = "";
                                for (var i = 0; i < arr.length - 1; i++) {
                                    if (arr[i]) {
                                        relXpath = relXpath + "/" + arr[i]
                                    } else {
                                        relXpath = relXpath + "//" + arr[i]
                                    }
                                }
                                relXpath = (relXpath + "/" + lastTag).replace(/\/\/+/g, '//');
                                relXpath = relXpath.replace(/\/\/+/g, '/');
                                relXpath = relXpath.replace(/\/+/g, "//");
                                var totalMatch = _document.evaluate(relXpath, _document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                                if (totalMatch === 1) {
                                    this.tempXpath = relXpath
                                }
                            }
                            console.log(this.tempXpath)
                            return this.tempXpath.replace('//html', '')
                        }
                    }
                }
            }
        }
        if (sibling.nodeType === 1 && sibling.tagName.toLowerCase() === element.tagName.toLowerCase()) {
            ix++
        }
    }
  },

	/**
	 * Add to select elements the element that is under the mouse
	 */
	selectMouseOverElement: function() {

		var element = this.mouseOverElement;
		if(element) {
			this.selectedElements.push(element);
			//this.highlightSelectedElements();
		}
	},


	bindElementHighlightOtips: function () {
		$(this.$allElements).bind("mouseover.elementSelector", function(e) {
			// allow event bubbling for other event listeners but not for web scraper.
			if(e.target !== e.currentTarget) {
				return;
			}

			var element = e.currentTarget;
			this.mouseOverElement = element;
			$(element).addClass("-sitemap-select-item-hover");
		}.bind(this)).bind("mouseout.elementSelector", function(e) {
			// allow event bubbling for other event listeners but not for web scraper.
			if(e.target !== e.currentTarget) {
				return;
			}

			var element = e.currentTarget;
			this.mouseOverElement = null;
			$(element).removeClass("-sitemap-select-item-hover");
		}.bind(this));
	},



	bindElementHighlight: function () {
		$(this.$allElements).bind("mouseover.elementSelector", function(e) {
			// allow event bubbling for other event listeners but not for web scraper.
			if(e.target !== e.currentTarget) {
				return;
			}

			var element = e.currentTarget;
			this.mouseOverElement = element;
			$(element).addClass("-sitemap-select-item-hover");
		}.bind(this)).bind("mouseout.elementSelector", function(e) {
			// allow event bubbling for other event listeners but not for web scraper.
			if(e.target !== e.currentTarget) {
				return;
			}

			var element = e.currentTarget;
			this.mouseOverElement = null;
			$(element).removeClass("-sitemap-select-item-hover");
		}.bind(this));
	},


	bindElementHighlightOtipsList: function () {
		$(this.$allElements).bind("mouseover.elementSelector", function(e) {
			if(e.target !== e.currentTarget) {
				return;
			}
			var element = e.currentTarget;

      if ($(element).hasClass('-sitemap-select-item-selected')){
        absXpath = this.generateAbsXpath(element);
        console.log(absXpath)
			  //$("body #-selector-toolbar #element_abs_xpath").text(absXpath);
      }
      //
		}.bind(this)).bind("mouseout.elementSelector", function(e) {

			if(e.target !== e.currentTarget) {
				return;
			}

		}.bind(this));
	},




	bindElementHighlightURL: function () {
		$(this.$allElements).bind("mouseover.elementSelector", function(e) {
			// allow event bubbling for other event listeners but not for web scraper.
			if(e.target !== e.currentTarget) {
				return;
			}
   

			var element = e.currentTarget;
      //console.log('-----------1---------')
      //console.log($(element))
      if ($(element).hasClass('-sitemap-select-item-selected')){
        //console.log(e.currentTarget)
        absXpath = this.generateAbsXpath(element);
        console.log(absXpath)
			  $("body #-selector-toolbar #element_abs_xpath").text(absXpath);
      }
      //console.log('-----------2---------')
			//this.mouseOverElement = element;
			//$(element).addClass("-sitemap-select-item-hover");
		}.bind(this)).bind("mouseout.elementSelector", function(e) {
			// allow event bubbling for other event listeners but not for web scraper.
			if(e.target !== e.currentTarget) {
				return;
			}

			//var element = e.currentTarget;
			//this.mouseOverElement = null;
			//$(element).removeClass("-sitemap-select-item-hover");
		}.bind(this));
	},



	bindMoveImagesToTop: function() {

		$("body").addClass("-web-scraper-selection-active");

		// do this only when selecting images
		if(this.allowedElements === 'img') {
			$("img").filter(function(i, element) {
				return $(element).css("position") === 'static';
			}).addClass("-web-scraper-img-on-top");
		}
	},

	unbindMoveImagesToTop: function() {

		$("body.-web-scraper-selection-active").removeClass("-web-scraper-selection-active");
		$("img.-web-scraper-img-on-top").removeClass("-web-scraper-img-on-top");
	},

	selectChild: function () {
		this.top--;
		if (this.top < 0) {
			this.top = 0;
		}
	},
	selectParent: function () {
		this.top++;
	},

	// User with keyboard arrows can select child or paret elements of selected elements.
	bindKeyboardSelectionManipulations: function () {

		// check for focus
		var lastFocusStatus;
		this.keyPressFocusInterval = setInterval(function() {
			var focus = document.hasFocus();
			if(focus === lastFocusStatus) return;
			lastFocusStatus = focus;

			$("#-selector-toolbar .key-button").toggleClass("hide", !focus);
			$("#-selector-toolbar .key-events").toggleClass("hide", focus);
		}.bind(this), 200);


		// Using up/down arrows user can select elements from top of the
		// selected element
		$(document).bind("keydown.selectionManipulation", function (event) {

			// select child C
			if (event.keyCode === 67) {
				this.animateClickedKey($("#-selector-toolbar .key-button-child"));
				this.selectChild();
			}
			// select parent P
			else if (event.keyCode === 80) {
				this.animateClickedKey($("#-selector-toolbar .key-button-parent"));
				this.selectParent();
			}
			// select element
			else if (event.keyCode === 83) {
				this.animateClickedKey($("#-selector-toolbar .key-button-select"));
				this.selectMouseOverElement();
			}

			//this.highlightSelectedElements();
		}.bind(this));
	},

	animateClickedKey: function(element) {
		$(element).removeClass("clicked").removeClass("clicked-animation");
		setTimeout(function() {
			$(element).addClass("clicked");
			setTimeout(function(){
				$(element).addClass("clicked-animation");
			},100);
		},1);

	},


	highlightSelectedElementsURL: function (optRelXpath) {
		try {
      var res = document.evaluate(optRelXpath, document);
			$(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');


      let listElements = [];
      while(node = res.iterateNext()) {
        listElements.push(node)
      }
      console.log(listElements)
      for (var i = 0; i < listElements.length; i++) {
        $(listElements[i]).addClass('-sitemap-select-item-selected');
      }

			$("body #-selector-toolbar .selector").text(optRelXpath);
			//// highlight selected elements
      //console.log(this.selectedElements)
      //console.log(this.parent)
			//$(ElementQuery(this.selectedElements, this.parent)).addClass('-sitemap-select-item-selected');
		}
		catch(err) {
			if(err === "found multiple element groups, but allowMultipleSelectors disabled") {
				console.log("multiple different element selection disabled");

				this.showMultipleGroupPopup();
				// remove last added element
				this.selectedElements.pop();
				this.highlightSelectedElements();
			}
		}
	},



	highlightSelectedElementsOtipsURL: function (optRelXpath) {
		try {
      var res = document.evaluate(optRelXpath, document);
			$(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');


      let listElements = [];
      while(node = res.iterateNext()) {
        listElements.push(node)
      }
      //console.log(listElements)
      for (var i = 0; i < listElements.length; i++) {
        $(listElements[i]).addClass('-sitemap-select-item-selected');
      }

		}
		catch(err) {
			if(err === "found multiple element groups, but allowMultipleSelectors disabled") {
				console.log("multiple different element selection disabled");

				this.showMultipleGroupPopup();
				// remove last added element
				this.selectedElements.pop();
				this.highlightSelectedElements();
			}
		}
	},



	highlightSelectedElements: function (optRelXpath) {
		try {
			//var resultCssSelector = this.getCurrentCSSSelector();
      //console.log(" highlightSelectedElements");
      console.log(optRelXpath)
      var res = document.evaluate(optRelXpath, document);
      var elem = "temp";
      if(res){
        elem = res.iterateNext();
      }
      //console.log(elem)
      //console.log('-----------------------')
			$(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');
      $(elem).addClass('-sitemap-select-item-selected');
      //https://www.amazon.com/s?bbn=16225007011&rh=n%3A16225007011%2Cn%3A172456&dc&fst=as%3Aoff&qid=1578897380&rnid=16225007011&ref=lp_16225007011_nr_n_0
      //var elementsOfXPath = document.evaluate('//div[1]/span[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/h2[1]/a[1]/span[1]',document);

      //https://en.zalando.de/womens-clothing-dresses/
      //var elementsOfXPath = document.evaluate('//article[1]/div[1]/div[2]/header[1]/a[1]/div[1]/div[2]',document);

      //https://www.walmart.com/browse/food/coffee/976759_1086446_1229652?povid=1086446+%7C++%7C+Coffee%20Whole%20Bean%20Coffee%20Featured%20Categories%20Collapsible
      //var elementsOfXPath = document.evaluate('//div[1]/div[2]/div[5]/div[1]/a[1]/span[1]',document);
     
      //https://www.newegg.com/p/pl?N=100023490&cm_sp=Cat_Digital-Cameras_1-_-VisNav-_-Cameras_1
      //var elementsOfXPath = document.evaluate('//div/div[1]/a[@class=\'item-title\']',document);
      
      //https://global.rakuten.com/en/category/206878/?l-id=rgm-top-en-nav-shoes-mensneakers 
      //var elementsOfXPath = document.evaluate('//li/div[1]/div[2]/div[1]/a[1]',document);


      //var selectedElements = [];
      //while(node = elementsOfXPath .iterateNext()) {
      //  selectedElements.push(node)
      //}

      //for (var i = 0; i < selectedElements.length; i++) {
      //  //console.log(selectedElements[i]);
      //  $(selectedElements[i]).addClass('-sitemap-select-item-selected');
      //}

			$("body #-selector-toolbar .selector").text(optRelXpath);
			//// highlight selected elements
      //console.log(this.selectedElements)
      //console.log(this.parent)
			//$(ElementQuery(this.selectedElements, this.parent)).addClass('-sitemap-select-item-selected');
		}
		catch(err) {
			if(err === "found multiple element groups, but allowMultipleSelectors disabled") {
				console.log("multiple different element selection disabled");

				this.showMultipleGroupPopup();
				// remove last added element
				this.selectedElements.pop();
				this.highlightSelectedElements();
			}
		}
	},

	showMultipleGroupPopup: function() {
		$("#-selector-toolbar .popover").attr("style", "display:block !important;");
	},

	hideMultipleGroupPopup: function() {
		$("#-selector-toolbar .popover").attr("style", "");
	},

	bindMultipleGroupPopupHide: function() {
		$("#-selector-toolbar .popover .close").click(this.hideMultipleGroupPopup.bind(this));
	},

	unbindMultipleGroupPopupHide: function() {
		$("#-selector-toolbar .popover .close").unbind("click");
	},

	bindMultipleGroupCheckbox: function() {
		$("#-selector-toolbar [name=diferentElementSelection]").change(function(e) {
			if($(e.currentTarget).is(":checked")) {
				this.initCssSelector(true);
			}
			else {
				this.initCssSelector(false);
			}
		}.bind(this));
	},
	unbindMultipleGroupCheckbox: function(){
		$("#-selector-toolbar .diferentElementSelection").unbind("change");
	},





	attachToolbar: function () {
		var $toolbar = '<div id="-selector-toolbar">' +
			'<div class="list-item"><div class="selector-container"><textarea id = "element_xpath" class="selector" style = "width:100%; height:26px; text-align:right; overflow:hidden; resize: none "></textarea></div></div>' +
			'<div class="list-item highlight-button">Highlight</div>' +
			'<div class="list-item done-selecting-button">Close</div>' +
			'</div>';
		$("body").append($toolbar);


		$("body #-selector-toolbar .highlight-button").click(function () {
      console.log('click done');
			this.highlightSelection();
		}.bind(this));

		$("body #-selector-toolbar .done-selecting-button").click(function () {
      console.log('click done');
			this.selectionFinished();
		}.bind(this));
	},



	attachToolbarURL: function () {
		var $toolbar = '<div id="-selector-toolbar">' +
			'<div class="list-item"><div class="selector-container"><textarea id = "element_xpath" class="selector" style = "width:100%; height:26px; text-align:right;overflow:hidden; resize: none"></textarea></div></div>' +
			'<div class="list-item highlight-button">Highlight</div>' +
			'<div class="list-item done-selecting-button">Close</div>' +
			'<div class="row" style="width:100%"></div><div class="list-item-abs"><div class="selector-container"><textarea id = "element_abs_xpath" class="selector" style = "width:100%; height:26px; text-align:right; overflow:hidden; resize: none" ></textarea></div></div> <div class="list-item disable-button">Abs XPath of mouseover element</div>' +
			'</div>';
		$("body").append($toolbar);


		$("body #-selector-toolbar .highlight-button").click(function () {
      console.log('click done');
			this.highlightSelection();
		}.bind(this));

		$("body #-selector-toolbar .done-selecting-button").click(function () {
      console.log('click done');
			this.selectionFinished();
		}.bind(this));
	},


	highlightParent: function () {
		// do not highlight parent if its the body
		if(!$(this.parent).is("body") && !$(this.parent).is("#webpage")) {
			$(this.parent).addClass("-sitemap-parent");
		}
	},

	unbindElementSelection: function () {
		$(this.$allElements).unbind("click.elementSelector");
		// remove highlighted element classes
		this.unbindElementSelectionHighlight();
	},
	unbindElementSelectionHighlight: function () {
		$(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');
		$(".-sitemap-parent").removeClass('-sitemap-parent');
	},
	unbindElementHighlight: function () {
		$(this.$allElements).unbind("mouseover.elementSelector")
			.unbind("mouseout.elementSelector");
	},
	unbindKeyboardSelectionMaipulatios: function () {
		$(document).unbind("keydown.selectionManipulation");
		clearInterval(this.keyPressFocusInterval);
	},
	removeToolbar: function () {
    console.log('remove tool bar')
		$("body #-selector-toolbar a").unbind("click");
		$("#-selector-toolbar").remove();
	},

	removeOperationTips: function () {
    console.log('remove Operation tips')
		$("#operation-tips").remove();
	},




	/**
	 * Remove toolbar and unbind events
	 */
	removeGUI: function() {

		this.unbindElementSelection();
		this.unbindElementHighlight();
		this.removeToolbar();
		//this.unbindKeyboardSelectionMaipulatios();
		//this.unbindMultipleGroupPopupHide();
		//this.unbindMultipleGroupCheckbox();
		//this.unbindMoveImagesToTop();
	},

	highlightSelection: function () {
   	$(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');
	  this.resultXpath = document.getElementById("element_xpath").value;
		try {
      var res = document.evaluate(this.resultXpath, document);


      let listElements = [];
      while(node = res.iterateNext()) {
        listElements.push(node)
      }
      for (var i = 0; i < listElements.length; i++) {
        $(listElements[i]).addClass('-sitemap-select-item-selected');
      }

		}
		catch(err) {
			if(err === "found multiple element groups, but allowMultipleSelectors disabled") {
				console.log("multiple different element selection disabled");

				this.showMultipleGroupPopup();
				// remove last added element
				this.selectedElements.pop();
				this.highlightSelectedElements();
			}
		}

		//var resultCssSelector = this.resultXpath;//this.getCurrentCSSSelector();

	},

	selectionFinished: function () {
    console.log(this.resultXpath)
		//var resultCssSelector = this.resultXpath;//this.getCurrentCSSSelector();

		this.deferredCSSSelectorResponse.resolve({
			CSSSelector: this.resultXpath
		});
	},


	bindElementNoClick: function () {

		this.$allElements.bind("click.elementSelector", function (e) {

			// Cancel all other events
			return false;
		}.bind(this));
	},



  openCollapse5: function(){
		$("#collapse1").removeClass('in')
		$("#collapse2").removeClass('in')
		$("#collapse3").removeClass('in')
		$("#collapse4").removeClass('in')
		$("#collapse5").addClass('in')
		$("#collapse6").removeClass('in')
  	this.bindElementNoClick()
    this.unbindElementHighlight()
  },

	attachOperationTips: function () {
		var $toolbar = '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">' +
  '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>' +
  '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>' +
      '<div class="panel-group opeartion-tips" id="operation-tips">'+
        '<div class="panel panel-info">' +
          '<div class="panel-heading">' +
            '<h4 class="panel-title">' +
            'operation tips' +
             '</h4>' +
          '</div>' +
          '<div id="collapse1" class="panel-collapse collapse in" style="visibility: visible !important; overflow:visible !important">' +
            '<ul class="list-group">' +
              '<li class="list-group-item">Please click or drag the element in the web page or drag operators from the workflow</li>' +
            '</ul>' +
          '</div>' +
          '<div id="collapse2" class="panel-collapse collapse" style="visibility: visible !important; overflow:visible !important">' +
            '<ul class="list-group">' +
              '<li class="list-group-item">You can choose from the following options</li>' +
              '<li class="list-group-item clickable" style="background:#f3f3f3" id ="click-list">Modify the list of the elements (for link)</li>' +
              '<li class="list-group-item clickable" style="background:#f3f3f3" id ="click-list4">Modify the list of the elements (for value)</li>' +
              '<li class="list-group-item clickable" style="background:#f3f3f3" id ="extract-element">Extract the element</li>' +
              '<li class="list-group-item clickable" style="background:#f3f3f3" id ="click-element">Click the element</li>' +
              '<li class="list-group-item clickable" style="background:#f3f3f3" id ="hover-element">Hover over the element</li>' +
              '<li class="list-group-item"><div class="row justify-content-center"><button type="button" id="cancel-otips2" class="btn btn-light" style="width:40%; float:center;text-transform: unset !important; background-color:#CCCCCC; min-width:40%">Cancel</button></div></li>' +
            '</ul>' +
          '</div>' +
          '<div id="collapse3" class="panel-collapse collapse" style="visibility: visible !important; overflow:visible !important">' +
            '<ul class="list-group">' +
              '<li class="list-group-item">You can choose from the following options</li>' +
              '<li class="list-group-item" style="background:#f3f3f3"><input class="form-control" placeholder="input text" style="width:70%;float:left" id="input_txt_box"><button type="button" class="btn btn-light" style="width:21%; float:right; height:31px; background-color:#CCCCCC; min-width:21%" id="ok_btn">OK</button></li>' +
              '<li class="list-group-item clickable" style="background:#f3f3f3" id = "extract-element2"  >Extract the text of the input box</li>' +
              '<li class="list-group-item"><div class="row justify-content-center"><button type="button" id="cancel-otips3" class="btn btn-light" style="width:40%; float:center;text-transform: unset !important; background-color:#CCCCCC; min-width:40%">Cancel</button></div></li>' +
            '</ul>' +
          '</div>' +
          '<div id="collapse4" class="panel-collapse collapse" style="visibility: visible !important; overflow:visible !important">' +
            '<ul class="list-group">' +
              '<li class="list-group-item">Please follow the steps below</li>' +
              '<li class="list-group-item" style="background:#f3f3f3" id ="extract-element">Click the list of the elements</li>' +
              '<li class="list-group-item" style="background:#f3f3f3; color:#999999" >(Done) Step 1: Click an element </li>' +
              '<li class="list-group-item" style="background:#f3f3f3" > Step 2: Click another slimilar element </li>' +
              '<li class="list-group-item"><div class="row justify-content-center"><button type="button" id="cancel-otips4" class="btn btn-light" style="width:40%; float:center;text-transform: unset !important; background-color:#CCCCCC; min-width:40%">Cancel</button></div></li>' +
            '</ul>' +
          '</div>' +
          '<div id="collapse5" class="panel-collapse collapse" style="visibility: visible !important; overflow:visible !important">' +
            '<ul class="list-group">' +
              '<li class="list-group-item">You can choose from the following options</li>' +
              '<li class="list-group-item clickable" style="background:#f3f3f3" id ="click-list2">Modify the list of elements (for link)</li>' +
              '<li class="list-group-item clickable" style="background:#f3f3f3" id ="click-list3">Modify the list of elements (for value)</li>' +
              '<li class="list-group-item clickable" style="background:#f3f3f3" id ="extract-list" > Extract all element in the list </li>' +
              '<li class="list-group-item clickable" style="background:#f3f3f3" id ="pagination"> Pagination </li>' +
              '<li class="list-group-item"><div class="row justify-content-center"><button type="button" id="cancel-otips5" class="btn btn-light" style="width:40%; float:center;text-transform: unset !important; background-color:#CCCCCC; min-width:40%">Cancel</button></div></li>' +
            '</ul>' +
          '</div>' +
          '<div id="collapse6" class="panel-collapse collapse" style="visibility: visible !important; overflow:visible !important">' +
            '<ul class="list-group">' +
              '<li class="list-group-item">You can choose from the following options</li>' +
              '<li class="list-group-item" style="background:#f3f3f3">Click the list of the elements</li>' +
              '<li class="list-group-item" style="background:#f3f3f3" id ="extract-list"> Step 1: Click an element </li>' +
              '<li class="list-group-item" style="background:#f3f3f3" > Step 2: Click another slimilar element </li>' +
              '<li class="list-group-item"><div class="row justify-content-center"><button type="button" id="cancel-otips6" class="btn btn-light" style="width:40%; float:center;text-transform: unset !important; background-color:#CCCCCC; min-width:40%">Cancel</button></div></li>' +
            '</ul>' +
          '</div>' +
          '<div id="collapse7" class="panel-collapse collapse" style="visibility: visible !important; overflow:visible !important">' +
            '<ul class="list-group">' +
              '<li class="list-group-item">Do you want to extract data from all webpages by automatic paging?</li>' +
              '<li class="list-group-item clickable" style="background:#f3f3f3" id ="summary-pagination">Yes</li>' +
              '<li class="list-group-item clickable" style="background:#f3f3f3" id ="detail-pagination"> No, only the current </li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
      '</div>'
		$("body").append($toolbar);
    $("#cancel-otips2").click(function () {
		  $("#collapse1").addClass('in')
		  $("#collapse2").removeClass('in')
		  $("#collapse3").removeClass('in')
		  $("#collapse4").removeClass('in')
		  $("#collapse5").removeClass('in')
		  $("#collapse6").removeClass('in')
		  $("#collapse7").removeClass('in')
      $(".-sitemap-select-item-selected").removeClass("-sitemap-select-item-selected");
      this.initOperationTipsGUI()
		}.bind(this));
    $("#cancel-otips3").click(function () {
		  $("#collapse1").addClass('in')
		  $("#collapse2").removeClass('in')
		  $("#collapse3").removeClass('in')
		  $("#collapse4").removeClass('in')
		  $("#collapse5").removeClass('in')
		  $("#collapse6").removeClass('in')
		  $("#collapse7").removeClass('in')
      $(".-sitemap-select-item-selected").removeClass("-sitemap-select-item-selected");
      this.initOperationTipsGUI()
		}.bind(this));
    $("#cancel-otips4").click(function () {
		  $("#collapse1").addClass('in')
		  $("#collapse2").removeClass('in')
		  $("#collapse3").removeClass('in')
		  $("#collapse4").removeClass('in')
		  $("#collapse5").removeClass('in')
		  $("#collapse6").removeClass('in')
		  $("#collapse7").removeClass('in')
      $(".-sitemap-select-item-selected").removeClass("-sitemap-select-item-selected");
      this.initOperationTipsGUI()
		}.bind(this));
    $("#cancel-otips5").click(function () {
		  $("#collapse1").addClass('in')
		  $("#collapse2").removeClass('in')
		  $("#collapse3").removeClass('in')
		  $("#collapse4").removeClass('in')
		  $("#collapse5").removeClass('in')
		  $("#collapse6").removeClass('in')
		  $("#collapse7").removeClass('in')
      $(".-sitemap-select-item-selected").removeClass("-sitemap-select-item-selected");
      this.initOperationTipsGUI()
		}.bind(this));
    $("#cancel-otips6").click(function () {
		  $("#collapse1").addClass('in')
		  $("#collapse2").removeClass('in')
		  $("#collapse3").removeClass('in')
		  $("#collapse4").removeClass('in')
		  $("#collapse5").removeClass('in')
		  $("#collapse6").removeClass('in')
		  $("#collapse7").removeClass('in')
      $(".-sitemap-select-item-selected").removeClass("-sitemap-select-item-selected");
      this.initOperationTipsGUI()
		}.bind(this));

    $("#extract-element").click(function (e) {
      console.log('call extract element')
      console.log(this.selectedOptRelXpath)
		  chrome.runtime.sendMessage({action:'extract', xpath:this.selectedOptRelXpath}, function (response) {
		  	console.log(response)
		  }.bind(this));
      this.initOperationTipsGUI()
		}.bind(this));

    $("#extract-element2").click(function (e) {
      console.log('call extract element')
      console.log(this.selectedOptRelXpath)
		  chrome.runtime.sendMessage({action:'extract', xpath:this.selectedOptRelXpath}, function (response) {
		  	console.log(response)
		  }.bind(this));
      this.initOperationTipsGUI()
		}.bind(this));


//selectedOptRelListXpath
    $("#extract-list").click(function (e) {
		  chrome.runtime.sendMessage({action:'extract-list', xpath:this.selectedOptRelListXpath}, function (response) {
		  	console.log(response)
		  }.bind(this));
      this.selectedOptRelListXpath = ""
      this.selectedElementOtipsList = []
      this.initOperationTipsGUI()
		}.bind(this));

    $("#extract-list2").click(function (e) {
		  chrome.runtime.sendMessage({action:'extract-list', xpath:this.selectedOptRelListXpath2}, function (response) {
		  	console.log(response)
		  }.bind(this));
      this.selectedOptRelListXpath2 = ""
      this.selectedElementOtipsList = []
      this.initOperationTipsGUI()
		}.bind(this));


    $("#click-element").click(function (e) {
		  chrome.runtime.sendMessage({action:'click', xpath:this.selectedOptRelXpath}, function (response) {
		  	console.log(response)
		  }.bind(this));
   
      //this.g_document.location.href = this.currentEvent.target.closest("a").getAttribute('href');
      console.log('?????????')
      this.unbindElementOperationTips()
		  this.removeOperationTips();
      if( this.currentEvent.target.closest("a") == null || this.currentEvent.target.closest("a").getAttribute('href') == null){
        this.g_document.getElementById(this.currentEvent.target.id).click()
      }
      else{
        console.log(this.currentEvent.target.closest("a"))
        console.log(this.currentEvent.target.closest("a").getAttribute('href'))
        console.log(this.currentEvent.target.closest("a").getAttribute('href') == null)
        this.g_document.location.href = this.currentEvent.target.closest("a").getAttribute('href');

      }
      console.log(this.currentEvent.target.id)
      this.initOperationTipsGUI()
		}.bind(this));

    $("#hover-element").click(function (e) {
		  chrome.runtime.sendMessage({action:'hover', xpath:this.selectedOptRelXpath}, function (response) {
		  	console.log(response)
		  }.bind(this));
      this.initOperationTipsGUI()
		}.bind(this));


    $("#pagination").click(function (e) {
		  $("#collapse1").removeClass('in')
		  $("#collapse2").removeClass('in')
		  $("#collapse3").removeClass('in')
		  $("#collapse4").removeClass('in')
		  $("#collapse5").removeClass('in')
		  $("#collapse6").removeClass('in')
		  $("#collapse7").addClass('in')
		}.bind(this));

    $("#ok_btn").click(function (e) {
		  chrome.runtime.sendMessage({action:'input', text:this.g_document.getElementById('input_txt_box').value, xpath:this.selectedOptRelXpath}, function (response) {
		  	console.log(response)
		  }.bind(this));
      console.log(this.g_document.evaluate(this.selectedOptRelXpath, this.g_document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null))

      var input_box = this.g_document.evaluate(this.selectedOptRelXpath, this.g_document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;

      console.log(document.getElementsByClassName(this.currentEvent.currentTarget.className))
      console.log(document.getElementsByClassName(this.currentEvent.currentTarget.className)[0])
      document.getElementsByClassName(this.currentEvent.currentTarget.className)[0].value = document.getElementById('input_txt_box').value
      this.initOperationTipsGUI()
      
		}.bind(this));


    $("#summary-pagination").click(function (e) {
		  chrome.runtime.sendMessage({action:'summary-pagination', xpath:this.selectedOptRelListXpath}, function (response) {
		  	console.log(response)
		  }.bind(this));
      this.g_document.location.href = this.currentEvent.target.closest("a").getAttribute('href');
      console.log('!!!!!!!!!!!!')
      this.initOperationTipsGUI()
		}.bind(this));


    $("#detail-pagination").click(function (e) {
		  chrome.runtime.sendMessage({action:'detail-pagination', xpath:this.selectedOptRelListXpath}, function (response) {
		  	console.log(response)
		  }.bind(this));
      this.g_document.location.href = this.currentEvent.target.closest("a").getAttribute('href');
      console.log('!!!!!!!!!!!!')
      this.initOperationTipsGUI()
		}.bind(this));



    $("#click-list").click(function (e) {
		  $("#collapse1").removeClass('in')
		  $("#collapse2").removeClass('in')
		  $("#collapse3").removeClass('in')
		  $("#collapse4").addClass('in')
		  $("#collapse5").removeClass('in')
		  $("#collapse6").removeClass('in')
		  //this.unbindElementSelection();
      this.selectedElementOtipsList = []
      
      this.selectedElementOtipsList.push(this.selectedElementOtips)
      console.log(this.selectedElementOtipsList)
      //this.unbindElementOperationTips()
      $(this.selectedElementOtips).addClass('-sitemap-select-item-selected');

      this.bindElementSelectionOtipsList(true)
		  //this.unbindElementHighlight();

		}.bind(this));

    $("#click-list4").click(function (e) {
		  $("#collapse1").removeClass('in')
		  $("#collapse2").removeClass('in')
		  $("#collapse3").removeClass('in')
		  $("#collapse4").addClass('in')
		  $("#collapse5").removeClass('in')
		  $("#collapse6").removeClass('in')
		  //this.unbindElementSelection();
      this.selectedElementOtipsList = []
      
      this.selectedElementOtipsList.push(this.selectedElementOtips)
      console.log(this.selectedElementOtipsList)
      //this.unbindElementOperationTips()
      $(this.selectedElementOtips).addClass('-sitemap-select-item-selected');

      this.bindElementSelectionOtipsList()
		  //this.unbindElementHighlight();

		}.bind(this));




    $("#click-list2").click(function (e) {
		  $("#collapse1").removeClass('in')
		  $("#collapse2").removeClass('in')
		  $("#collapse3").removeClass('in')
		  $("#collapse4").removeClass('in')
		  $("#collapse5").removeClass('in')
		  $("#collapse6").addClass('in')
		  this.unbindElementSelection();
		  $(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');
      console.log('1111111111111')
      this.selectedElementOtipsList = []
      //console.log(this.selectedElementOtipsList)
      //this.unbindElementOperationTips()
      this.bindElementHighlightOtips()
      //this.unbindElementSelection() // click
      this.bindElementSelectionOtipsListClickTwo(true)
		  //this.unbindElementHighlight();

		}.bind(this));

    $("#click-list3").click(function (e) {
		  $("#collapse1").removeClass('in')
		  $("#collapse2").removeClass('in')
		  $("#collapse3").removeClass('in')
		  $("#collapse4").removeClass('in')
		  $("#collapse5").removeClass('in')
		  $("#collapse6").addClass('in')
		  this.unbindElementSelection();
		  $(".-sitemap-select-item-selected").removeClass('-sitemap-select-item-selected');
      console.log('1111111111111')
      this.selectedElementOtipsList = []
      //console.log(this.selectedElementOtipsList)
      //this.unbindElementOperationTips()
      this.bindElementHighlightOtips()
      //this.unbindElementSelection() // click
      this.bindElementSelectionOtipsListClickTwo()
		  //this.unbindElementHighlight();

		}.bind(this));


	},




};
