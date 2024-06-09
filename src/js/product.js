$(document).ready(function () {
  // URL API
  var dataUrl = "http://127.0.0.1:8000/api/admin/products";
  var addProductUrl = "http://127.0.0.1:8000/api/admin/products"; // Adjust the URL if necessary
  var deleteProductUrl = "http://127.0.0.1:8000/api/admin/products"; // Adjust the URL if necessary
  var ImageUrl = "http://127.0.0.1:8000/storage/";

  // Fungsi untuk menangani kesalahan
  function handleError(jqXHR, textStatus, errorThrown) {
    console.error("Error: " + textStatus, errorThrown);
    $("#dataResult").text("Error: " + textStatus + " " + errorThrown);
  }

  // Fungsi untuk membuat tabel
  function createTable(data) {
    var table = $('<table class="table table-bordered"></table>');
    var thead = $("<thead><tr></tr></thead>");
    var tbody = $("<tbody></tbody>");

    // Buat header tabel
    Object.keys(data[0]).forEach(function (key) {
      thead.find("tr").append("<th>" + key + "</th>");
    });
    thead.find("tr").append("<th>Actions</th>");

    // Buat baris data
    data.forEach(function (item) {
      var row = $("<tr></tr>");
      Object.entries(item).forEach(function ([key, value]) {
        if (key === "image" && value !== "") {
          row.append(
            '<td><img src="' +
              ImageUrl +
              value +
              '" alt="Image" style="max-width:200px; max-height:200px;"></td>'
          );
        } else {
          row.append("<td>" + value + "</td>");
        }
      });
      row.append(
        '<td><button class="deleteProduct btn btn-danger" data-id="' +
          item.id +
          '">Delete</button></td>'
      );
      tbody.append(row);
    });

    table.append(thead).append(tbody);
    return table;
  }

  // Fetch data request
  $("#fetchData").click(function () {
    var token = localStorage.getItem("authToken"); // Ambil token dari localStorage
    var role = localStorage.getItem("userRole"); // Ambil peran dari localStorage

    if (!token) {
      $("#dataResult").text("You must login first!");
      return;
    }
    if (role !== "admin") {
      $("#dataResult").text("AKSES DITOLAK. HANYA ADMIN, YANG DAPAT MELIHAT!!");
      return;
    }

    if ($("#dataResult").is(":empty")) {
      // Fetch data if the dataResult div is empty
      $.ajax({
        url: dataUrl,
        type: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
        dataType: "json",
        success: function (data) {
          $("#dataResult").empty(); // Kosongkan hasil sebelumnya

          if (data.success) {
            // Menampilkan data dalam bentuk tabel
            $("#dataResult").append(createTable(data.data.products));
          } else {
            $("#dataResult").text("Data fetched is not an array.");
          }
        },
        error: handleError,
      });
    } else {
      // Hide data if it is already displayed
      $("#dataResult").empty();
    }
  });

  // Add product request
  $("#productForm").submit(function (event) {
    event.preventDefault();
    var token = localStorage.getItem("authToken");

    var productName = $("#productName").val();
    var productPrice = $("#productPrice").val();
    var productDescription = $("#productDescription").val();
    var productStock = $("#productStock").val();
    var productCategory = $("#productCategory").val();

    var formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("description", productDescription);
    formData.append("stock", productStock);
    formData.append("category_id", productCategory);

    var files = $("#productImage")[0].files;
    if (files.length > 0) {
      formData.append("image", files[0]);
    }

    $.ajax({
      url: addProductUrl,
      type: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      processData: false, // penting untuk file upload
      contentType: false, // penting untuk file upload
      data: formData,
      success: function (data) {
        if (data.success) {
          $("#dataResult").text("Product added successfully.");
          $("#productForm")[0].reset();
          $("#fetchData").click(); // Refresh data
        } else {
          $("#dataResult").text("Failed to add product.");
        }
      },
      error: handleError,
    });
  });

  // Delete product request
  $("#dataResult").on("click", ".deleteProduct", function () {
    var productId = $(this).data("id");
    var token = localStorage.getItem("authToken");

    $.ajax({
      url: deleteProductUrl + "/" + productId,
      type: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
      success: function (data) {
        if (data.success) {
          $("#dataResult").text("Product deleted successfully.");
          $("#fetchData").click(); // Refresh data
        } else {
          $("#dataResult").text("Failed to delete product.");
        }
      },
      error: handleError,
    });
  });
});
