$(document).ready(function() {
    Foundation.global.namespace = '';
    $(document).foundation();
    var currProj = "";
    var selectArr = ["upload_project_name_select", "transform_data_project_name_select", "featureset_project_name_select", "plot_feats_project_name_select", "buildmodel_project_name_select","prediction_project_name"]
    $('#tab-links a').on('click', function(e)  {
        e.preventDefault();
        var currentAttrValue = $(this).attr('href');
        window.location.hash = "panel-" + currentAttrValue.replace('#', '');
        // Show/Hide Tabs
        var allTabs = ['#uploadTab','#featurizeTab','#buildModelTab', '#predictTab']
        for (var i = 0; i < allTabs.length; i++){
            if (allTabs[i] === currentAttrValue){
                $(allTabs[i]).show();
            }
            else{
                $(allTabs[i]).hide();   
            }
        }
        // Change/remove current tab to active
        // $(this).parent('li').addClass('active').siblings().removeClass('active');
    });
    
    $('#feature-tab-links a').on('click', function(e)  {
        e.preventDefault();
        var currentAttrValue = $(this).attr('href');
        
        // Show/Hide Tabs
        var allTabs = ['#featureset1tab','#featureset2tab','#uploadcustomtab']
        for (var i = 0; i < allTabs.length; i++){

            if (allTabs[i] === currentAttrValue){
                $(allTabs[i]).show();
            }
            else{
                $(allTabs[i]).hide();   
            }
        }
        // Change/remove current tab to active
        $(this).parent('li').addClass('active').siblings().removeClass('active');
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
    // $('#feature_selection_dialog').foundation();
    // $('#feature_modal_open').on('click', function() {
    //         // var popup = new Foundation.Reveal($('#feature_selection_dialog'));
    //         // popup.open();
    //         console.log("hello");
    //     $('#feature_selection_dialog').reveal();
    // });
    // $(document).foundation();
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
        $("#projTitle").html(proj);
        currProj = proj;
        $("#manageProjects").hide()
        $("#tabs").show();
        $("#uploadTab").show();
        $("#tab-links").show();
        //change vals for all selects to current proj
        changeVal();
    });
    $("#manageProjectsLink").click(function(e){
        e.preventDefault();
        $("#tabs").hide();
        $("#tab-links").hide();
        $("#manageProjects").show()
        
    })
    function changeVal(){
        for (var i = 0; i < selectArr.length; i++){
            $("#" + selectArr[i]).val(currProj);
        }
    }
});