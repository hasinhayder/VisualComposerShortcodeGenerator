/**
 * Created by storyteller on 5/25/14.
 */
var index = 0;
$(document).ready(function(){
    $("#container").on("click",".addnew", function(){
        addElement();
    });

    $("#generate").on("click",function(){

        var json = [];
        var scp = "";
        var itemTemplate = Handlebars.compile($("#item").html());
        var scTemplate = Handlebars.compile($("#shortcodetemplate").html());

        $("#code").html("");
        $("#importarea").html("");
        $("#wpcode").html("");
        $("#wpcode").append("function "+$("#scfuncname").val()+"($atts, $content=null)\n{\n\textract(shortcode_atts(array(\n");

        $("#container").find("form").each(function(){
            var id = $(this).attr("id");
            var heading = $(this).find(".heading").val();
            var type = $(this).find(".type").val();
            var param = $(this).find(".param").val();
            var value = $(this).find(".value").val();
            $("#wpcode").append("\t\t'"+param+"' => '"+value+"',\n");
            var group = $(this).find(".group").val();
            var admin = $(this).find(".admin_label").is(":checked");
            var params ={h:heading, t:type, p:param,v:value,g:group,a:admin,f:id};
            var itemCode = itemTemplate(params);

            json.push(params);
            scp += itemCode;

        });

        var scparams = {sch: $("#scname").val(),scf:$("#scfuncname").val(),scc:$("#sccategory").val(),scp:scp};
        var shortcode = scTemplate(scparams);


        $("#code").val(shortcode);

        $("#wpcode").append("\t),$atts));\n\treturn $content;\n}")
        $("#wpcode").append("\nadd_shortcode('"+$("#scfuncname").val()+"', '"+$("#scfuncname").val()+"');");
        $(".g").show();
        $("#code").show();
        $("#wpcode").show();

        //add the schortcode defs
        delete(scparams['scp']);
        json.push(scparams);

        $("#importarea").val(JSON.stringify(json));
        $("#importarea").show();
    });

    $("#import").on("click",function(){
        $(".importlabel").show();
        $("#importarea").show();
        $("#importjson").show();
        $("#hidejson").show();
    });

    $("#importjson").on("click",function(){
        var jsonstring = $("#importarea").val();
        var json = $.parseJSON(jsonstring);
        var scparams = json.pop();

        $("#scname").val(scparams.sch);
        $("#scfuncname").val(scparams.scf)
        $("#sccategory").val(scparams.scc);

        $("#container").html("");
        index=0;
        for(i in json){
            var param = json[i];
            addElement();
            setElementValues(param.f, param.t, param.h, param.p, param.v, param.g, param.a)
        }
        $(".j").hide();
    });

    function addElement(){
        index++;
        $("#container").append($("#placeholder").html());
        var lastItem = $("#container").find(".last");
        $(lastItem).find("h4").html("Item "+index);
        $(lastItem).removeClass("last");
        $(lastItem).attr("id","form_"+index);
    }

    function setElementValues(id,type,heading,param,value,group,admin){
        $("#"+id).find(".heading").val(heading);
        $("#"+id).find(".type").val(type);
        $("#"+id).find(".param").val(param);
        $("#"+id).find(".group").val(group);
        $("#"+id).find(".value").val(value);
        if(admin)
            $("#"+id).find(".admin_label").prop("checked",true);
    }

    $("#hidejson").on("click",function(){
        $(".j").hide();
    });

    addElement();
});