/*
this is where all the service related functions are. these functions are called
by the endpoints defined in service.routes.js
*/

import { client } from '../server.js';

export async function getFlightsOfUser(req, res) {
  const result = await client.query(`
    SELECT f.*
    FROM Flight f
    JOIN Payment_Books_Service pbs ON f.ServiceType_Id = pbs.ServiceType_Id
    JOIN Payment p ON pbs.Payment_Id = p.Payment_Id
    JOIN User_Makes_Payment ump ON p.Payment_Id = ump.Payment_Id
    JOIN Users u ON ump.User_Id = u.User_Id
    WHERE u.User_Id = 1;`);
  res.send(result.rows);
}
