$(document).ready(function() {
    console.log(window.location.pathname);

    Foundation.global.namespace = '';
    $(document).foundation();
    // var currProj = "";
    var selectArr = ["upload_project_name_select", "transform_data_project_name_select", "featureset_project_name_select", "plot_feats_project_name_select", "buildmodel_project_name_select","prediction_project_name"]
    var mainTabs = ['#uploadTab','#featurizeTab','#buildModelTab', '#predictTab'];
    var featsetTabs = ['#featureset1tab','#featureset2tab','#uploadcustomtab'];
    var path = window.location.pathname;
    //state 3
    if(path === "/featurizing" || path === "/buildingModel" || path === "/predicting"){
        var proj = "";
        setState("transition")
        var currProj = getCurrProj();
        setCurrProj(currProj);
    }

    $('#tab-links a').on('click', function(e)  {
        e.preventDefault();
        var currentAttrValue = $(this).attr('href');
        // window.location.hash = "panel-" + currentAttrValue.replace('#', '');
        // Show/Hide Tabs
        setState("work")
        changeTab(currentAttrValue, mainTabs);
        // Change/remove current tab to active
        // $(this).parent('li').addClass('active').siblings().removeClass('active');
    });
    
    $('#feature-tab-links a').on('click', function(e)  {
        e.preventDefault();
        var currentAttrValue = $(this).attr('href');        
        // Show/Hide Tabs
        changeTab(currentAttrValue, featsetTabs);
        // Change/remove current tab to active
        // $(this).parent('li').addClass('active').siblings().removeClass('active');
    });
    $("#header_file_upload, #tarball_file_upload").click(function(e){
    	e.preventDefault();
    	var fileTarget = $(this).attr("data-target");
    	$("#"+ fileTarget).click();
    });
    $("#headerfile, #zipfile, #custom_feat_script_file").change(function(){
    	var path = $(this).val();
    	var filename = path.replace(/^.*\\/, "");
    	var span = $(this).attr("data-selected");
    	$(span).text('   '+filename);
    });
    $('a.custom-close-reveal-modal').click(function(e){
        e.preventDefault();
      $('#feature_selection_dialog').foundation('reveal', 'close');
    });
    $(".editProj").click(function(e){
        e.preventDefault();
        modifyProj($(this), "Edit");
    });
    $(".deleteProj").click(function(e){
        e.preventDefault();
        modifyProj($(this), "Delete")
    });
    function modifyProj(el, action){
        var proj = el.attr("data-proj");
        $("#PROJECT_NAME_TO_EDIT").val(proj);
        $("#action").val(action);
        editOrDeleteProjectFormSubmit();
    }
    $(".selectProj, .projDropdown").click(function(e){
        e.preventDefault();
        var proj = $(this).attr("data-proj");
        // currProj = proj;
        setState("work");
        //change vals for all selects to current proj
        // debugger;
        setCurrProj(proj)
    });
    $("#featurize_button, #model_build_submit_button, #predict_form_submit_button").click(function(){
        var proj = $("#projTitle").text();
        setState("transition", proj)
    });
    $("#manageProjectsLink").click(function(e){
        e.preventDefault();
        setState("manage");
        // $("#projTitle").html("");
        setCurrProj("")
    });
    function changeVal(proj){
        for (var i = 0; i < selectArr.length; i++){
            $("#" + selectArr[i]).val(proj);
            $("#" + selectArr[i]).trigger("change");
        }
    }
    function setState(state){
        if (state === "manage"){
            $("#manageProjects").show()
            $("#tabs").hide();
            $("#tab-links").hide();
        }
        else if (state === "work"){
            $("#manageProjects").hide()
            $("#tabs").show();
            $("#tab-links").show();
            changeTab("#uploadTab", mainTabs);
        }
        else if (state === "transition") {
            $("#manageProjects").hide()
            $("#tabs").hide();
            $("#tab-links").show();
        }
    }
    function changeTab(currentAttrValue, allTabs){
        for (var i = 0; i < allTabs.length; i++){
            if (allTabs[i] === currentAttrValue){
                $(allTabs[i]).show();
            }
            else{
                $(allTabs[i]).hide();   
            }
        }
    }
    function setCurrProj(name){
        document.cookie = "currProj="+ name;
        $("#projTitle").html(name);
        changeVal(name);
    }
    function getCurrProj(){
        return getCookie("currProj")
    }
    function getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
    }
});