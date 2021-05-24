/*
 * 调色板
 * Author:MR.CO
 * Date:2010-12-23
 * QQ:co.mr.co@gmail.com
 */
function paletteTools(eid/*需要触发调色板元素ID*/){
    var eobj = $('#'+eid);
    var paletteID = 'divPalette_' + eid;
    if(eobj[0] == null || eobj[0] == undefined) return;    
    if(eobj[0].nodeName.toLowerCase() != 'input') {
        alert('Error Message:Only support input elements...(jq.palette.js)');
        return;
    }
    if(!('value' in eobj[0])) return;    
    this.Eobj = eobj;
    this.PaletteID = paletteID;
    var colorBox = new Array();
    /*异步获取颜色值*/
    $.ajax({url:'Palette/color.htm',type:'get',cache:false,async:false,
            error:function(){ alert('Error Message:File not found color.htm...(jq.palette.js)'); },
            success:function(data){                        
                var colors = data.split(' ');                
                colorBox.push('<div id="'+ paletteID +'" style="position:absolute;display:none;background:#fff; width:240px; _width:242px;  height:180px; border:1px solid #ccc; "><ul style=" padding:0px; margin:0px; float:left; list-style: none; ">');
                for(var i = 0; i < colors.length; i++){
                    if(colors[i].replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\@\.]/g,'') != '')
                        colorBox.push('<li style="display:block; width:10px; height:10px; background-color:'+ colors[i] +';float:left; margin:1px; cursor:pointer;" colorVal="'+ colors[i] +'"></li>');
                }
                colorBox.push('</ul></div>');
            }
    });        
    /*将颜色面板追加到当前文本域后面*/
    eobj.after(colorBox.join(''));
}
paletteTools.prototype.show = function(args/*可设置调色板上左位置传值方式为{top:'1px',left:'1px'}*/){    
    var top,left;
    if(args != undefined){
        top = args.top || 0;
        left = args.left || 0;
        $('#'+this.PaletteID).css({top:top,left:left});
    }    
    var obj = this.Eobj,pid = this.PaletteID;    
    if(obj == undefined || obj == null) return;    
    /*设置选中的颜色值*/
    var setObjColor = function(selectedColor){
        obj.css({background:selectedColor});
        obj.val(selectedColor);            
    }
    /*显示文本域的焦点、显示/隐藏*/
    obj.focus(function(){        
        $('#'+pid).css({display:'block'});
    }).blur(function(){
        $('#'+pid).css({display:'none'});            
    });    
    /*颜色面板鼠标滑动效果*/    
    $('#'+ pid +' li').mouseover(function(){    
        setObjColor($(this).attr('colorVal'));
    })
    /*最终选取颜色点击*/
    .click(function(){
        setObjColor($(this).attr('colorVal'));
        $('#'+pid).css({display:'none'});
    });        
}