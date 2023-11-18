$("#search-btn").click(async () => {
  try {
    const searchInputText = $("#search-input").val().trim();
    const response = await $.ajax({
      url: `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputText}`,
      dataType: "json", // Set the data type to JSON
    });

    // console.log(response);

    let output = "";
    if (response.meals) {
      response.meals.forEach((meal) => {
        output += `
        <div class="card shadow meal-item" style="width: 18rem;" data-id="${meal.idMeal}">             
        <img src="${meal.strMealThumb}" class="card-img-top" alt="food">              
        <div class="card-body">
          <h3 class="card-title py-2">${meal.strMeal}</h3>
          <a href="#" class="btn btn-danger recipe-btn">Get Recipe</a>
        </div>
      </div>`;
      });
      $("#meal-container").html(output);
    } else {
      // Handle the case where no meals are found
      output = "Sorry, we didn't find any meal.";
      $("#meal-container").addClass("text-danger fs-3 fw-bold").html(output);
    }
  } catch (error) {
    // Handle errors here
    console.error("Error fetching data:", error);
  }
});

//get meal recipe
// Add event listener after rendering the meals
//get meal recipe
// Add event listener after rendering the meals
$("#meal-container").on("click", ".recipe-btn", async (e) => {
  e.preventDefault();
  try {
    let mealItem = $(e.target).closest(".meal-item");
    let mealId = mealItem.data("id");

    console.log("Meal ID:", mealId);

    const response = await $.ajax({
      url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
      dataType: "json",
    });

    console.log(response);
    if (response.meals && response.meals.length > 0) {
      mealRecipeModal(response.meals);
    } else {
      console.error("No meal data found in the API response");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

// Function Modal
function mealRecipeModal(meal) {
  // Check if the meal array is not empty and has the expected structure
  if (
    meal &&
    meal.length > 0 &&
    meal[0].strInstructions &&
    meal[0].strMealThumb &&
    meal[0].strYoutube
  ) {
    let html = `
      <div class="modal fade bg-danger" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-center fw-semibold">Instructions</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>${meal[0].strInstructions}</p>            
              <img src="${meal[0].strMealThumb}" class="img-fluid" alt="food">   
              <div class="recipe-link mt-3">
                <a href="${meal[0].strYoutube}" target="_blank"><i class="bi bi-play-btn-fill me-2"></i>Watch Video</a>
              </div>  
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>           
            </div>
          </div>
        </div>
      </div>
    `;

    $(".meal-details-content").html(html);
    // Trigger the modal manually
    var myModal = new bootstrap.Modal(document.getElementById("exampleModal"));
    myModal.show();
  } else {
    console.error("Invalid meal data:", meal);

  }
}
