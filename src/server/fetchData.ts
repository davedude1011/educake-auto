import https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';

const quizId = "135201463";
const jwtToken = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjYzMjE3NTksIm5iZiI6MTcyNjMyMTc1OSwiZXhwIjoxNzI2MzIzNTYwLCJpc3MiOiJFZHVjYWtlIiwiYXVkIjoic2Vzc2lvbiIsInVpZCI6IjMwMDI3NTgiLCJyb2xlIjoic3R1ZGVudCIsInRpdGxlIjoiIiwiZmlyc3RfbmFtZSI6IlRob21hcyIsImxhc3RfbmFtZSI6IlNNQUxMV09PRCIsInNjaG9vbF9uYW1lIjoiUm9iZXJ0c2JyaWRnZSBDb21tdW5pdHkgQ29sbGVnZSIsInNjaG9vbF9hZGRyZXNzIjoiS25lbGxlIFJvYWQsIFJPQkVSVFNCUklER0UsIEVhc3QgU3Vzc2V4LCBVSywgVE4zMiA1RUEifQ.CbllEBwg4w97_yYtpIj-PvVreJ-8Rk4US7ybEnB8U98";

export async function fetchData() {
  const proxyUrl = 'http://ozakzwmt:xnfgwh1v7ain@38.154.227.167:5868';
  const agent = new HttpsProxyAgent(proxyUrl);

  const options = {
    hostname: 'my.educake.co.uk',
    path: `/api/student/quiz/${quizId}`,
    method: 'GET',
    headers: {
      'Accept': 'application/json;version=2',
      'Authorization': jwtToken,
    },
    agent: agent,  // Use the proxy agent
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));  // Parse JSON response
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}
