import axios from 'axios';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY || '';
const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY || '';
const PINATA_BASE_URL = 'https://api.pinata.cloud/pinning';

export const uploadFileToIPFS = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post(`${PINATA_BASE_URL}/pinFileToIPFS`, formData, {
    maxContentLength: Infinity,
    headers: {
      'Content-Type': 'multipart/form-data',
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  });
  return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
};

export const uploadJSONToIPFS = async (json: object): Promise<string> => {
  const res = await axios.post(
    `${PINATA_BASE_URL}/pinJSONToIPFS`,
    json,
    {
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    }
  );
  return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
};

export const fetchJSONFromIPFS = async (ipfsUrl: string): Promise<any> => {
  // Accepts either an ipfs://... or https://gateway.pinata.cloud/ipfs/... URL
  let url = ipfsUrl;
  if (ipfsUrl.startsWith('ipfs://')) {
    url = `https://gateway.pinata.cloud/ipfs/${ipfsUrl.replace('ipfs://', '')}`;
  }
  const res = await axios.get(url);
  return res.data;
};