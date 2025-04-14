$(document).ready(function () {

// local url start
// var show_bid = 'http://127.0.0.1:8000/api/extension-api-others';

// local url end

// live url start 
var show_bid = 'https://purchase.datawise.pk/api/extension-api-others';
function toHalfWidth(str) {
  return str.replace(/[Ａ-Ｚ０-９]/g, function(ch) {
      return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
  });
}

    let currentUrl = window.location.href;
   
    var table =
      `<div style="right:15px;top:10px; width:130px;position:fixed;font-family: Gotham, Helvetica Neue, Helvetica, Arial, sans-serif !important;border-radius: 10px;padding:15px;background-color:rgb(248 224 20);z-index:10000" id="modal_selection_div_id">
      <button id="load_bid_uss" style="padding:3px 12px;width:100%">Show Bid</button>
      </div>`;

      let users_bid_div = "<div class='append_bids bid-header' style=' width: 220px;margin: 0 auto;float: inline-start;'></div>" 
   
      let user_bid_detail_page = "<div id='append_bids' class='bid-header' style=' width: 240px;margin-top:5px;'></div>";
      if (currentUrl.startsWith('https://www.uss-engine.com/tradecarlistraku.action')  || currentUrl.startsWith('https://www.uss-engine.com/tradecarlistspn.action')) {
      
        $(table).insertBefore('#container');
        $('.pc_list table tbody').each(function() { 
      
          if ($(this).attr('id')) {
            $(this).find('.seri_kekka').prepend(users_bid_div);
           
          }
        });
      
      }
      if (currentUrl.startsWith('https://www.uss-engine.com/tradecardetail.action')) {
        $(table).insertBefore('#contents');
        $('.contents_inner_area .index_inner_area02 .box01').append(user_bid_detail_page)
      
      }
      setTimeout(() => {
          $('#load_bid_uss').click();
      }, 2000);

      setTimeout(() => {
        $("#modal_selection_div_id").draggable();
    }, 1000);

  $('body').on('click', '#load_bid_uss', function () {

    cars_data_list = [];
    if(currentUrl.startsWith('https://www.uss-engine.com/tradecarlistraku.action') || currentUrl.startsWith('https://www.uss-engine.com/tradecarlistspn.action')){
      $('.pc_list table tbody').each(function() { 
         if ($(this).attr('id')) {
           let id =  $(this).attr('id');
           let number = id.replace(/\D/g, ''); // Removes all non-digit characters
          let auction_date = $('#AuctionDate'+number).val();
          let formatted_date = auction_date.replace(/\./g, '-');
          let lot_no = $('#BidNo'+number).val();
          // let model_no = $(this).find('td.shasyu').find('span.text br').next().text().trim().replace(/[()]/g, '');
          let valueInsideParentheses = '';
          var fullText = $(this).find('td.shasyu').find('span.text').text().trim();
          var match = fullText.match(/[（(]([^）)]+)[）)]/); // Supports both full-width and half-width parentheses
        
          if (match) {
              valueInsideParentheses = toHalfWidth(match[1].trim()); // The extracted value
          }
        
          // let model_no = $(this).find('td.shasyu').find('span.text br').text().trim().replace(/[()]/g, '');
          cars_data_list.push({ model: valueInsideParentheses, lot_no: lot_no, date: formatted_date });
         }
       });
    }

    if(currentUrl.startsWith('https://www.uss-engine.com/tradecardetail.action')){

      let lot_no_text = document.querySelector(".index_inner_area02 .box01 .car")?.innerText.trim();
      let lot_no = lot_no_text.match(/\d+/)?.[0] || ""; 
      // let lot_no_text = $(".index_inner_area02 .box01 .car").text().trim();
      // let lot_no_match = lot_no_text.match(/Car No\.\s*(\d+)/);
      // let lot_no = lot_no_match ? lot_no_match[1] : null;
      
      let auctionDateText = $(".index_inner_area02 .box01 li.date span").text().trim();

    // Regular Expression to match different date formats
    let dateMatch = auctionDateText.match(/(\d{4})年(\d{2})月(\d{2})日|(\w+) (\d{1,2}), (\d{4})/);

    let formattedDate = "";

    if (dateMatch) {
        if (dateMatch[1]) {
            // Case: "2025年03月27日 開催"
            let year = dateMatch[1];
            let month = dateMatch[2];
            let day = dateMatch[3];
            formattedDate = `${year}-${month}-${day}`; // "2025-03-27"
        } else if (dateMatch[4]) {
            // Case: "Held on March 27, 2025"
            let monthName = dateMatch[4];
            let day = dateMatch[5];
            let year = dateMatch[6];

            // Convert month name to number
            let monthNumber = new Date(`${monthName} 1, 2000`).getMonth() + 1;
            formattedDate = `${year}-${String(monthNumber).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
    }


      // let auctionDateText = $(".index_inner_area02 .box01  li.date span").text().trim();
      // let auction_date = null;
      // console.log(auctionDateText)
      // let dateMatch = auctionDateText.match(/(\w+) (\d+), (\d{4})/);
      // if (dateMatch) {
      //     let month = dateMatch[1];
      //     let day = dateMatch[2];
      //     let year = dateMatch[3];
      //     let monthNumber = new Date(Date.parse(month + " 1, 2025")).getMonth() + 1;
      //     auction_date = `${year}-${monthNumber.toString().padStart(2, '0')}-${day.padStart(2, '0')}`;
      // }

      let model_no = document.querySelector(".siyo_box table tr:nth-of-type(2) td:nth-of-type(2)")?.innerText;

      cars_data_list.push({ model: model_no, lot_no: lot_no, date: formattedDate });
    }
  
   			
    $.ajax({
        type: 'POST',
        url: show_bid,
        crossDomain: true,
        async: true,
        data: {  action: "uss_wp_bid", data: JSON.stringify(cars_data_list)},
        success: function (data) {
        if(data.data.length == 0){
            $('.pc_list table tbody').each(function() { 
              if ($(this).attr('id')) {
                let id =  $(this).attr('id'); 
                let number = id.replace(/\D/g, '');
                $('#tbody'+number).css('background-color','rgb(223 220 208)');
              }
           });
          alert('No record found!')
          return ;
        }
        $(".append_bids").each(function () {
          $(this).empty(); // Remove all content inside
        });
        
         if(currentUrl.startsWith('https://www.uss-engine.com/tradecarlistraku.action') || currentUrl.startsWith('https://www.uss-engine.com/tradecarlistspn.action')){
          $('.pc_list table tbody').each(function() { 
          
             if ($(this).attr('id')) {
               let id =  $(this).attr('id');
               let number = id.replace(/\D/g, ''); // Removes all non-digit characters
              let auction_date = $('#AuctionDate'+number).val();
              let lot_no = $('#BidNo'+number).val();

              let valueInsideParentheses = '';
              var fullText = $(this).find('td.shasyu').find('span.text').text().trim();
              var match = fullText.match(/[（(]([^）)]+)[）)]/); // Supports both full-width and half-width parentheses
              
              
              if (match) {
                  valueInsideParentheses = toHalfWidth(match[1].trim()); // The extracted value
              }
              let model_no = valueInsideParentheses;
             
              
              let matchedItems = data.data.filter(item =>
                item.formatted_date == auction_date &&
                item.lot_no == lot_no &&
                item.chassis_code == model_no
            );
           
            if (matchedItems) {
              let body_id = '#tbody' + number;
              var successful_bid = $(body_id + " .kingaku").contents().first().text().trim();
              var bidValue = parseFloat(successful_bid.replace(/,/g, '')) || 0;

              bidValue = (bidValue % 1 === 0) ? parseInt(bidValue, 10) : bidValue;
              // Convert to integer if it has no decimals, otherwise keep it as float
              // bidValue = (bidValue % 1 === 0) ? parseInt(bidValue, 10) : bidValue;
              if(matchedItems.length == 0  ){
                $('#tbody'+number).css('background-color','rgb(223 220 208)');
              }
              matchedItems.map(function(record){
                let max_rate = typeof record.rate === "string" ? 0 :record.rate;
               if($('#max_rate'+number).length > 0){
                let get_max_val = $('#max_rate'+number).val();
                if(max_rate > get_max_val){
                  $('#tbody'+number).find('.append_bids').html('');
                }
               }
                let hr_name = record.country.css_class;
                let show_bid_name = record.user.user_id + "(" + record.country.hr_name + ")";
                let  f_bid_price = record.rate;
                let  user_id = record.user.user_id;
                let  user_name = record.user.l_name;
                let sh_cntry = record.country.hr_name;
                let rate_color  =   (typeof record.rate === "number") ? getBidColor(bidValue,record.rate) : 'black';

             
                if(typeof record.rate != "string"){
                  if($('#max_rate'+number).length > 0){
                    let get_max_val = $('#max_rate'+number).val();
                    if(max_rate > get_max_val){
                      let user_bid = getUserData(show_bid_name,hr_name,f_bid_price,user_id,sh_cntry,record.expense,record.remark ?? '',rate_color,max_rate,number)
                      $('#tbody'+number).find('.append_bids').append(user_bid)
                     
                    }
                   }else{
                    let user_bid = getUserData(show_bid_name,hr_name,f_bid_price,user_id,sh_cntry,record.expense,record.remark ?? '',rate_color,max_rate,number)
                    $('#tbody'+number).find('.append_bids').append(user_bid)
                    
                   }
                  // let user_bid = getUserData(show_bid_name,hr_name,f_bid_price,user_id,sh_cntry,rate_color,max_rate,number)
                  // $('#tbody'+number).find('.append_bids').append(user_bid)
                }

                // let user_bid = getUserData(show_bid_name,hr_name,f_bid_price,user_id,sh_cntry,rate_color,max_rate,number)
                //   $('#tbody'+number).find('.append_bids').append(user_bid)
              
              });
             
            }
             
             }
           });
          }

          if(currentUrl.startsWith('https://www.uss-engine.com/tradecardetail.action') && data.data.length > 0){
            let successful_bid = $(".money dd").contents().first().text().trim();
            let bidValue = parseFloat(successful_bid.replace(/,/g, '')) || 0;

            bidValue = (bidValue % 1 === 0) ? parseInt(bidValue, 10) : bidValue;
           
           let user_bid =''; 
              data.data.map(function(record){
                let max_rate = typeof record.rate === "string" ? 0 : record.rate ;
          
                let hr_name = record.country.css_class;
                let show_bid_name = record.user.user_id + "(" + record.country.hr_name + ")";
                let  f_bid_price = record.rate;
                let  user_id = record.user.user_id;
                let sh_cntry = record.country.hr_name;
                let rate_color  =   (typeof record.rate === "number") ? getBidColor(bidValue,record.rate) : 'black';
                if( typeof record.rate != "string"){
                  user_bid += getUserData(show_bid_name,hr_name,f_bid_price,user_id,sh_cntry,record.expense,record.remark ?? '',rate_color,max_rate)
                }
              });
              $('#append_bids').html(user_bid)
              showHighestBid()
          }
        },
        error: function(xhr, status, error) {
          var errorMessage = xhr.status + ': ' + xhr.statusText;
          alert('Error - ' + errorMessage);
        }
      });

  
  });


  function getUserData(show_bid_name,hr_name,f_bid_price,user_id,sh_cntry,expense,remark,rate_color = 'black',max_rate=0,number=0){
    return getUserdataLikeIuacExt(show_bid_name,hr_name,f_bid_price,user_id,sh_cntry,expense,remark,rate_color ,max_rate,number);
  }

function getUserdataLikeIuacExt(show_bid_name, hr_name, f_bid_price, user_id, sh_cntry, expense, remark, rate_color = 'black', max_rate = 0, number = 0) {

  let user_name = getFirstName(user_id);
  let expense_deducted = `<span style="color: black; font-size: 14px; margin: 0 2px;font-weight:600">Trp: ${expense}</span>`;

  let add_bid =
      `<div style="background-color: rgb(248 224 20); padding: 3px; font-family: Arial; width: 100%; box-sizing: border-box;">
          <!-- First Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
              <span style="display: flex; align-items: center;">
                  <span title="${show_bid_name}" class="flag ${hr_name}" style="margin-right: 2px;"></span>
                  <div title="${sh_cntry}" style="white-space: nowrap; max-width: 80px; overflow: hidden; text-overflow: ellipsis; font-size: 13px;font-weight:600;color:black">${sh_cntry}</div>
              </span>
              ${expense_deducted}
              <span style="font-size: 13px; margin: 0 2px;color:black" title="${user_id}">👤 ${user_name}</span>
          </div>
          
          <!-- Second Row -->
          <div style="display: flex; gap: 3px; justify-content: center;">
              <input title="${show_bid_name}" 
                  style="width: 105px; font-weight: bold; padding: 5px; height: 20px; text-align: center; border-radius: 3px; border: none; background-color: white; color: ${rate_color}; box-sizing: border-box;"
                  class="already_bid_value njm_pre_price show_space_tb" disabled type="text" value="${f_bid_price}" placeholder="Bid...." />

              <input title="${show_bid_name}" 
                  style="width: 105px; font-weight: bold; padding: 5px; height: 20px; text-align: center; border-radius: 3px; border: none; background-color: white; box-sizing: border-box;"
                  class="already_bid_value njm_pre_ramarks" type="text" disabled value="${remark}" placeholder="Remarks...." />
          </div>

          <input id="max_rate${number}" class="max_rate_detail" type="hidden" value="${max_rate}">
      </div>`;

  return add_bid;
}


  function showHighestBid() {
    console.log('yes')
    let highestBidCard = null;
    let highestRate = -Infinity;

    $(".user_bid_shw_data").each(function () {
        let maxRate = parseFloat($(this).find(".max_rate_detail").val());

        if (maxRate > highestRate) {
            highestRate = maxRate;
            highestBidCard = $(this);
        }
    });

    // Hide all bid-cards except the highest one
    $(".user_bid_shw_data").hide();
    if (highestBidCard) {
        highestBidCard.show();
    }
}



function getBidColor(successfulBid, bidPrice) {
  let success_bid = successfulBid / 10;
  let threshold = bidPrice + (bidPrice * 0.10); // Add 10% of bid_Price
  return threshold < success_bid ? "red" : "black"; // Check condition
}

function getFirstName(name) {
  return name.split("_")[0]; // Split by '_' and return the first element
}
   
});
