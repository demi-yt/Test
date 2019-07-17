const yt=function(el,{columns,data,width,sortStatus}){
    this.div = $('<div class="table"></div>')
    this.el = el
    this.columns = columns
    this.width = width
    this.renderTree=false
    this.buildHeader(columns,data,width)
    this.content = this.build(columns,data,width)
    this.content.forEach(k=>{
        k.appendTo(this.div)
    })
    this.div.appendTo(this.el)
    return this
}
yt.prototype.build=function(columns=[],data,width,i){
    let self = this
    let result = []
    if(Array.isArray(data) && data.length>0){
        data.forEach((item,index)=>{
            let dd = $('<div class="table-tr table-row"></div>')
            if(typeof i !== 'undefined'){
                dd.attr('data-index',i)
            }
            columns.forEach((obj,jndex)=>{
                let render = obj.render
                let data = obj.data
                let width = obj.width
                let tree = obj.tree
                let treeField = obj.treeField || 'children'
                let td
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
                        td = $('<div class="table-td" '+style+'>'+v+'</div>').appendTo(dd)
                    }else{
                        td = $('<div class="table-td" '+style+'></div>')
                        $(html).appendTo(td)
                        td.appendTo(dd)
                    }
                }else{
                    let v = item[data]
                    v = typeof v === 'undefined' || v === null || v === ''?defaultContent:v
                    td=$('<div class="table-td" '+style+'>'+v+'</div>').appendTo(dd)
                }
                let treeButn = null
                let i1 = ''
                if(typeof i !== 'undefined'){
                    i1 = i
                }
                let key = index+'-'+jndex+'-'+i1
                if(true){
                    if(tree === true){
                        this.renderTree = true
                        if(item.hasOwnProperty(treeField)){
                            let c = item[treeField]
                            if(Array.isArray(c) && c.length>0){
                                treeButn = $('<div class="table-tree"> + </div>')
                                td.on('click',function(){
                                    if($(this).hasClass('open-tree')){
                                        $(this).removeClass('open-tree').addClass('close-tree')
                                        $('.table-tree',this).html("+")
                                        let chil = $(this).data('tree.data')
                                        $('[data-index="'+chil+'"]',self.el).fadeOut()
                                    }else{
                                        $(this).addClass('open-tree')
                                        $('.table-tree',this).html("-")
                                        if($(this).data('add-tree-data') !==true){
                                            $(this).data('add-tree-data',true)
                                            let chil = self.build(columns,c,width,key)
                                            let tt = $('<div class="tree-table"></div>').appendTo(td)
                                            chil.forEach(k=>{
                                                td.parent().after(k)
                                            })
                                            $(this).data('tree.data',key)
                                        }else{
                                            let chil = $(this).data('tree.data')
                                            $('[data-index="'+chil+'"]',self.el).fadeIn()
                                        }

                                    }
                                })
                            }
                        }
                    }else if(typeof tree === 'function'){
                        treeButn = $('<div class="table-tree"> + </div>')
                        td.on('click',function(){
                            if($(this).hasClass('open-tree')){
                                $(this).removeClass('open-tree').addClass('close-tree')
                                $('.table-tree',this).html("+")
                                let chil = $(this).data('tree.data')
                                $('[data-index="'+chil+'"]',self.el).fadeOut()
                                // chil.hide()
                            }else{
                                $(this).addClass('open-tree')
                                $('.table-tree',this).html("-")
                                if($(this).data('add-tree-data') !==true){
                                    $(this).data('add-tree-data',true)
                                    var data = $(this).data('tree.data')
                                    if(typeof data === 'undefined' || data === null){
                                        tree(function(data){
                                            let chil = self.build(columns,data,width,key)
                                            let tt = $('<div class="tree-table"></div>').appendTo(td)
                                            chil.forEach(k=>{
                                                //k.after(td)
                                                td.parent().after(k)
                                            })
                                            $(this).data('tree.data',key)
                                        })
                                    }else{
                                        let chil = self.build(columns,data,width,key)
                                        let tt = $('<div class="tree-table"></div>').appendTo(td)
                                        chil.forEach(k=>{
                                            td.parent().after(k)
                                        })
                                        $(this).data('tree.data',key)
                                    }
                                }else{
                                    let chil = $(this).data('tree.data')
                                    $('[data-index="'+chil+'"]',self.el).fadeIn()
                                }
                                i
                            }

                        })
                    }
                }
                if(treeButn!==null){
                    treeButn.prependTo(td)
                }
            })
            result.push(dd)
        })
    }else{
        //没有数据时  需要添加一个没有数据的提示
    }
    return result
}
yt.prototype.buildHeader=function(columns=[],data,width){
    let self = this
    if(Array.isArray(columns) && columns.length>0){
        let cd = $('<div class="table-tr"></div>')
        columns.forEach(obj=>{
            let title = obj.title
            let width = obj.width
            let sort = obj.sort
            let style = ''
            if(!(typeof width === 'undefined' || width === null)){
                style = 'style="width:'+width+'px"'
            }
            let header = $('<div class="table-th" '+style+'>'+title+'</div>').appendTo(cd)
            if(sort === true){
                let sort = $('<span class="yt-table-header-sort yt-table-sort" style="cursor:pointer;"></span>').appendTo(header)
                sort.data('sort','none')
                sort.data('field',obj.data)
                sort.click(function(){
                    let that = $(this)
                    //清除别的列的排序 每次只排一列
                    let s = that.data('sort')
                    if(s === 'none'){
                        that.data('sort','up')
                        that.removeClass('yt-table-sort').addClass('yt-table-sort-up')
                    }else if(s === 'up'){
                        that.data('sort','down')
                        that.removeClass('yt-table-sort-up').addClass('yt-table-sort-down')
                    }else{
                        that.data('sort','none')
                        that.removeClass('yt-table-sort-down').addClass('yt-table-sort')
                    }
                    let o = []
                    $('.yt-table-header-sort',self.el).each(function(){
                        let s = $(this).data('sort')
                        let f = $(this).data('field')
                        o.push({type:s,field:f})
                    })
                    self.el.trigger('sort',{data:o,value:obj})
                })

            }
        })
        cd.appendTo(this.div)
    }
}
//页面数据刷新
yt.prototype.freshen=function(data){
    $('.table-row',this.el).remove()
    this.content = this.build(this.columns,data,this.width)
    this.content.forEach(k=>{
        k.appendTo(this.div)
    })
}
$.fn.extend({
    ytTreeTable:function(opt={}){
        let _opt = Object.assign({columns:[],data:[],width:'100%',sortStatus:false},opt)
        let d = $(this).data('y-l-t-o-a-v.table');
        if (!d) {
            $(this).data('y-l-t-o-a-v.table', d = new yt($(this),_opt));
        }else{
            d.freshen(_opt.data)
        }
        return d
    }
});