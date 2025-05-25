import axios from 'axios';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_API_SECRET = import.meta.env.VITE_PINATA_SECRET_API_KEY;
const PINATA_BASE_URL = 'https://api.pinata.cloud/pinning';

if (!PINATA_API_KEY || !PINATA_API_SECRET) {
  throw new Error('Pinata API key/secret missing in environment variables');
}

export async function uploadFileToIPFS(file: File): Promise<string> {
  const url = `${PINATA_BASE_URL}/pinFileToIPFS`;
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(url, formData, {
    maxContentLength: Infinity,
    headers: {
      'Content-Type': 'multipart/form-data',
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_API_SECRET,
    },
  });
  // Returns the IPFS hash (CID)
  return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
}

export async function uploadJSONToIPFS(json: object): Promise<string> {
  const url = `${PINATA_BASE_URL}/pinJSONToIPFS`;
  const response = await axios.post(url, json, {
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_API_SECRET,
    },
  });
  return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
} 