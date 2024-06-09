$(document).ready(function () {
  // URL API
  var dataUrl = "http://127.0.0.1:8000/api/admin/categories";
  var addCategoryUrl = "http://127.0.0.1:8000/api/admin/categories";

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

    // Buat baris data
    data.forEach(function (item) {
      var row = $("<tr></tr>");
      Object.entries(item).forEach(function ([key, value]) {
        row.append("<td>" + value + "</td>");
      });
      tbody.append(row);
    });

    table.append(thead).append(tbody);
    return table;
  }

  // Fetch data request
  $("#fetchCategories").click(function () {
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

          if (Array.isArray(data.data)) {
            // Menampilkan data dalam bentuk tabel
            $("#dataResult").append(createTable(data.data));
          } else if (data.data && Array.isArray(data.data.categories)) {
            // Untuk kasus data yang memiliki properti categories yang berisi array
            $("#dataResult").append(createTable(data.data.categories));
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

  // Add category request
  $("#categoryForm").submit(function (event) {
    event.preventDefault();
    var token = localStorage.getItem("authToken");

    var categoryName = $("#categoryName").val();
    var categoryDescription = $("#categoryDescription").val();

    var formData = {
      name: categoryName,
      description: categoryDescription,
    };

    $.ajax({
      url: addCategoryUrl,
      type: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function (data) {
        console.log(data); // Tambahkan ini untuk melihat respons
        $("#dataResult").empty(); // Kosongkan hasil sebelumnya

        if (Array.isArray(data.data)) {
          // Menampilkan data dalam bentuk tabel
          $("#dataResult").append(createTable(data.data));
        } else if (data.data && Array.isArray(data.data.categories)) {
          // Untuk kasus data yang memiliki properti categories yang berisi array
          $("#dataResult").append(createTable(data.data.categories));
        } else {
          $("#dataResult").text("Data fetched is not an array.");
        }
        if (data.success) {
          $("#dataResult").text("Category added successfully.");
          $("#categoryForm")[0].reset();
          fetchCategories(); // Panggil fungsi untuk fetch data terbaru
        } else {
          $("#dataResult").text("Failed to add category.");
        }
      },
      error: handleError,
    });
  });
});
