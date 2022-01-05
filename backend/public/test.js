function sendAnswers() {
  var data = [
    {
      formId: "Blah",
      questionId: "test",
      userId: "Mike",
      sessionId: "session1",
      answer: "This is a test",
    },
    {
      formId: "Blah",
      questionId: "testing",
      userId: "Mike",
      sessionId: "session1",
      answer: "This is a testing test",
    },
  ];
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/answers",
    data: { data: data },
    success: function(response, textStatus, jqXHR) {
      console.log(response);
    },
  });
}

function addSession() {
  var data = {
    formId: "d51d066a-c00a-4725-b1d1-b4fa83539bc6",
    userId: "admin",
  };
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/session",
    data: { data: data },
    success: function(response, textStatus, jqXHR) {
      console.log(response);
    },
  });
}

function updateTime() {
  var data = { session_id: "session1" };
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/update-session",
    data: { data: data },
    success: function(response, textStatus, jqXHR) {
      console.log(response);
    },
  });
}

function toggleSubmit() {
  var data = { session_id: "session1" };
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/toggle-submit-session",
    data: { data: data },
    success: function(response, textStatus, jqXHR) {
      console.log(response);
    },
  });
}
