$(document).ready(function () {

    $('#owner').hide();
    $('#cashier').hide();

    stockProducts = [
        {
            "label": "Pizza",
            "name": "pizza",
            "price": 5,
        }
        , {
            "label": "Hamburguer",
            "name": "sanduiche",
            "price": 7,
        },{
            "label" : 'Mochila',
            "name" : 'mochila',
            'price' : 1500,
        }
    ]


    $('#isSale').hide();

    storeId = null;
    ownerId = null;
    userId = null;
    dataTable = null;
    dataTableStock = null;
    forSalePrice = null;
    cashMoney = null;

    window.addEventListener('message', function (event) {
        var item = event.data;

        checkOwnerStore(event.data);

        if (item.openMercadinho == true) {
            ownerId = item.ownerID;
            userId = item.playerID;
            storeId = item.storeID;
            forSalePrice = item.forSalePrice;
            cashMoney = item.cashMoney;
            openLoja()
        } else if (item.openMercadinho == false) {
            closeLoja()
        }

        if (item.enabled || item.reload) {
            if(item.productsData === undefined){
                ProductsData = []
            }else{
                ProductsData = JSON.parse(item.productsData);
            }

            ownerId = item.ownerID;
            userId = item.playerID;
            storeId = item.storeID;
            startDatatable(item.type);
            if(item.cashMoney === undefined){
                $("#cashierMoney").text(formatter.format(0));

            }else{
                $("#cashierMoney").text(formatter.format(item.cashMoney));

            }

        }

        if (item.purchase) {
            Swal.fire(
                `Compra efetuada com sucesso!`,
                `Você comprou ${item.amount}x ${item.label}`,
                item.statusPurchase
            )
        }

        if(item.notify)
        {
            Swal.fire(item.message,'',item.status)
        }


    })

    document.onkeydown = function (data) {
        if (data.key == "Escape") {
            $.post('http://mercado/closeUI', JSON.stringify({}))
            closeLoja()
        }
    }


    $("#owner").on('click', function () {
        $("#products").hide();
        $('#stock').show();
        startDatatableStock();
    })

    $("#store").on('click', function () {
        $("#products").show();
        $('#stock').hide();
        startDatatable();
    })

    $('#withdrawMoney').on('click',function () {
        Swal.fire({
            title: `<span> Deseja comprar sacar todo o dinheiro? </span>`,
            confirmButtonText: 'Sacar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            preConfirm: (confirm) => {
                $.post('http://mercado/withdrawMoney', JSON.stringify({
                    'storeID': storeId
                }));
            }
        })

    })

    $('#sellStore').on('click',function () {
        Swal.fire({
            title: `<span> Deseja vender esta loja por  <span style="color: green"> ${formatter.format(forSalePrice)}</span>? </span>`,
            confirmButtonText: 'Vender',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            preConfirm: (confirm) => {
                $.post('http://mercado/sellStore', JSON.stringify({
                    'storeID': storeId
                }));
            }
        })
    })

    $("#buyStore").on('click',function () {
            Swal.fire({
                title: `<span> Deseja comprar esta loja por  <span style="color: green"> ${formatter.format(forSalePrice)}</span>? </span>`,
                confirmButtonText: 'Comprar',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                preConfirm: (confirm) => {
                    $.post('http://mercado/purchaseStore', JSON.stringify({
                        'storeID': storeId
                    }));
                }
            })
    })

    //ABRIR LOJA
    function openLoja() {
        $(".loja-de-roupa").css("display", "block")
        $("#body").css("display", "block")
        $("#cashierMoney").text(formatter.format(cashMoney));
    }

    function closeLoja() {
        $(".loja-de-roupa").css("display", "none")
        $("#body").css("display", "none")
    }

    function checkOwnerStore(response) {
        $('#stock').hide();

        if (response.isForSale == true) {
            $('#buyStoreButton').show();
            forSalePrice = response.forSalePrice;
        } else if (response.isForSale == false) {
            $('#buyStoreButton').hide();
        }
            console.log("RESPONSE",typeof(response.playerID) != undefined);
        if(response.playerID != null){
            if (response.playerID == response.ownerID) {
                $('#owner').show();
                $('#sellStore').show();
                $('#cashier').show();
            } else {
                $('#owner').hide();
                $('#sellStore').hide();
                $('#cashier').hide();
            }
        }
    }

    function startDatatable(type_panel) {
        if(type_panel == 'stock'){
            $("#products").hide();
            $('#stock').show();
        }else{
            $("#products").show();
            $('#stock').hide();
        }
        if (dataTable) {
            dataTable.destroy();
        }

        dataTable = $('#datatable-products').DataTable({
            data: ProductsData,
            searching: true,
            iDisplayLength: 4,
            lengthChange : false,
            dom: '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>',
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Pesquisar...',
                sEmptyTable: "Nenhum produto está a venda",
                sInfo: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                sInfoEmpty: "Mostrando 0 até 0 de 0 registros",
                sInfoFiltered: "(Filtrados de _MAX_ registros)",
                sInfoThousands: ".",
                sLengthMenu: "_MENU_ resultados por página",
                sLoadingRecords: "Carregando...",
                sProcessing: "Processando...",
                sZeroRecords: "Nenhum registro encontrado",
                sSearch: "Pesquisar",
                oPaginate: {
                    "sNext": "Próximo",
                    "sPrevious": "Anterior",
                    "sFirst": "Primeiro",
                    "sLast": "Último"
                },
            },
            order: [0, 'asc'],
            columnDefs:
                [
                    {
                        targets: 0, orderable: true, width: '300px', render: function (data, type, row, meta) {
                            return `<span class="text-bold">${row.label}</span>`;
                        }
                    },
                    {
                        targets: 1, orderable: false, width: '100px', render: function (data, type, row, meta) {
                            return `<span class="text-bold">${formatter.format(row.price)}</span>`;
                        }
                    },
                    {
                        targets: 2, orderable: false, width: '100px', render: function (data, type, row, meta) {
                            return `<span class="text-bold">${row.stock}</span>`;
                        }
                    },
                    {
                        targets: 3,
                        orderable: false,
                        width: '10px',
                        className: 'text-right',
                        render: function (data, type, row, meta) {
                            return `<a class="btn btn-block bg-teal-300 buy-item" name="${row.label}" item="${row.name}" price="${row.price}" >Comprar</a>
                                    <a class="btn btn-block bg-teal-300 ajust-item" name="${row.label}" item="${row.name}" price="${row.price}" >Ajuste de preço</a>
            `;
                        }
                    },
                ],drawCallback: function () {
                $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').addClass('dropup');

                if ($('.dataTables_paginate span .paginate_button').length == 1) {
                    $('.dataTables_paginate').hide();
                    $('.datatable-footer').css('padding-top', 10);
                } else {
                    $('.dataTables_paginate').show();
                    $('.datatable-footer').css('padding-top', 20);
                }
            },
            preDrawCallback: function () {
                $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').removeClass('dropup');
            }
        });


        if(ownerId == userId){
            $('.buy-item').hide();
            $('.ajust-item').show();

        }else{
            $('.buy-item').show();
            $('.ajust-item').hide();
        };

        $('.ajust-item').on('click', function () {
            var item = $(this).attr('item')
            var label = $(this).attr('name')
            var price = $(this).attr('price')

            Swal.fire({
                title: `Informe o novo preço`,
                input: 'number',
                showCancelButton: true,
                confirmButtonText: 'Ajustar',
                cancelButtonText: 'Cancelar',
                showLoaderOnConfirm: true,
                preConfirm: (priceadjust) => {

                    $.post('http://mercado/ajustPrice', JSON.stringify({
                        'product': item,
                        'price': priceadjust,
                        'storeID': storeId
                    }));

                }
            });
        })


        $('.buy-item').on('click', function () {
            var item = $(this).attr('item')
            var label = $(this).attr('name')
            var price = $(this).attr('price')

            Swal.fire({
                title: `Qual a quantidade?`,
                input: 'number',
                showCancelButton: true,
                confirmButtonText: 'Comprar',
                cancelButtonText: 'Cancelar',
                showLoaderOnConfirm: true,
                preConfirm: (amount) => {
                    if(amount>0){
                        total_price = parseInt(amount) * parseInt(price);
                        Swal.fire({
                            title: `<span> Deseja comprar <b> ${amount} </b> ${label} por  <span style="color: green"> ${formatter.format(total_price)}</span>? </span>`,
                            confirmButtonText: 'Comprar',
                            showCancelButton: true,
                            cancelButtonText: 'Cancelar',
                            preConfirm: (confirm) => {
                                $.post('http://mercado/purchase', JSON.stringify({
                                    'product': item,
                                    'amount': amount,
                                    'storeID': storeId
                                }));
                            }
                        })
                    }else{
                        Swal.fire('Erro','Digite uma quantidade válida!','error');

                    }

                }
            });
        })

    }

    function startDatatableStock() {
        if (dataTableStock) {
            dataTableStock.destroy();
        }

        dataTableStock = $('#datatable-stock').DataTable({
            data: stockProducts,
            searching: true,
            iDisplayLength: 4,
            lengthChange : false,
            dom: '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>',
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Pesquisar...',
                lengthMenu: '_MENU_',
                search: '_INPUT_',
                searchPlaceholder: 'Pesquisar...',
                sEmptyTable: "Nenhum registro encontrado",
                sInfo: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                sInfoEmpty: "Mostrando 0 até 0 de 0 registros",
                sInfoFiltered: "(Filtrados de _MAX_ registros)",
                sInfoThousands: ".",
                sLengthMenu: "_MENU_ resultados por página",
                sLoadingRecords: "Carregando...",
                sProcessing: "Processando...",
                sZeroRecords: "Nenhum registro encontrado",
                sSearch: "Pesquisar",
                oPaginate: {
                    "sNext": "Próximo",
                    "sPrevious": "Anterior",
                    "sFirst": "Primeiro",
                    "sLast": "Último"
                },
            },
            order: [0, 'asc'],
            columnDefs:
                [
                    {
                        targets: 0, orderable: true, width: '300px', render: function (data, type, row, meta) {
                            return `<span class="text-bold">${row.label}</span>`;
                        }
                    },
                    {
                        targets: 1, orderable: false, width: '100px', render: function (data, type, row, meta) {
                            return `<span class="text-bold">${formatter.format(row.price)}</span>`;
                        }
                    },
                    {
                        targets: 2,
                        orderable: false,
                        width: '10px',
                        className: 'text-right',
                        render: function (data, type, row, meta) {
                            return `<a class="btn btn-block bg-teal-300 buy-item-stock" name="${row.label}" item="${row.name}" price="${row.price}" >Comprar</a>`;
                        }
                    },
                ],
        });

        $('.buy-item-stock').on('click', function () {
            var item = $(this).attr('item')
            var label = $(this).attr('name')
            var price = $(this).attr('price')

            Swal.fire({
                title: `Qual a quantidade?`,
                input: 'number',
                showCancelButton: true,
                confirmButtonText: 'Comprar',
                cancelButtonText: 'Cancelar',
                showLoaderOnConfirm: true,
                preConfirm: (amount) => {
                    if(amount>0){
                        total_price = parseInt(amount) * parseInt(price);
                        Swal.fire({
                            title: `<span> Deseja comprar <b> ${amount} </b> ${label} por  <span style="color: green"> ${formatter.format(total_price)}</span>? </span>`,
                            confirmButtonText: 'Comprar',
                            showCancelButton: true,
                            cancelButtonText: 'Cancelar',
                            preConfirm: (confirm) => {
                                $.post('http://mercado/purchaseStock', JSON.stringify({
                                    'label' : label,
                                    'product': item,
                                    'amount': amount,
                                    'price' : price,
                                    'storeID': storeId
                                }));
                            }
                        })
                    }else{
                        Swal.fire('Erro','Digite uma quantidade válida!','error');
                    }

                }
            });
        })

    }


    formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });


});

