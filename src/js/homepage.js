$(document).ready(function () {
  var productUrl = "http://127.0.0.1:8000/api/admin/products";
  var categoryUrl = "http://127.0.0.1:8000/api/admin/categories";
  var imageUrl = "http://127.0.0.1:8000/storage/";

  function handleError(jqXHR, textStatus, errorThrown) {
    console.error("Error: " + textStatus, errorThrown);
    if (jqXHR.responseJSON) {
      console.error("Response JSON: ", jqXHR.responseJSON);
    }
  }

  function createTable(data, isProduct = false) {
    var table = $('<table class="table table-bordered"></table>');
    var thead = $("<thead><tr></tr></thead>");
    var tbody = $("<tbody></tbody>");

    // Create table headers
    Object.keys(data[0]).forEach(function (key) {
      thead.find("tr").append("<th>" + key + "</th>");
    });

    // Create table rows
    data.forEach(function (item) {
      var row = $("<tr></tr>");
      Object.entries(item).forEach(function ([key, value]) {
        if (isProduct && key === "image" && value !== "") {
          row.append(
            '<td><img src="' +
              imageUrl +
              value +
              '" alt="Image" style="max-width:200px; max-height:200px;"></td>'
          );
        } else {
          row.append("<td>" + value + "</td>");
        }
      });
      tbody.append(row);
    });

    table.append(thead).append(tbody);
    return table;
  }

  function fetchProducts() {
    var token = localStorage.getItem("authToken");
    if (!token) {
      $("#productResult").text("You must login first!");
      return;
    }

    $.ajax({
      url: productUrl,
      type: "GET",
      headers: { Authorization: "Bearer " + token },
      dataType: "json",
      success: function (data) {
        console.log("Products data: ", data);
        if (data.success) {
          $("#productResult").empty();
          $("#productResult").append(createTable(data.data.products, true));
        } else {
          $("#productResult").text("Failed to fetch products.");
        }
      },
      error: handleError,
    });
  }

  function fetchCategories() {
    var token = localStorage.getItem("authToken");
    if (!token) {
      $("#categoryResult").text("You must login first!");
      return;
    }

    $.ajax({
      url: categoryUrl,
      type: "GET",
      headers: { Authorization: "Bearer " + token },
      dataType: "json",
      success: function (data) {
        console.log("Categories data: ", data);
        if (data.success) {
          $("#categoryResult").empty();
          $("#categoryResult").append(createTable(data.data.categories));
        } else {
          $("#categoryResult").text("Failed to fetch categories.");
        }
      },
      error: handleError,
    });
  }

  fetchProducts();
  fetchCategories();
});
