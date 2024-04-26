import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { communication } from '@src/communication/communication.ts';

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    async function createDocument() {
      const { id } = await communication.http.post('/documents');
      navigate(`/documents/${id}`);
    }
    createDocument();
  }, [navigate]);

  return <div></div>;
}

export default Home;
