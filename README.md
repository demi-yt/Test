# table组件（treeTable）
正常的table渲染：
$('#tableList').ytTable({
    paging:false,
    info:false,
    ordering:false,
    serverSide:false,
    destroy:false,
    data:resData,
    columns:columns,
})
树形table渲染+排序+操作
$('#tableListTree').ytTreeTable({
    paging: false,
    info: false,
    ordering: false,
    serverSide: false,
    destroy: true,
    data: newData,
    columns: columns,
    columnDefs: [],
})
