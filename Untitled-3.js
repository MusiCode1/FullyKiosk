


fetch("http://homeassistant.local:8123/api/services/light/toggle", {
  "method": "POST",
  "headers": {
    "user-agent": "vscode-restclient",
    "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIwYzI3NGNlNGFjYzQ0Y2FkYmZmNTQxMDI0YTM2NzFlNiIsImlhdCI6MTcyNjY5Mjg2NywiZXhwIjoyMDQyMDUyODY3fQ.adXcvsNEPoRWORrVuopW-wcHXn-vzyP8yOuo95jEDRc",
    "content-type": "application/json"
  },
  "body": {
    "entity_id": "light.room_light"
  }
})
.then(response => {
  console.log(response);
})
.catch(err => {
  console.error(err);
});