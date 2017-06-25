/* globals $ */
var state = {
  isLandingPage: true,
}

function bindEvents() {
  $('.login-button').on('click', function(event) {
    event.preventDefault()
    state.isLandingPage = false;
    $('.signup-page').removeClass('hidden')
    router(state)
  })

  $('.login-form').on('submit', function(event) {
    event.preventDefault()
    state.isLandingPage = false;
    router(state)
  })

  // $('.form-signin').on('submit', function(event) {
  //   event.preventDefault()
  //   var payload = {}
  //   var formData = $( this ).serializeArray()
  //   formData.forEach(function(item) {
  //     payload[item.name] = item.value;
  //   })
  //   axios.post('/api/users', payload)
  //     .then(function(res) {
  //     })
  // })

  var form = $('#signup-form');
  form.on('submit', function(event){
    event.preventDefault();
    sendSignupDataToAPI(form);
  });
}

function sendSignupDataToAPI(form){
  var data = form.serializeArray().reduce((obj, item) => {
    obj[item.name] = item.value;
    return obj;
  }, {});
  debugger;
  /*$.ajax({
    url: '/api/users',
    method: 'POST',
    dataType: 'json',
    data: data
  })*/
  $.post('/api/users', data)
  .then((response) => {
    debugger;
    console.log('>> API response: ', response);
  })
  .catch((error) => {

    console.log('>> API error: ', error);
    handleError(error);
  });
}

function handleError(error){
  if(error.status === 409){
    alert('Duplicate Values');
  }
}

function router(state) {
  if(state.isLandingPage) {
    $('.landing-page').removeClass('hidden')
  } else {
    $('.landing-page').addClass('hidden')
  }
}

function main() {
  bindEvents()
}

$(document).ready(function() {
  main()
})
