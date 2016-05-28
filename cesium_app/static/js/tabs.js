$(document).ready(function() {
    console.log(window.location.pathname);

    Foundation.global.namespace = '';
    $(document).foundation();
    // Constants
    var selectArr = ["upload_project_name_select", "transform_data_project_name_select", "featureset_project_name_select", "plot_feats_project_name_select", "buildmodel_project_name_select","prediction_project_name","featureset_projname_select"]
    var mainTabs = ['#uploadTab','#featurizeTab','#buildModelTab', '#predictTab'];
    var featsetTabs = ['#featureset1tab','#featureset2tab','#uploadcustomtab'];
    var tabStates = [["active", "disabled","disabled","disabled"], ["complete", "active", "disabled", "disabled"], ["complete", "complete", "active", "disabled"], ["complete", "complete", "complete", "active"], ["complete", "complete", "complete", "complete"]];
    var controlSelects = ["#featureset_dataset_select","#modelbuild_featset_name_select","#prediction_model_name_and_type"] 
    var path = window.location.pathname;
    //state 3
    if(path === "/featurizing" || path === "/buildingModel" || path === "/predicting" || path === "/uploadFeaturesForm"){
        setState("transition")
        var currProj = getCurrProj();
        setCurrProj(currProj);
    }
    else if(path === "/"){
        setState("manage");
        // $("#projTitle").html("");
        setCurrProj("")
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
        $(this).parent('li').addClass('active').siblings().removeClass('active');
    });
    $(".fileUpload").click(function(e){
        e.preventDefault();
        var fileTarget = $(this).attr("data-target");
        $("#"+ fileTarget).click();
    });
    $("input[type='file']").change(function(){
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
        controlTabs();
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
    // $("#model_build_results").change(function(){
    //     console.log($(this).text());
    // });
    $('#model_build_results').bind("DOMSubtreeModified",function(){
        var divText = $(this).text();
        if (divText === "Upload complete."){
            $.get("/get_list_of_datasets_by_project/"+String($("#featureset_project_name_select").val()), function(data){
                // debugger;
                var selected_project_datasets = data['dataset_list'];
                populate_select_names_ids('featureset_dataset_select',selected_project_datasets);
            }).done(function(){
                appendContinueButton("#featurizeTab");
            });
        }
        else if (divText === "Featurization of timeseries data complete." || divText === "Featurization completed"){
            appendContinueButton("#buildModelTab");
        }
        else if (divText === "New model successfully created"){
            appendContinueButton("#predictTab");
        }
        else if (divText === "Feature Set Title must contain non-whitespace characters. Please try a different title."){
            appendBackButton("#featurizeTab");
        }


        //handle errors here too
    });
    $(document).on('click', '.continueButton', function(){
        var nextTab = $(this).attr("data-next");
        console.log(nextTab);
        // debugger;
        setState("work");
        changeTab(nextTab, mainTabs);
        controlTabs();
        $(this).hide();
    });
    $("#uploadfeaturesbutton").click(function(){
        $("#uploadFeaturesForm").submit();
        return false;
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
        $("#projectsList").children().each(function(i,val){
            if($(this).attr("data-proj") === name){
                $(this).addClass("active");
            }
            else{
                $(this).removeClass("active");
            }
        });
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
    function setTabState(tabStateIndex){
        //remove all classes
        $("#tab-links").children().removeClass("active disabled complete").each(function(index, val){
            $(this).addClass(tabStates[tabStateIndex][index])
            if (index >= 1){
                $(this).children(".arrow-right").removeClass("active complete disabled");
                $(this).children(".arrow-right").addClass(tabStates[tabStateIndex][index-1]);
            }
        });

    }
    function controlTabs(){
        
        var selected_project_datasets = null;
        var selected_project_featset_names = null; 
        var selected_project_model_names = null;
        var count = 0;
        $.get("/get_list_of_datasets_by_project/"+String($("#transform_data_project_name_select").val()), function(data){
            selected_project_datasets = data['dataset_list'];
            // populate_select_names_ids('transform_data_dataset_select',selected_project_datasets);
        }).done(function(){
            if(selected_project_datasets.length){
                count+=1;
            }
        }).then(function(){
            $.get("/get_list_of_featuresets_by_project/"+String($("#buildmodel_project_name_select").val()), function(data){
                selected_project_featset_names = data['featset_list'];
            }).done(function(){
                if(selected_project_featset_names.length){
                    count+=1;
                }
            }).then(function(){
                $.get("/get_list_of_models_by_project/"+String($("#prediction_project_name").val()), function(data){
                    selected_project_model_names = data['model_list'];
                    populate_select_options('prediction_model_name_and_type',selected_project_model_names);
                }).done(function(){
                    if(selected_project_model_names.length){
                        count+=1;
                    }
                    setTabState(count);
                })
            });
        });  
    }
    function appendContinueButton(next){
        $("#model_build_results").append("<div><a href='#' class='button success continueButton' data-next='" + next + "'>Continue&nbsp;&nbsp;&nbsp;<i class='fa fa-arrow-circle-o-right'></i></a></div>");
    }
    function appendBackButton(prev){
        $("#model_build_results").append("<div><a href='#' class='button info continueButton' data-next='" + prev + "'><i class='fa fa-arrow-circle-o-left'></i>&nbsp;&nbsp;&nbsp;Back</a></div>");
    }
    controlTabs();
    // $.get("/get_list_of_projects", function(data){
    //     console.log(data);
    //     populate_select_options('featureset_projname_select',data['list']);
    // }).done(function(){

    // });




    if( $("#featureset_projname_select").length > 0 && $("#featureset_projname_select").val() != null && $("#featureset_projname_select").val() != "null"){
        $.get("/get_list_of_featuresets_by_project/"+String($("#featureset_projname_select").val()), function(data){
            var selected_project_featureset_names = data['featset_list'];
            enforce_unique_name('uploadfeaturesbutton','featuresetname','featsetname_okay_div',selected_project_featureset_names);
        }); }

    $("#featureset_projname_select").change( function(){

        $.get("/get_list_of_featuresets_by_project/"+String($("#featureset_projname_select").val()), function(data){
            var selected_project_featureset_names = data['featset_list'];
            enforce_unique_name('uploadfeaturesbutton','featuresetname','featsetname_okay_div',selected_project_featureset_names);
        });
    });
});