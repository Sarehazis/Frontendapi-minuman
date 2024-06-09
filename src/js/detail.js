$(document).ready(function() {
    // URL API
    var dataUrl = 'http://127.0.0.1:8000/api/admin/products';
    var ImageUrl = 'http://127.0.0.1:8000/storage/';

    // Fungsi untuk menangani kesalahan
    function handleError(jqXHR, textStatus, errorThrown) {
        console.error('Error: ' + textStatus, errorThrown);
        $('#dataResult').text('Error: ' + textStatus + ' ' + errorThrown);
    }

    // Fungsi untuk membuat cart
    function createCart(data) {
        var cart = $('<div class="cart"></div>');

        data.forEach(function(item) {
            var productCard = $('<div class="product-card"></div>');

            var productImage = item.image ? '<img src="'+ ImageUrl + item.image + '" alt="Image" style="max-width:100px; max-height:100px;">' : '';
            var productName = '<p><strong>Name:</strong> ' + item.name + '</p>';
            var productStock = '<p><strong>Stock:</strong> ' + item.stock + '</p>';
            var productPrice = '<p><strong>Price:</strong> ' + item.price + '</p>';

            productCard.append(productImage, productName, productStock, productPrice);
            cart.append(productCard);
        });

        return cart;
    }

    // Fetch data request
    $('#fetchData').click(function() {
        var token = localStorage.getItem('authToken'); // Ambil token dari localStorage
        var role = localStorage.getItem('userRole'); // Ambil peran dari localStorage

        if (!token) {
            $('#dataResult').text('You must login first!');
            return;
        }
        if (role !== 'customer') {
            $('#dataResult').text('AKSES DITOLAK');
            return;
        }

        $.ajax({
            url: dataUrl,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            dataType: 'json',
            success: function(data) {
                $('#dataResult').empty(); // Kosongkan hasil sebelumnya
                
                if (data.success) {
                    // Menampilkan data dalam bentuk cart
                    $('#dataResult').append(createCart(data.data.categories));
                } else {
                    $('#dataResult').text('Data fetched is not an array.');
                }
            },
            error: handleError
        });
    });
});
