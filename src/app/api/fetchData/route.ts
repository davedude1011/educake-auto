import { NextResponse } from 'next/server';
import https from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';

const quizId = "135201463";

export async function GET() {
  const proxyUrl = 'http://ozakzwmt:xnfgwh1v7ain@206.41.172.74:6634';
  const agent = new HttpsProxyAgent(proxyUrl);

  const options = {
    hostname: 'my.educake.co.uk',
    path: `/api/student/quiz/${quizId}`,
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0",
        "Accept": "application/json;version=2",
        "Accept-Language": "en-US,en;q=0.5",
        "X-Correlation-Id": "540be4a3-c1fd-43a4-972b-9ff80217dcec",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjYzMjQxNzksIm5iZiI6MTcyNjMyNDE3OSwiZXhwIjoxNzI2MzI1OTgwLCJpc3MiOiJFZHVjYWtlIiwiYXVkIjoic2Vzc2lvbiIsInVpZCI6IjMwMDI3NTgiLCJyb2xlIjoic3R1ZGVudCIsInRpdGxlIjoiIiwiZmlyc3RfbmFtZSI6IlRob21hcyIsImxhc3RfbmFtZSI6IlNNQUxMV09PRCIsInNjaG9vbF9uYW1lIjoiUm9iZXJ0c2JyaWRnZSBDb21tdW5pdHkgQ29sbGVnZSIsInNjaG9vbF9hZGRyZXNzIjoiS25lbGxlIFJvYWQsIFJPQkVSVFNCUklER0UsIEVhc3QgU3Vzc2V4LCBVSywgVE4zMiA1RUEifQ.3l8LSSwjlfOXxmVEe8JQDaj2ptHeetnIJ6fmdIYqimE",
        
        "Sec-GPC": "1",
        "Sec-Fetch-Dest": "empty",
    },
    "referrer": "https://my.educake.co.uk/my-educake/quiz/135201463",
    "method": "GET",
    agent: agent,
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          resolve(NextResponse.json(data));
        } catch (err) {
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          reject(err);
          resolve(NextResponse.json({ error: 'Failed to parse response' }, { status: 500 }));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
      resolve(NextResponse.json({ error: 'Request failed' }, { status: 500 }));
    });

    req.end();
  });
}
