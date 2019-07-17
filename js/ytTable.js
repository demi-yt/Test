// 正常table展示
$.fn.extend({
    ytTable:function({columns=[],data=[],width='100%'}){
        $(this).empty()
        let div = $('<div class="table"></div>')
        if(Array.isArray(columns) && columns.length>0){
            let cd = $('<div class="table-tr"></div>')
            columns.forEach(obj=>{
                let title = obj.title
                let width = obj.width
                let style = ''
                if(!(typeof width === 'undefined' || width === null)){
                    style = 'style="width:'+width+'px"'
                }
                $('<div class="table-th" '+style+'>'+title+'</div>').appendTo(cd)
            })
            cd.appendTo(div)
            if(Array.isArray(data) && data.length>0){
                data.forEach(item=>{
                    let dd = $('<div class="table-tr"></div>')
                    columns.forEach(obj=>{
                        let render = obj.render
                        let data = obj.data
                        let width = obj.width
                        let style = ''
                        if(!(typeof width === 'undefined' || width === null)){
                            style = 'style="width:'+width+'px"'
                        }
                        let defaultContent = obj.defaultContent || '--'
                        if(typeof render === 'function'){
                            let html = render(data,'field',item)
                            if(typeof html === 'undefined' || html === null || html === ''){
                                let v = item[data]
                                v = typeof v === 'undefined' || v === null || v === ''?defaultContent:v
                                $('<div class="table-td" '+style+'>'+v+'</div>').appendTo(dd)
                            }else{
                                let td = $('<div class="table-td" '+style+'></div>')
                                $(html).appendTo(td)
                                td.appendTo(dd)
                            }
                        }else{
                            let v = item[data]
                            v = typeof v === 'undefined' || v === null || v === ''?defaultContent:v
                            $('<div class="table-td" '+style+'>'+v+'</div>').appendTo(dd)
                        }
                    })
                    dd.appendTo(div)
                })
            }else{
                //没有数据时  需要添加一个没有数据的提示
            }
        }
        div.appendTo($(this))
    }
});