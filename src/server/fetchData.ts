/*
"use server";
import axios from 'axios';
import {HttpsProxyAgent} from 'https-proxy-agent';

// Proxy URL
const proxyUrl = 'http://ozakzwmt:xnfgwh1v7ain@38.154.227.167:5868';

// Create an instance of HttpsProxyAgent
const agent = new HttpsProxyAgent(proxyUrl);

// Function to fetch data from a specific URL
export async function fetchData(url: string) {
  try {
    const response = await axios.get(url, { httpAgent: agent, httpsAgent: agent });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Error fetching data');
  }
}
*/