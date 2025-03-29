## beavertrails backend B)

canadian travel app B)

### how to run

1. `cd backend` assuming you're in the beavertrails directory
2. `node server.js` to run the server

idk how else to test the api endpoints but how i did it was download postman (you can also use postman in the browser), put localhost:8080/{api-endpoint} and then press Send. there might be another way to do it tho

### changes made:

- march 29
  - database, added flight seat price, flight price, and bus seat price

### suggestions

- database, remove service type. it is better to have a separate id for flights, buses, hotel rooms, and activities
