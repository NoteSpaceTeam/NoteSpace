import {useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {CommunicationContext} from "@/contexts/CommunicationContext.tsx";

function Home() {
  const navigate = useNavigate();
  const communication = useContext(CommunicationContext)
  useEffect(() => {
    async function createDocument() {
      const { id } = await communication.http.post('/documents');
      navigate(`/documents/${id}`);
    }
    createDocument();
  }, [communication.http, navigate]);

  return <div></div>;
}

export default Home;
