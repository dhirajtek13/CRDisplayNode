  /*  Dummy urls Config: */
  var DB_FETCH_URL =
    "http://localhost:3000/api/fetch_response"; //TODO: Need to change. response coming like below:
  var DB_ADD_URL = "http://localhost:3000/api/add_response"; //TODO: Need to change 
  var DB_CHECKOUT_URL = "http://localhost:3000/api/checkout_response"; //TODO: Need to change 

  //actual code start 

  var tokenPrefix = '';
  var numbersArray = [];
  var tokenArray = [];
  var checkout_requests_time = [];
  var checkout_bags_arr = [];
  var checkout_bags_str = '';
  var container = $(".container");
  // box color background
  var bgcolorCombo = {
    first100: ["#663300", "#996633"],
    second100: ["#666666", "#999999"],
    third100: ["#663366", "#9900CC"],
    four100: ["#0066CC", "#0099FF"],
    five100: ["#336600", "#669900"],
  };

  // box font color
  var colorCombo = {
    first100: ["#FFFFFF", "#000000"],
    second100: ["#FFFFFF", "#000000"],
    third100: ["#FFFFFF", "#000000"],
    four100: ["#FFFFFF", "#000000"],
    five100: ["#FFFFFF", "#000000"],
  };

  fetch_existing_data();

  //FETCH EXISTING
  function fetch_existing_data(is_addNew = false, add_new_response_data = '') { 
    if (is_addNew !== false) {
      fetch_existing_data_action(add_new_response_data);
    } else {
      $.ajax({
        url: DB_FETCH_URL, // Replace with your API endpoint
        method: "GET",
        dataType: "json",
        success: function(data) {
          if (data) {
            fetch_existing_data_action(data);
          }
        },
        error: function(xhr, status, error) {
          // Handle any errors
          console.error("Error: " + status + " - " + error);
          alert(
            "error. please check console for details. might be sample api failure"
          );
        },
      });
    }
  }


  // ADD NEW
  function add_new() {
    //get the number
    let newTokn = $(".type_token").val();
    newTokn = newTokn.replace(/[^0-9\.]/g, ''); //set a Regex that only allows number 0-9 to be typed in the textbox
    if (newTokn && numbersArray.includes(newTokn) !== true) {
      var postData = {};
      var formatted_token = tokenPrefix + newTokn;
    //   postData['"' + formatted_token + '"'] = {
    //     token: formatted_token,
    //     time: Date.now(),
    //     display: newTokn
    //   };
      postData[ formatted_token ] = {
        token: formatted_token,
        time: Date.now(),
        display: newTokn
      };
      //ajaxCallPostNoResponse (DB_ADD_URL, postData);
      $.ajax({
        url: DB_ADD_URL, // Replace with the actual URL you want to send the POST request to
        type: 'POST',
        data: JSON.stringify(postData), // Serialize the object to JSON
        contentType: 'application/json', // Set the content type to JSON
        success: function(response) {
          // Handle the response from the server
          console.log('Response:', response + ". It will get added in 3 sec when new data will be fetched again. It will be like coming from database or endpoint. Have patience!");
          fetch_existing_data(true, response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          // Handle any errors
          console.error('Error:', textStatus, errorThrown);
        }
      });

      //add token into tokenNumberList//commented as no need to add again as when after 3 secs new data will be fetched that time this new number will be get added. it will be coming from database/endpoint
      /*       numbersArray.push(newTokn);
            checkout_requests_time[newTokn] = currentTime; */
      $(".type_token").val(""); //clear type_token
    } else {
      console.log(newTokn + " already in list");
    }
  }



  $(document).on("dblclick", ".box", function() {
    let numberToCheckout = $(this).attr("data-value");
    let tokenToCheckout = $(this).attr("data-token_value");

    numberToCheckout = Number(numberToCheckout);
    //TODO: call API to update checkout_requested  and bag_returned list in database
    //ajaxCallPostNoResponse (DB_CHECKOUT_URL, tokenToCheckout);
    $.ajax({
      url: DB_CHECKOUT_URL, // Replace with the actual URL you want to send the POST request to
      type: 'POST',
      data: JSON.stringify({tokenToCheckout}), 
      contentType: 'application/json', 
      success: function(response) {
        // Handle the response from the server
        console.log('Response:', response + ". It will get added in 3 sec when new data will be fetched again. It will be like coming from database or endpoint. Have patience!");

        //do not refresh page but
        //$("div[data-value='" + numberToCheckout + "']").remove();
        fetch_existing_data();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // Handle any errors
        //console.log('errr', textStatus, errorThrown, jqXHR);
        console.error('Error:', textStatus, errorThrown);
      }
    });

    //numbersArray = numbersArray.filter((item) => item !== numberToCheckout);

    checkout_bags_arr.push(numberToCheckout);
    let checkout_bags_str = checkout_bags_arr.slice(-5).join(", ");
    $('.checkout_bags').html(checkout_bags_str);

  });


  function checkTimestampDifference() {
    const currentTimestamp = Date.now();
    $(".box").each(function(index) {
      let this_timestamp = parseInt($(this).attr("data-timestamp_value"), 10);
      let timeDifference = currentTimestamp - this_timestamp;
      //Check if the time difference exceeds 2 minutes (120,000 milliseconds)
      if (timeDifference > 50000) {
        $(this).css("background-color", "red");
      }
    });
  }

  setInterval(function() {
    fetch_existing_data();
  }, 5000);

 // setInterval(fetch_existing_data(), 3000); //after each 3 secs update display box list on UI

  function updateGrid() {
    //fetch_existing_data();// it is now happening with setInterval 
    //clearInterval(intervalId);

    //var actual_numbersArray = numbersArray.filter((item) => item !== 0);
    container.empty();
    var screenWidth = $(window).width();
    var numColumns = 4;

    if (numbersArray.length < 4) {
      numColumns = numbersArray.length;
    }

    var tokenRange = "";
    var pickColorIndex = 0;
    //var numcolor = '#fff';
    //var numbgcolor = 'green'
    var numbgcolorAll = [];

    var seqColor = {
      first100: [],
      second100: [],
      third100: [],
      four100: [],
      five100: [],
    };

    for (var i = 0; i < numbersArray.length; i++) {
      if (
        (0 <= numbersArray[i] && numbersArray[i] <= 100) ||
        (500 <= numbersArray[i] && numbersArray[i] <= 600)
      ) {
        tokenRange = "first100";
        numbgcolorAll = getNumcolor(
          tokenRange,
          seqColor,
          pickColorIndex,
          numbgcolorAll
        );
      } else if (
        (100 < numbersArray[i] && numbersArray[i] <= 200) ||
        (600 < numbersArray[i] && numbersArray[i] <= 700)
      ) {
        tokenRange = "second100";
        numbgcolorAll = getNumcolor(
          tokenRange,
          seqColor,
          pickColorIndex,
          numbgcolorAll
        );
      } else if (
        (200 <= numbersArray[i] && numbersArray[i] <= 300) ||
        (700 <= numbersArray[i] && numbersArray[i] <= 800)
      ) {
        tokenRange = "third100";
        numbgcolorAll = getNumcolor(
          tokenRange,
          seqColor,
          pickColorIndex,
          numbgcolorAll
        );
      } else if (
        (300 <= numbersArray[i] && numbersArray[i] <= 400) ||
        (800 <= numbersArray[i] && numbersArray[i] <= 900)
      ) {
        tokenRange = "four100";
        numbgcolorAll = getNumcolor(
          tokenRange,
          seqColor,
          pickColorIndex,
          numbgcolorAll
        );
      } else if (
        400 <= numbersArray[i] <= 500 ||
        900 <= numbersArray[i] <= 1000
      ) {
        tokenRange = "five100";
        numbgcolorAll = getNumcolor(
          tokenRange,
          seqColor,
          pickColorIndex,
          numbgcolorAll
        );
      }

      var $box = $(
        '<div  class="box" data-value="' +
        numbersArray[i] +
        '" data-timestamp_value="' +
        checkout_requests_time[i] +
        '" data-token_value="' +
        tokenArray[i] +
        '"  style=" background-color: ' +
        numbgcolorAll[0] +
        "; color: " +
        numbgcolorAll[1] +
        '" >' +
        numbersArray[i] +
        "</div>"
      );
      container.append($box);
    }

    $(".box").width(96 / numColumns + "%");

    checkTimestampDifference();
  }

  //utility 3
  function getNumcolor(tokenRange, seqColor, pickColorIndex, numbgcolorAll) {
    var numbgcolorAll = [];
    if (seqColor[tokenRange].length !== 0) {
      pickColorIndex = seqColor[tokenRange][0] === 0 ? 1 : 0;
      seqColor[tokenRange] = [];
    }
    seqColor[tokenRange].push(pickColorIndex);
    numbgcolorAll[0] = bgcolorCombo[tokenRange][pickColorIndex];
    numbgcolorAll[1] = colorCombo[tokenRange][pickColorIndex];
    // numbgcolor = colorCombo[tokenRange][pickColorIndex];
    return numbgcolorAll;
  }


  function fetch_existing_data_action(data) {
    // data = data; //TODO: need to confirm once in add_new time and while normal fetching
    // let updatedResData = data;
    // if(updatedResData.data){
    //     updatedResData = updatedResData.data;
    // }
    var requested_token = data.requested_token;
    var returned_token = data.returned_token;

    tokenPrefix = '';
    numbersArray = [];
    tokenArray = [];
    checkout_requests_time = [];
    var parts = '';
    for (var key in requested_token) {
      if (requested_token.hasOwnProperty(key)) {
        var item = requested_token[key];
        tokenArray.push(item.token); // ["C1-PRY-01", "C1-PRY-33", "C1-PRY-04"]
        checkout_requests_time.push(item.time); // [1694596190966, 1694596190966, 1694596190966]

        parts = item.token.split(/(\d+)$/);
        if (parts.length === 3) {
          /* if(tokenPrefix == '') { //set once only
           tokenPrefix = parts[0]; // "C1-PRY-""
          } */
          var number = parts[1];
          numbersArray.push(number); // ["01", "33", "04"]
        }
      }
    }
    if (parts) {
      if (tokenPrefix == '') { //set once only
        tokenPrefix = parts[0]; // "C1-PRY-""
      }
    }

    //after fetching 'checkout_requested' then update display box list on UI
    updateGrid();
  }
